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
WATER_PATH = BASE_DIR / "data" / "waterbodies.tif"
if not WATER_PATH.exists():
    WATER_PATH = CURRENT_FILE.parent.parent / "data" / "waterbodies.tif"

print(f"[WaterBodies] Använder fil: {WATER_PATH}")
print(f"[WaterBodies] Hittades filen? -> {WATER_PATH.exists()}")

def water_bodies_to_geojson():
    return {"type": "FeatureCollection", "features": []}

def analyze_water_bodies_area(geojson_geometry, total_sq_meters=None):
    if not geojson_geometry or not WATER_PATH.exists():
        print(f"[WaterBodies] Hittar inte filen: {WATER_PATH}")
        return {'breakdown': []}

    try:
        user_shape = shape(geojson_geometry)
        if not user_shape.is_valid:
            user_shape = user_shape.buffer(0)

        with rasterio.open(WATER_PATH) as src:
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

            # 3. Omvandla MaskedArray till matris där maskerade pixlar (land) blir 0
            data_band = out_image[0]
            if np.ma.is_masked(data_band):
                data_band = data_band.filled(0)

            # 4. Spara enbart pixlar som hamnar INUTI din ritade polygon
            valid_pixels = data_band[poly_mask == 1]

            calc_total_sqm = float(total_sq_meters) if (total_sq_meters and float(total_sq_meters) > 0) else 0.0

            if valid_pixels.size == 0:
                return {'breakdown': [{'type': 'Land / No water area', 'sqm': round(calc_total_sqm, 2), 'percent': 100.0}]}

            # 5. Räkna Vatten (1) och Land (0)
            water_pixel_count = np.sum(valid_pixels == 1)
            total_pixel_count = valid_pixels.size

            water_ratio = water_pixel_count / total_pixel_count if total_pixel_count > 0 else 0.0
            
            water_sqm = calc_total_sqm * water_ratio
            land_sqm = max(0.0, calc_total_sqm - water_sqm)

            water_percent = round(water_ratio * 100, 2)
            land_percent = round((land_sqm / calc_total_sqm) * 100, 2) if calc_total_sqm > 0 else 0.0

            breakdown = []

            if water_sqm > 0:
                breakdown.append({
                    'type': 'Water Area',
                    'sqm': round(water_sqm, 2),
                    'percent': min(water_percent, 100.0)
                })

            if land_sqm > 0:
                breakdown.append({
                    'type': 'Other',
                    'sqm': round(land_sqm, 2),
                    'percent': max(0.0, land_percent)
                })

            return {'breakdown': breakdown}

    except Exception as e:
        print(f"[WaterBodies ERROR]: {e}")
        return {'breakdown': []}