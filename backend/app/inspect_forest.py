"""
Script för att undersöka forest.tiff-datan
Kör detta för att se vilka värden som finns i filen
"""
from pathlib import Path
import rasterio
import numpy as np

FOREST_PATH = Path(__file__).parent / "data" / "forest.tiff"

print(f"Söker efter data i: {FOREST_PATH}")
print(f"Filen finns: {FOREST_PATH.exists()}")

if FOREST_PATH.exists():
    with rasterio.open(FOREST_PATH) as src:
        print(f"\n--- Rasterfil Info ---")
        print(f"Shape (höjd x bredd): {src.shape}")
        print(f"CRS (koordinatsystem): {src.crs}")
        print(f"Datatypes: {src.dtypes}")
        print(f"Nodata värde: {src.nodata}")
        
        # Läs banddata
        data = src.read(1)
        print(f"\n--- Datavärden ---")
        print(f"Min värde: {np.min(data)}")
        print(f"Max värde: {np.max(data)}")
        print(f"Unika värden (max 50): {sorted(np.unique(data))[:50]}")
        print(f"Antal unika värden: {len(np.unique(data))}")
        
        # Räkna förekomster
        unique, counts = np.unique(data, return_counts=True)
        print(f"\n--- Värdefördelning ---")
        for val, count in sorted(zip(unique, counts))[:20]:
            print(f"  Värde {val}: {count} pixlar ({100*count/data.size:.1f}%)")
else:
    print("forest.tiff hittades inte!")
