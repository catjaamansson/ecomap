from pathlib import Path
import rasterio
import numpy as np
from rasterio.features import shapes
import json
from rasterio.mask import mask
from shapely.geometry import shape, mapping
from shapely.ops import transform
import pyproj


BASE_DIR = Path(__file__).resolve().parent.parent
WATER_BODIES_PATH = BASE_DIR / "data" / "waterbodies.tif"

def water_bodies_to_geojson():
    """
    Konverterar waterbodies.tif till GeoJSON
    Visar vattendrag och vattenytor klassificering
    """
    try:
        with rasterio.open(WATER_BODIES_PATH) as src:
            wb = src.read(1)
            transform = src.transform
    except FileNotFoundError:
        # Fallback if waterbodies.tif is not found, return an empty GeoJSON
        return {
            "type": "FeatureCollection",
            "features": []
        }

    # mark valid water body pixels (exclude nodata and invalid values)
    wb_mask = (wb > -128) & (wb != 255)

    features = []
    for geom, value in shapes(
        wb.astype(np.int8),
        mask=wb_mask,
        transform=transform
    ):
        value = int(value)
        # skip invalid values
        if value == -128 or value == 255:
            continue
        
        # classify water type based on value
        water_type = classify_water_bodies(int(value))
        
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "water_bodies_value": int(value),
                "water_bodies_type": water_type
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

def classify_water_bodies(value):
    water_classes = {
        0: "No watercycles",
        1: "Lakes",
        2: "Watercources",
        3: "Wetlands",
        4: "Groundwater",
        255: "No data"
    }
    
    if value in water_classes:
        return water_classes[value]
    else:
        return f"Water type {value}"

def analyze_water_bodies_area(geojson_geometry):
    geom_shape = shape(geojson_geometry)

    with rasterio.open(WATER_BODIES_PATH) as src:
        # transform the geometry to the raster's CRS if needed
        if src.crs and src.crs.to_string() != "EPSG:4326":
            transformer = pyproj.Transformer.from_crs("EPSG:4326", src.crs, always_xy=True)
            geom_shape = transform(transformer.transform, geom_shape)

        mask_shapes = [mapping(geom_shape)]
        nodata_val = src.nodata if src.nodata is not None else 255

        # clip the raster to the geometry and get the data
        out_image, _ = mask(src, mask_shapes, crop=True, nodata=nodata_val, filled=True)
        data = out_image[0]

        # Filter out nodata (e.g., -128, 255, 0 if 0 means "no water")
        valid_pixels = data[(data != nodata_val) & (data != -128) & (data != 255) & (data != 0)]

        total_pixels = len(valid_pixels)
        if total_pixels == 0:
            return {"total_sqm": 0, "breakdown": []}

        # Calculate m² per pixel
        px_w, px_h = src.res
        sqm_per_pixel = abs(px_w * px_h)
        if src.crs and "4326" in src.crs.to_string():
            sqm_per_pixel = 100.0  # Fallback to 100 m² per pixel for EPSG:4326, adjust as needed

        counts = {}
        for pixel_val in valid_pixels:
            val = int(pixel_val)
            counts[val] = counts.get(val, 0) + 1

        total_sqm = total_pixels * sqm_per_pixel
        breakdown = []

        for val, count in counts.items():
            name = classify_water_bodies(val)
            cat_sqm = count * sqm_per_pixel
            percent = round((count / total_pixels) * 100, 1)

            breakdown.append({
                "type": name,
                "sqm": round(cat_sqm, 2),
                "percent": percent
            })

        breakdown.sort(key=lambda x: x["sqm"], reverse=True)

        return {
            "total_sqm": round(total_sqm, 2),
            "breakdown": breakdown
        }