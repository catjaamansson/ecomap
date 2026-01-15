from pathlib import Path
import rasterio
import numpy as np
from rasterio.features import shapes
import json
from rasterio.io import MemoryFile
import os

BASE_DIR = Path(__file__).resolve().parent.parent
FOREST_PATH = BASE_DIR / "data" / "forest.tif"

def forest_to_geojson():
    """
    Konverterar forest.tiff till GeoJSON
    Visar olika skogsklassificeringar
    
    OPTIMERAT: Decimerar rasterfilen för snabbare konvertering
    """
    print(f"DEBUG: FOREST_PATH = {FOREST_PATH}")
    print(f"DEBUG: File exists = {os.path.exists(FOREST_PATH)}")
    
    with rasterio.open(FOREST_PATH) as src:
        print(f"DEBUG: Opened file successfully")
        forest = src.read(1)
        print(f"DEBUG: Forest shape = {forest.shape}, dtype = {forest.dtype}")
        print(f"DEBUG: Unique values = {np.unique(forest)[:20]}") 
        transform = src.transform
        
        # Decimera för snabbare bearbetning (var 10:e pixel)
        # Ändra decimation_factor för mindre/mer detail
        decimation_factor = 10
        forest_decimated = forest[::decimation_factor, ::decimation_factor]
        
        # Justera transform för decimerad data
        from rasterio.transform import Affine
        decimated_transform = Affine(
            transform.a * decimation_factor,
            transform.b,
            transform.c,
            transform.d,
            transform.e * decimation_factor,
            transform.f
        )

    # Markera alla värden utom nodata (255)
    forest_mask = forest_decimated != 255

    features = []
    for geom, value in shapes(
        forest_decimated.astype(np.uint8),
        mask=forest_mask,
        transform=decimated_transform
    ):
        value = int(value)
        # Hoppa över nodata
        if value == 255:
            continue
        # Klassificera skogstyp baserat på värde
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
    """
    Klassificerar skogstyper baserat på rastervärden
    
    Värdena följer ett mönster (0, 1, 4, 5, 8, 9...) som kan representera:
    - Jämna nummer: En kategori (ex. ren barr/löv)
    - Udda nummer: En underkategori eller blandning
    
    UPPDATERA DETTA baserat på din datakälla!
    Se dokumentation för forest.tiff eller kontakta dataprovider.
    """
    # MALL: Uppdatera dessa värden baserat på din faktiska datakälla
    forest_classes = {
        0: "Öppen mark / Ingen skog",
        1: "Öppen mark / Gles vegetation",
        
        # Barrskog
        4: "Barrskog - tät",
        5: "Barrskog - glest",
        
        # Lövskog
        8: "Lövskog - tät",
        9: "Lövskog - glest",
        
        # Blandad skog
        12: "Blandad skog - tät",
        13: "Blandad skog - glest",
        
        # Ungskog/Ungskog
        16: "Ungskog - barrskog",
        17: "Ungskog - lövskog",
        
        # Moränskogen
        20: "Myr/Torvmark",
        21: "Myr - bewuxen",
        
        255: "Nodata/Okänd"
    }
    
    # Fallback för okända värden - försök att klassificera baserat på område
    if value in forest_classes:
        return forest_classes[value]
    else:
        # Försök att härleda baserat på mönster
        # Även värden (0,4,8,12...) = en typ, udda = variant
        base = (value // 4) * 4
        if base in forest_classes:
            return f"{forest_classes[base]} (variant {value})"
        return f"Skogstyp {value}" 