from pathlib import Path
import rasterio
import numpy as np
from rasterio.features import shapes
import json

BASE_DIR = Path(__file__).resolve().parent.parent
DEM_PATH = BASE_DIR / "data" / "dem.tif"

def flood_to_geojson(water_level):
    with rasterio.open(DEM_PATH) as src:
        dem = src.read(1)
        transform = src.transform

    flooded = dem < water_level

    features = []
    for geom, value in shapes(
        flooded.astype(np.uint8),
        mask=flooded,
        transform=transform
    ):
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "flooded": True
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }