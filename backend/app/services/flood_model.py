from pathlib import Path
import rasterio
import numpy as np

BASE_DIR = Path(__file__).resolve().parent.parent
DEM_PATH = BASE_DIR / "data" / "dem.tif"

def flood_from_level(dem_path, water_level):
    with rasterio.open(dem_path) as src:
        dem = src.read(1)
        flooded = dem < water_level

    return flooded