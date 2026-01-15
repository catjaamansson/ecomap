from pathlib import Path
import rasterio
import numpy as np
from rasterio.features import shapes
import json

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
        # Fallback om waterbodies.tif inte existerar
        return {
            "type": "FeatureCollection",
            "features": []
        }

    # Markera alla värden utom nodata (-128 eller 255)
    wb_mask = (wb > -128) & (wb != 255)

    features = []
    for geom, value in shapes(
        wb.astype(np.int8),
        mask=wb_mask,
        transform=transform
    ):
        value = int(value)
        # Hoppa över nodata
        if value == -128 or value == 255:
            continue
        
        # Klassificera vattentyp baserat på värde
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
    """
    Klassificerar vattentyp baserat på rastervärden
    
    Vanliga klassificeringar:
    0: Ingen vattencykel
    1: Sjöar
    2: Vattendrag/Bäckar
    3: Våtmarker
    4: Grundvatten
    
    UPPDATERA dessa värden baserat på din faktiska datakälla
    """
    water_classes = {
        0: "Ingen vattencykel",
        1: "Sjöar",
        2: "Vattendrag",
        3: "Våtmarker",
        4: "Grundvatten",
        255: "Nodata/Okänd"
    }
    
    if value in water_classes:
        return water_classes[value]
    else:
        return f"Vattentyp {value}"
