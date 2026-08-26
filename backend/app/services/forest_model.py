from pathlib import Path
import numpy as np
import rasterio
from rasterio.mask import mask
from rasterio.features import rasterize
from shapely.geometry import shape
import pyproj
from shapely.ops import transform

# Sätt sökvägen dynamiskt
CURRENT_FILE = Path(__file__).resolve()
BASE_DIR = CURRENT_FILE.parent.parent.parent # ecomap/backend

# Kolla båda möjliga mappsökvägarna
FOREST_PATH = BASE_DIR / "data" / "forest.tif"
if not FOREST_PATH.exists():
    FOREST_PATH = CURRENT_FILE.parent.parent / "data" / "forest.tif"

print(f"[Forest] Använder fil: {FOREST_PATH}")
print(f"[Forest] Hittades filen? -> {FOREST_PATH.exists()}")

def forest_to_geojson():
    return {"type": "FeatureCollection", "features": []}

def analyze_forest_area(geojson_geometry, total_sq_meters=None):
    if not geojson_geometry or not FOREST_PATH.exists():
        print(f"[Forest] Hittar inte filen: {FOREST_PATH}")
        return {'breakdown': []}

    try:
        user_shape = shape(geojson_geometry)
        if not user_shape.is_valid:
            user_shape = user_shape.buffer(0)

        with rasterio.open(FOREST_PATH) as src:
            tif_crs = src.crs if src.crs else "EPSG:3006"
            
            # Projektion till rasterns CRS
            transformer = pyproj.Transformer.from_crs("EPSG:4326", tif_crs, always_xy=True)
            transformed_shape = transform(transformer.transform, user_shape)

            # 1. Klipp rastern
            out_image, out_transform = mask(
                src, 
                [transformed_shape], 
                crop=True, 
                filled=False, 
                all_touched=True
            )

            # 2. Skapa exakt polygon-mask för urvalet
            poly_mask = rasterize(
                [(transformed_shape, 1)],
                out_shape=(out_image.shape[1], out_image.shape[2]),
                transform=out_transform,
                fill=0,
                default_value=1,
                dtype=np.uint8
            )

            # 3. Omvandla MaskedArray till matris där maskerade pixlar blir 0
            data_band = out_image[0]
            if np.ma.is_masked(data_band):
                data_band = data_band.filled(0)

            # 4. Spara enbart pixlar som hamnar INUTI din ritade polygon
            valid_pixels = data_band[poly_mask == 1]

            calc_total_sqm = float(total_sq_meters) if (total_sq_meters and float(total_sq_meters) > 0) else 0.0

            if valid_pixels.size == 0:
                return {'breakdown': [{'type': 'No Forest / Other', 'sqm': round(calc_total_sqm, 2), 'percent': 100.0}]}

            # 5. Räkna Skog (1) och Övrigt (0)
            forest_pixel_count = np.sum(valid_pixels == 1)
            total_pixel_count = valid_pixels.size

            forest_ratio = forest_pixel_count / total_pixel_count if total_pixel_count > 0 else 0.0
            
            forest_sqm = calc_total_sqm * forest_ratio
            other_sqm = max(0.0, calc_total_sqm - forest_sqm)

            forest_percent = round(forest_ratio * 100, 2)
            other_percent = round((other_sqm / calc_total_sqm) * 100, 2) if calc_total_sqm > 0 else 0.0

            breakdown = []

            if forest_sqm > 0:
                breakdown.append({
                    'type': 'Forest Area',
                    'sqm': round(forest_sqm, 2),
                    'percent': min(forest_percent, 100.0)
                })

            if other_sqm > 0:
                breakdown.append({
                    'type': 'Other',
                    'sqm': round(other_sqm, 2),
                    'percent': min(other_percent, 100.0)
                })

            return {'breakdown': breakdown}

    except Exception as e:
        print(f"[Forest ERROR]: {e}")
        return {'breakdown': []}