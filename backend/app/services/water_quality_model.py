from pathlib import Path
import rasterio
import numpy as np
from rasterio.features import shapes
from rasterio.warp import transform as transform_coords
from rasterio.mask import mask
import pyproj
from shapely.geometry import shape, mapping
from shapely.ops import transform
import json

BASE_DIR = Path(__file__).resolve().parent.parent
WQ_PATH = BASE_DIR / "data" / "waterquality.tif"

def water_quality_to_geojson():
    """
    Konverterar waterquality.tif till GeoJSON
    Visar vattenkvalitet klassificering
    """
    with rasterio.open(WQ_PATH) as src:
        wq = src.read(1)
        transform = src.transform

    # Mark valid water quality pixels (exclude nodata)
    wq_mask = wq > -128

    features = []
    for geom, value in shapes(
        wq.astype(np.int8),
        mask=wq_mask,
        transform=transform
    ):
        value = int(value)
        # Skip no data
        if value == -128:
            continue
        # Classify water quality based on value 
        wq_type = classify_water_quality(int(value))
        
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "water_quality_value": int(value),
                "water_quality_type": wq_type
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

def water_quality_at_point(lat, lng):
    with rasterio.open(WQ_PATH) as src:
        x, y = lng, lat

        if src.crs and src.crs.to_string() != "EPSG:4326":
            x_coords, y_coords = transform_coords("EPSG:4326", src.crs, [lng], [lat])
            x, y = x_coords[0], y_coords[0]

        sampled_value = next(src.sample([(x, y)]))[0]

    if sampled_value == -128:
        return {"error": "No data at this location"}

    sampled_value = int(sampled_value)

    return {
        "water_quality_value": sampled_value,
        "water_quality_type": classify_water_quality(sampled_value)
    }

def classify_water_quality(value):
    if value >= 1 and value <= 20:
        return "Good"
    elif value >= 20 and value <= 40:
        return "Acceptable"
    elif value >= 40 and value <= 60:
        return "Moderate"
    elif value >= 60 and value <= 80:
        return "Poor"
    elif value >= 80 and value <= 100:
        return "Very Poor"
    else:
        return f"Unclassified / Land"

def analyze_water_quality_area(geojson_geometry, total_sq_meters=None):
    try:
        geom_shape = shape(geojson_geometry)

        with rasterio.open(WQ_PATH) as src:
            if src.crs and src.crs.to_string() != "EPSG:4326":
                transformer = pyproj.Transformer.from_crs("EPSG:4326", src.crs, always_xy=True)
                geom_shape = transform(transformer.transform, geom_shape)

            mask_shapes = [mapping(geom_shape)]

            # Läs av nodata direkt från filen, eller använd 0 som fallback för uint8
            nodata_val = src.nodata if src.nodata is not None else 0

            out_image, out_transform = mask(
                src, 
                mask_shapes, 
                crop=True, 
                nodata=nodata_val, 
                filled=True
            )
            
            data = out_image[0]
            
            # Filtrera bort nodata-pixlar
            valid_pixels = data[(data != nodata_val) & (data != 0)]

            total_pixels = len(valid_pixels)
            if total_pixels == 0:
                return {"breakdown": []}

            counts = {}
            for pixel_val in valid_pixels:
                val = int(pixel_val)
                category_name = classify_water_quality(val)

                # Om det ändå blir Unknown, hoppa över och räkna inte med den
                if category_name == "Unclassified / Land":
                    continue

                counts[category_name] = counts.get(category_name, 0) + 1

            px_w, px_h = src.res
            fallback_sqm_per_pixel = abs(px_w * px_h)
            calculated_total_sqm = total_sq_meters if total_sq_meters else (total_pixels * fallback_sqm_per_pixel)

            breakdown = []
            for cat_name, count in counts.items():
                percent = (count / total_pixels) * 100
                cat_sqm = (percent / 100) * calculated_total_sqm

                breakdown.append({
                    "type": cat_name,
                    "sqm": round(cat_sqm, 2),
                    "percent": round(percent, 1)
                })

            breakdown.sort(key=lambda x: x["percent"], reverse=True)
            return {"breakdown": breakdown}

    except Exception as e:
        print(f"Error in water quality area analysis: {e}")
        return {"breakdown": []}