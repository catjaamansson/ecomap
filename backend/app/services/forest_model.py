from pathlib import Path
import rasterio
import numpy as np
from rasterio.features import shapes
import json
from rasterio.io import MemoryFile
import os

BASE_DIR = Path(__file__).resolve().parent.parent
FOREST_PATH = BASE_DIR / "data" / "forest_3035_skane_50m.tif"

def forest_to_geojson():
    print(f"DEBUG: FOREST_PATH = {FOREST_PATH}")
    print(f"DEBUG: File exists = {os.path.exists(FOREST_PATH)}")
    
    with rasterio.open(FOREST_PATH) as src:
        print(f"DEBUG: Opened file successfully")
        print(f"DEBUG: CRS = {src.crs}")
        forest = src.read(1)
        print(f"DEBUG: Forest shape = {forest.shape}, dtype = {forest.dtype}")
        print(f"DEBUG: Unique values = {np.unique(forest)[:20]}") 
        transform = src.transform
        
        # Decimate the raster to reduce the number of features for performance
        decimation_factor = 10
        forest_decimated = forest[::decimation_factor, ::decimation_factor]
        
        # Adjust transform for decimated data
        from rasterio.transform import Affine
        decimated_transform = Affine(
            transform.a * decimation_factor,
            transform.b,
            transform.c,
            transform.d,
            transform.e * decimation_factor,
            transform.f
        )

    # Mark valid forest pixels (exclude nodata)
    forest_mask = forest_decimated != 255

    features = []
    for geom, value in shapes(
        forest_decimated.astype(np.uint8),
        mask=forest_mask,
        transform=decimated_transform
    ):
        value = int(value)
        # Skip no data
        if value == 255:
            continue
        # Classify forest type based on value
        forest_type = classify_forest(int(value))
        
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "forest_value": int(value),
                "forest_type": forest_type
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

def classify_forest(value):
    forest_classes = {
        0: "No Forest",
        1: "Forest",
        2: "Other Vegetation",
        255: "Unknown"
    }
    
    # Fallback if the value is not in the predefined classes
    if value in forest_classes:
        return forest_classes[value]
    else:
        # Try to infer based on patterns
        # Even values (0,4,8,12...) = a type, odd = variant
        base = (value // 4) * 4
        if base in forest_classes:
            return f"{forest_classes[base]} (variant {value})"
        return f"Forest Type {value}" 
    