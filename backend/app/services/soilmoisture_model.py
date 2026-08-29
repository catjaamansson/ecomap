import rasterio
from rasterio.mask import mask
import numpy as np
from pyproj import Transformer
from shapely.geometry import shape
from shapely.ops import transform
from .forest_model import FOREST_PATH

SOIL_PATH = FOREST_PATH.parent / "soilmoisture.tif"

def get_moisture_status(val):
    if val is None:
        return "Unknown", "#777777"
    elif val < 20:
        return "Very Dry", "#d9534f"
    elif val < 30:
        return "Dry", "#f0ad4e"
    elif val < 42:
        return "Normal", "#5cb85c"
    elif val < 50:
        return "Wet", "#5bc0de"
    else:
        return "Very Wet", "#0275d8"

def soil_moisture_to_geojson():
    """Returnerar tom GeoJSON för kompatibilitet med rutter."""
    return {"type": "FeatureCollection", "features": []}

def soil_moisture_at_point(lat, lng):
    if not SOIL_PATH.exists():
        return {"error": "Soil dataset missing"}

    try:
        with rasterio.open(SOIL_PATH) as src:
            tif_crs = src.crs if src.crs else "EPSG:4326"
            
            if tif_crs.to_string().upper() not in ["EPSG:4326", "OGC:CRS84"]:
                transformer = Transformer.from_crs("EPSG:4326", tif_crs, always_xy=True)
                x, y = transformer.transform(lng, lat)
            else:
                x, y = lng, lat

            vals = list(src.sample([(x, y)]))
            val = float(vals[0][0]) if len(vals) > 0 else None

            if val is None or val < 0 or np.isnan(val) or (src.nodata is not None and val == src.nodata):
                return {"value": None, "status": "No Data", "color": "#777777"}

            val = round(val, 1)
            status, color = get_moisture_status(val)
            return {"value": val, "status": status, "color": color}

    except Exception as e:
        return {"error": str(e)}

def calculate_soilmoisture_summary(geojson_geometry, total_sqm=None):
    if not SOIL_PATH.exists():
        return {"error": "Soil moisture dataset missing", "breakdown": []}

    try:
        raw_geom = shape(geojson_geometry)

        with rasterio.open(SOIL_PATH) as src:
            tif_crs = src.crs if src.crs else "EPSG:4326"

            # 1. Transformera om rastern inte är i WGS84
            if tif_crs.to_string().upper() not in ["EPSG:4326", "OGC:CRS84"]:
                project = Transformer.from_crs("EPSG:4326", tif_crs, always_xy=True).transform
                geom = transform(project, raw_geom)
            else:
                geom = raw_geom

            # 2. Försök första maskeringen (standard lat/lng)
            try:
                out_image, out_transform = mask(src, [geom], crop=True, all_touched=True)
                data = out_image[0]
                valid_mask = (data >= 0.0) & (~np.isnan(data))
                if src.nodata is not None:
                    valid_mask &= (data != src.nodata)
                valid_pixels = data[valid_mask]
            except Exception:
                valid_pixels = np.array([])

            # 3. Om ingen data hittades: Vänd på lat/lng (x/y) och försök igen
            if len(valid_pixels) == 0:
                flipped_geom = transform(lambda x, y, z=None: (y, x), raw_geom)
                
                if tif_crs.to_string().upper() not in ["EPSG:4326", "OGC:CRS84"]:
                    project = Transformer.from_crs("EPSG:4326", tif_crs, always_xy=True).transform
                    flipped_geom = transform(project, flipped_geom)

                out_image, out_transform = mask(src, [flipped_geom], crop=True, all_touched=True)
                data = out_image[0]
                valid_mask = (data >= 0.0) & (~np.isnan(data))
                if src.nodata is not None:
                    valid_mask &= (data != src.nodata)
                valid_pixels = data[valid_mask]

            if len(valid_pixels) == 0:
                return {"mean_moisture": None, "breakdown": []}

            total_pixels = len(valid_pixels)
            total_ha = float(total_sqm / 10000.0) if total_sqm else 0.0

            # Beräkna ytor per klass
            dry_count = np.sum(valid_pixels < 30)
            normal_count = np.sum((valid_pixels >= 30) & (valid_pixels < 50))
            wet_count = np.sum(valid_pixels >= 50)

            categories = [
                ("Dry Soil (<30%)", dry_count, "#f0ad4e"),
                ("Normal Moisture (30-50%)", normal_count, "#5cb85c"),
                ("Wet / Moist Soil (>50%)", wet_count, "#0275d8")
            ]

            breakdown = []
            for name, count, color in categories:
                if count > 0:
                    pct = round((count / total_pixels) * 100, 1)
                    ha = round((count / total_pixels) * total_ha, 2)
                    breakdown.append({
                        "name": name,
                        "type": name,
                        "area_ha": ha,
                        "area": ha,
                        "percentage": pct,
                        "percent": pct,
                        "value": pct,
                        "color": color
                    })

            mean_val = round(float(np.mean(valid_pixels)), 1)

            return {
                "mean_moisture": mean_val,
                "breakdown": breakdown
            }

    except Exception as e:
        print(f"[SOIL MOISTURE ERROR] {e}")
        return {"error": str(e), "breakdown": []}