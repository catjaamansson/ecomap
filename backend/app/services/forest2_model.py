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

    # Markera alla värden utom nodata (0)
    f2_mask = f2 > 0

    features = []
    for geom, value in shapes(
        f2.astype(np.int8),
        mask=f2_mask,
        transform=transform
    ):
        value = int(value)
        # Hoppa över nodata
        if value == 0:
            continue
        # Klassificera skog baserat på värde
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
    """
    Klassificerar skog baserat på värde
    1: Lövskog
    2: Barrskog
    0: Ingen skog
    """
    if value == 1:
        return "Lövskog"
    elif value == 2:
        return "Barrskog"
    else:
        return f"Okänd" 