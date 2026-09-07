from pathlib import Path
import rasterio
import rasterio.mask
import numpy as np
from rasterio.features import shapes

BASE_DIR = Path(__file__).resolve().parent.parent
DEM_PATH = BASE_DIR / "data" / "dem.tif"

def flood_to_geojson(water_level):
    with rasterio.open(DEM_PATH) as src:
        dem = src.read(1)
        transform = src.transform

    flooded = dem < water_level

    features = []
    for geom, value in shapes(
        flooded.astype(np.uint8),
        mask=flooded,
        transform=transform
    ):
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "flooded": True
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

def analyze_flood_area(geometry, water_level, total_sqm=0):
    """
    Klipper DEM-rastern mot den inskickade polygonen (geometry)
    och beräknar hur stor del av området som ligger under water_level.
    """
    if not geometry or water_level is None:
        return {
            "flooded_sqm": 0,
            "flooded_percentage": 0,
            "breakdown": []
        }

    try:
        with rasterio.open(DEM_PATH) as src:
            out_image, out_transform = rasterio.mask.mask(
                src,
                [geometry],
                crop=True,
                filled=False,
            )
            dem_crop = out_image[0]
            valid_mask = ~np.ma.getmaskarray(dem_crop)
            dem_values = np.ma.getdata(dem_crop)

            total_pixels = np.count_nonzero(valid_mask)

            if total_pixels == 0:
                return {
                    "flooded_sqm": 0,
                    "flooded_percentage": 0,
                    "breakdown": []
                }

            flooded_pixels = np.count_nonzero((dem_values < water_level) & valid_mask)
            flooded_percentage = float(round((flooded_pixels / total_pixels) * 100, 1))

            if total_sqm > 0:
                flooded_sqm = float(round(total_sqm * (flooded_pixels / total_pixels), 2))
            else:
                pixel_area = abs(out_transform[0] * out_transform[4])
                flooded_sqm = float(round(flooded_pixels * pixel_area, 2))

            dry_sqm = max(0, total_sqm - flooded_sqm) if total_sqm > 0 else 0

            return {
                "flooded_sqm": flooded_sqm,
                "flooded_percentage": flooded_percentage,
                "breakdown": [
                    {
                        "name": "Översvämmad mark",
                        "sqm": flooded_sqm,
                        "percentage": flooded_percentage
                    },
                    {
                        "name": "Torr mark",
                        "sqm": dry_sqm,
                        "percentage": round(100 - flooded_percentage, 1)
                    }
                ]
            }

    except Exception as e:
        print(f"[FLOOD ANALYSIS ERROR] {e}")
        return {
            "flooded_sqm": 0,
            "flooded_percentage": 0,
            "error": str(e),
            "breakdown": []
        }