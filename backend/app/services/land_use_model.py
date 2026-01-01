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
        1: "Bebyggelse - tätt",
        2: "Jordbruk - åkermark",
        3: "Jordbruk - permanent gräsmark",
        4: "Jordbruk - övrig jordbruksmark",
        5: "Skogsmark - tall",
        6: "Skogsmark - gran",
        7: "Skogsmark - löv",
        8: "Skogsmark - övrig skog",
        9: "Myr",
        10: "Öppen fjällmark",
        11: "Snötäckt fjäll",
        12: "Skogsmark - blandad",
        16: "Öppen mark - annan",
        18: "Jordbruk - buskmark",
        20: "Bebyggelse - spridd",
        21: "Vatten - sjö",
        23: "Bebyggelse - övrig",
        24: "Våtmark",
        25: "Bebyggelse - vägar och vägnät",
        26: "Öppen mark - berg",
        29: "Öppen mark - sandig mark",
        30: "Öppen mark - grus och sten",
        35: "Vatten - bäck och å",
        36: "Vatten - kanal",
        37: "Vatten - annan vattenarea",
        41: "Jordbruk - fruktodling",
        42: "Jordbruk - vingård",
        43: "Jordbruk - annan permanent gröda",
        44: "Jordbruk - övrig",
        -128: "Nodata/Okänd"
    }
    return land_use_classes.get(value, f"Okänd klassificering ({value})")