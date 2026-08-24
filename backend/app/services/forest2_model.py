from pathlib import Path
import rasterio
import numpy as np
from rasterio.features import shapes
import json

BASE_DIR = Path(__file__).resolve().parent.parent
F2_PATH = BASE_DIR / "data" / "forest2.tif"

def forest2_to_geojson():
    """
    Konverterar forest2.tif till GeoJSON
    Visar skogsklassificering
    """
    with rasterio.open(F2_PATH) as src:
        f2 = src.read(1)
        transform = src.transform

    # Mark valid forest pixels (exclude nodata)
    f2_mask = f2 > 0

    features = []
    for geom, value in shapes(
        f2.astype(np.int8),
        mask=f2_mask,
        transform=transform
    ):
        value = int(value)
        # Skip no data
        if value == 0:
            continue
        # Classify forest based on value
        f2_type = classify_forest2(int(value))
        
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "forest2_value": int(value),
                "forest2_type": f2_type
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

def classify_forest2(value):
    if value == 1:
        return "Deciduous Forest"
    elif value == 2:
        return "Coniferous Forest"
    else:
        return f"Unknown" 