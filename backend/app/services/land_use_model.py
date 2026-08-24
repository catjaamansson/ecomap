from pathlib import Path
import rasterio
import numpy as np
from rasterio.features import shapes
import json
from rasterio.warp import transform as transform_coords
from shapely import geometry
from rasterio.mask import mask
from shapely.geometry import shape, mapping
from shapely.ops import transform
import pyproj

BASE_DIR = Path(__file__).resolve().parent.parent
LU_PATH = BASE_DIR / "data" / "land_use.tif"

def land_use_to_geojson():
    """
    Konverterar landuse.tif till GeoJSON
    Visar alla markanvändningstyper
    """
    with rasterio.open(LU_PATH) as src:
        lu = src.read(1)
        transform = src.transform

    # Mark valid land use pixels (exclude nodata)
    land_use_mask = lu > -128

    features = []
    for geom, value in shapes(
        lu.astype(np.int8),
        mask=land_use_mask,
        transform=transform
    ):
        value = int(value)
        # Skip no data
        if value == -128:
            continue
        # Classify land use type based on value
        land_use_type = classify_land_use(int(value))
        
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "land_use_value": int(value),
                "land_use_type": land_use_type
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

def classify_land_use(value):
    """
    Classifies land use types based on NMD values
    https://www.naturvardsverket.se/verktyg-och-tjanster/kartor-och-karttjanster/nationella-marktackedata/
    """

    CODE_ALIASES = {
        46: 217 #Urban green areas (46) should be treated as 217 (Urban green areas)
    }
    
    # Use the alias if it exists, otherwise use the original value
    target_code = CODE_ALIASES.get(value, value)

    land_use_classes = {
        218: {
        "name": "High-density urban area",
        "description": "Densely built-up urban centers where structures, roads, and paved surfaces cover the vast majority of the land."
        },
        240: {
            "name": "Residential area",
            "description": "Housing areas including single-family homes and apartment complexes, interspersed with gardens, yards, and local roads."
        },
        178: {
            "name": "Industrial area",
            "description": "Zones dedicated to industrial activities, manufacturing plants, commercial facilities, and logistical hubs."
        },
        88: {
            "name": "Roads and railways",
            "description": "Transportation infrastructure including motorways, railways, associated embankments, and station yards."
        },
        109: {
            "name": "Lakes / Coastal area",
            "description": "Infrastructure and modified land directly supporting maritime activities, such as commercial ports and docks."
        },
        124: {
            "name": "Airports",
            "description": "Aviation infrastructure including runways, taxiways, terminals, and surrounding managed grounds."
        },
        119: {
            "name": "Mineral extraction sites",
            "description": "Open-pit mines, quarries, gravel pits, and associated processing sites."
        },
        8: {
            "name": "Waste disposal sites",
            "description": "Active or historical landfills, dump sites, and industrial waste management facilities."
        },
        139: {
            "name": "Construction sites",
            "description": "Land currently undergoing excavation, building, or major infrastructure development."
        },
        217: {
            "name": "Urban green areas",
            "description": "Vegetated urban land including public parks, botanical gardens, and recreational green spaces."
        },
        203: {
            "name": "Sports and leisure facilities",
            "description": "Recreational areas such as golf courses, sports fields, camping sites, and leisure parks."
        },
        166: {
            "name": "Arable land",
            "description": "Cultivated farmland used for annual crop production such as cereals, legumes, and root crops."
        },
        2: {
            "name": "Fruit orchards",
            "description": "Parcels planted with fruit trees, berry plantations, or nut-bearing trees."
        },
        156: {
            "name": "Pastures",
            "description": "Enclosed, managed grasslands used regularly for livestock grazing or fodder production."
        },
        19: {
            "name": "Permanent crops",
            "description": "Land dedicated to perennial crops that occupy the soil for long periods without annual replanting."
        },
        154: {
            "name": "Agricultural land",
            "description": "Heterogeneous agricultural areas combining small crop fields, pastures, and farm structures."
        },
        113: {
            "name": "Deciduous forest",
            "description": "Woodlands dominated by broad-leaved broadleaf trees (e.g., oak, birch, beech) that shed leaves annually."
        },
        61: {
            "name": "Coniferous forest",
            "description": "Woodlands dominated by evergreen needle-leaf trees (e.g., pine, spruce)."
        },
        85: {
            "name": "Mixed forest",
            "description": "Forests with a balanced mix of both broad-leaved deciduous trees and needle-leaved coniferous trees."
        },
        245: {
            "name": "Natural grassland",
            "description": "Unmanaged or lightly grazed grasslands dominated by native grass species and wild flora."
        },
        29: {
            "name": "Open land - sandy ground",
            "description": "Sparsely vegetated coastal or inland areas dominated by exposed sand dunes and beaches."
        },
        255: {
            "name": "Open land - gravel and rock",
            "description": "Bare rock outcrops, scree, gravel beds, and areas with extremely sparse vegetation."
        },
        35: {
            "name": "Streams and rivers",
            "description": "Natural or modified inland running watercourses, including streams, rivers, and canals."
        },
        95: {
            "name": "Peat bogs",
            "description": "Wetlands characterized by acidic, waterlogged conditions and an accumulation of undecomposed peat moss."
        },
        37: {
            "name": "Coastal marshes",
            "description": "Vegetated tidally-influenced coastal wetlands regularly submerged by salt or brackish water."
        },
        110: {
            "name": "Lakes and waterbodies",
            "description": "Inland standing waterbodies, including natural lakes, reservoirs, and large ponds."
        },
        42: {
            "name": "Coastal lagoons",
            "description": "Unenclosed or semi-enclosed bodies of shallow salt or brackish water separated from the open sea by reefs or sandbars."
        },
        43: {
            "name": "Other permanent agricultural crops",
            "description": "Specialized perennial agricultural areas, such as agro-forestry systems combining trees and crops."
        },
        11: {
            "name": "Marine areas",
            "description": "Open marine waters, sea bays, and estuarine waters outside coastal land boundaries."
        },

        211: {
            "name": "Protected areas",
            "description": "Open marine waters, sea bays, and estuarine waters outside coastal land boundaries."
                },

        0: {
            "name": "No data / Unknown",
            "description": "Areas where satellite sensor data is missing, obscured by clouds, or unclassified."
        },
        -1: {
            "name": "Oceans and seas",
            "description": "Open marine waters, sea bays, and estuarine waters outside coastal land boundaries."
        },
    }  

    return land_use_classes.get(
        target_code,
        {
            "name": f"Code {value}",
            "description": f"Class with code {value} is not yet defined.",
        },
    )

def land_use_at_point(lat, lng):
    with rasterio.open(LU_PATH) as src:
        x, y = lng, lat

        if src.crs and src.crs.to_string() != "EPSG:4326":
            x_coords, y_coords = transform_coords("EPSG:4326", src.crs, [lng], [lat])
            x, y = x_coords[0], y_coords[0]

        sampled_value = next(src.sample([(x, y)]))[0]

    if sampled_value == -128:
        return {"error": "No data at this location"}

    sampled_value = int(sampled_value)

    return {
        "land_use_value": sampled_value,
        "land_use_type": classify_land_use(sampled_value)
    }

def analyze_land_use_area(geojson_geometry):
    # convert GeoJSON -> Shapely
    geom_shape = shape(geojson_geometry)

    with rasterio.open(LU_PATH) as src:
        # if the raster is not in EPSG:4326, transform the geometry to the raster's CRS
        if src.crs and src.crs.to_string() != "EPSG:4326":
            transformer = pyproj.Transformer.from_crs("EPSG:4326", src.crs, always_xy=True)
            geom_shape = transform(transformer.transform, geom_shape)

        # convert Shapely-geometry to GeoJSON-format for rasterio.mask
        mask_shapes = [mapping(geom_shape)]

        # Set nodata value safely
        nodata_val = src.nodata if (src.nodata is not None and src.nodata >= 0) else 0

        # clip raster after boundaries of the geometry and get the data
        out_image, out_transform = mask(
            src, 
            mask_shapes,       # Use the geometry to mask the raster
            crop=True, 
            nodata=nodata_val, 
            filled=True
        )
        
        data = out_image[0]
        valid_pixels = data[(data != nodata_val) & (data != 0) & (data != 255)]  # filter out nodata and invalid values

        total_pixels = len(valid_pixels)
        if total_pixels == 0:
            return {"total_sqm": 0, "breakdown": []}

        # Calculate the area of each pixel in square meters
        px_w, px_h = src.res
        sqm_per_pixel = abs(px_w * px_h)
        
        # If the raster is in degrees (EPSG:4326)
        if src.crs and "4326" in src.crs.to_string():
            sqm_per_pixel = 100.0  

        # Count occurrences of each land use type
        counts = {}
        for pixel_val in valid_pixels:
            val = int(pixel_val)
            counts[val] = counts.get(val, 0) + 1

        total_sqm = total_pixels * sqm_per_pixel
        breakdown = []

        for val, count in counts.items():
            info = classify_land_use(val)
            name = info.get("name", f"Code {val}") if isinstance(info, dict) else str(info)
            
            cat_sqm = count * sqm_per_pixel
            percent = round((count / total_pixels) * 100, 1)

            breakdown.append({
                "type": name,
                "sqm": round(cat_sqm, 2),
                "percent": percent
            })

        # Sort the breakdown by sqm in descending order
        breakdown.sort(key=lambda x: x["sqm"], reverse=True)

        return {
            "total_sqm": round(total_sqm, 2),
            "breakdown": breakdown
        }