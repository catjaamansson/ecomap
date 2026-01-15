from pathlib import Path
import rasterio
import numpy as np
from rasterio.features import shapes
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

    # Markera alla värden utom nodata (-128)
    wq_mask = wq > -128

    features = []
    for geom, value in shapes(
        wq.astype(np.int8),
        mask=wq_mask,
        transform=transform
    ):
        value = int(value)
        # Hoppa över nodata
        if value == -128:
            continue
        # Klassificera vattenkvalitet baserat på värde
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

def classify_water_quality(value):
    """
    Klassificerar vattenkvalitet baserat på värde
    1-2: Bra (grön)
    3-4: Medel (gul)
    5-6: Dålig (orange)
    7+: Mycket dålig (röd)
    """
    if value >= 1 and value <= 2:
        return "Bra"
    elif value >= 3 and value <= 4:
        return "Medel"
    elif value >= 5 and value <= 6:
        return "Dålig"
    elif value >= 7:
        return "Mycket dålig"
    else:
        return f"Okänd ({value})" 