from pathlib import Path
import rasterio
import numpy as np
from rasterio.features import shapes
import json

BASE_DIR = Path(__file__).resolve().parent.parent
SM_PATH = BASE_DIR / "data" / "soilmoisture.tif"

def soil_moisture_to_geojson():
    """
    Konverterar soilmoisture.tif till GeoJSON
    Visar jordfuktighet klassificering
    """
    with rasterio.open(SM_PATH) as src:
        sm = src.read(1)
        transform = src.transform

    # Markera alla värden utom nodata (-128)
    sm_mask = sm > -128

    features = []
    for geom, value in shapes(
        sm.astype(np.int8),
        mask=sm_mask,
        transform=transform
    ):
        value = int(value)
        # Hoppa över nodata
        if value == -128:
            continue
        # Klassificera jordfuktighet baserat på värde
        sm_type = classify_soil_moisture(int(value))
        
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "soil_moisture_value": int(value),
                "soil_moisture_type": sm_type
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

def classify_soil_moisture(value):
    """
    Klassificerar jordfuktighet baserat på värde
    1-20: Bra jordfuktighet (grön)
    20-40: Acceptabel jordfuktighet (gul)
    40-60: Måttlig jordfuktighet (orange)
    60-80: Dålig jordfuktighet (röd)
    80-100: Mycket dålig jordfuktighet (mörkröd)
    """
    if value >= 1 and value <= 20:
        return "Bra"
    elif value >= 20 and value <= 40:
        return "Acceptabel"
    elif value >= 40 and value <= 60:
        return "Måttlig"
    elif value >= 60 and value <= 80:
        return "Dålig"
    elif value >= 80 and value <= 100:
        return "Mycket dålig"
    else:
        return f"Okänd" 