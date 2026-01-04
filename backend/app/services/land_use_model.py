from pathlib import Path
import rasterio
import numpy as np
from rasterio.features import shapes
import json

BASE_DIR = Path(__file__).resolve().parent.parent
LU_PATH = BASE_DIR / "data" / "landuse.tif"

def land_use_to_geojson():
    """
    Konverterar landuse.tif till GeoJSON
    Visar alla markanvändningstyper
    """
    with rasterio.open(LU_PATH) as src:
        lu = src.read(1)
        transform = src.transform

    # Markera alla värden utom nodata (-128)
    land_use_mask = lu > -128

    features = []
    for geom, value in shapes(
        lu.astype(np.int8),
        mask=land_use_mask,
        transform=transform
    ):
        value = int(value)
        # Hoppa över nodata
        if value == -128:
            continue
        # Klassificera markanvändningstyp baserat på värde
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
    Klassificerar markanvändningstyper baserat på NMD-värden
    https://www.naturvardsverket.se/verktyg-och-tjanster/kartor-och-karttjanster/nationella-marktackedata/
    """
    land_use_classes = {
        1: "Tättbebyggda områden",
        2: "Bostadsområden",
        3: "Industriområden",
        4: "Vägar och järnvägar",
        5: "Kustområden",
        6: "Flygplatser",
        7: "Mineralutvinningsplatser",
        8: "Sophanteringsplatser",
        9: "Byggarbetsplatser",
        10: "Stadsnära områden",
        11: "Sport- och fritidsanläggningar",
        12: "Åkermark",
        16: "Fruktodling",
        18: "Betesmarker",
        20: "Permanent odling",
        21: "Jordbruk",
        23: "Lövskog",
        24: "Barrskog",
        25: "Blandad skog",
        26: "Naturlig gräsmark",
        29: "Öppen mark - sandig mark",
        30: "Öppen mark - grus och sten",
        35: "Vatten - bäck och å",
        36: "Torvmossar",
        37: "Kustområden",
        41: "Sjöar och vattendrag",
        42: "Kustlagun",
        43: "Jordbruk - annan permanent gröda",
        44: "Havsområde",
        -128: "Nodata/Okänd"
    }
    return land_use_classes.get(value, f"Okänd klassificering ({value})") 