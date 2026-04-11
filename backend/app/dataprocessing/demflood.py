import rasterio
import numpy as np
from scipy.ndimage import binary_propagation

# läs in DEM 
with rasterio.open("backend/app/dataprocessing/dem_skane_compressed.tif") as dem_src:
    dem = dem_src.read(1)
    profile = dem_src.profile

# läs in havsmask
with rasterio.open("backend/app/dataprocessing/sea_mask_4326_aligned.tif") as sea_src:
    sea = sea_src.read(1)

# steg 1: markera låga områden 
low = dem <= 9.5

# steg 2: markera hav (seed) 
seed = sea == 1

# steg 3: flood-fill (om lågt område och hav i närheten, så översvämmas det låga området)
flood = binary_propagation(seed, mask=low)

# spara resultat som GeoTIFF
profile.update(dtype=rasterio.uint8, count=1)

with rasterio.open("backend/app/outputdata/flood_9.5m.tif", "w", **profile) as dst:
    dst.write(flood.astype(np.uint8), 1)

