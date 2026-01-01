from pathlib import Path
import rasterio
import numpy as np
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent
LU_PATH = BASE_DIR / "app" / "data" / "landuse.tif"

def inspect_landuse():
    """Inspektera landuse.tif för att se vilka värden det innehåller"""
    
    if not LU_PATH.exists():
        print(f"Filen finns inte: {LU_PATH}")
        return
    
    with rasterio.open(LU_PATH) as src:
        lu = src.read(1)
        print(f"Rasterform: {lu.shape}")
        print(f"Data typ: {lu.dtype}")
        print(f"Min värde: {lu.min()}")
        print(f"Max värde: {lu.max()}")
        print(f"CRS: {src.crs}")
        print(f"Transform: {src.transform}")
        print()
        
        # Räkna värden
        unique_values = np.unique(lu)
        print(f"Unika värden: {unique_values}")
        print()
        
        # Visa frekvens för varje värde
        counter = Counter(lu.flatten())
        print("Värdfrekvens:")
        for value in sorted(counter.keys()):
            if value != 0:  # Hoppa över 0/nodata
                count = counter[value]
                percentage = (count / lu.size) * 100
                print(f"  Värde {value}: {count} pixels ({percentage:.2f}%)")

if __name__ == "__main__":
    inspect_landuse()
