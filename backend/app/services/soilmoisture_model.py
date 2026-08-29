import rasterio
import numpy as np
from pyproj import Transformer
from .forest_model import FOREST_PATH

SOIL_PATH = FOREST_PATH.parent / "soilmoisture.tif"

def get_moisture_status(val):
    if val is None:
        return "Unknown", "#777777"
    elif val < 20:
        return "Very Dry", "#d9534f"    # Röd
    elif val < 35:
        return "Dry", "#f0ad4e"         # Orange
    elif val < 50:
        return "Normal", "#5cb85c"      # Grön
    elif val < 70:
        return "Wet", "#5bc0de"         # Ljusblå
    else:
        return "Very Wet", "#0275d8"    # Mörkblå

def soil_moisture_to_geojson():
    return {"type": "FeatureCollection", "features": []}

def soil_moisture_at_point(lat, lng):
    if not SOIL_PATH.exists():
        return {"error": "Soil moisture file missing"}

    try:
        lat_val = float(lat)
        lng_val = float(lng)

        with rasterio.open(SOIL_PATH) as src:
            tif_crs = src.crs if src.crs else "EPSG:4326"
            
            if tif_crs.to_string().upper() in ["EPSG:4326", "OGC:CRS84"]:
                proj_x, proj_y = lng_val, lat_val
            else:
                transformer = Transformer.from_crs("EPSG:4326", tif_crs, always_xy=True)
                proj_x, proj_y = transformer.transform(lng_val, lat_val)

            row, col = src.index(proj_x, proj_y)
            
            if row < 0 or row >= src.height or col < 0 or col >= src.width:
                return {"value": None, "label": "Outside Coverage", "status": "Outside Coverage", "color": "#777777"}

            # Läs direkt av pixelvärdet som QGIS har exporterat
            raw_val = float(src.read(1)[row, col])

            # Om klicket hamnar på transparent/NoData/vatten
            if np.isnan(raw_val) or (src.nodata is not None and raw_val == src.nodata):
                return {"value": None, "label": "Water Body / No Data", "status": "No Data", "color": "#777777"}

            # Exakt samma värde som visas i QGIS (t.ex. 19.5% eller 54.0%)
            val = round(raw_val, 1)
            status, color = get_moisture_status(val)

            print(f"--> DIRECT QGIS EXPORT MATCH: Lat/Lng=({lat_val:.4f}, {lng_val:.4f}) -> {val}%")

            return {
                "value": val,
                "unit": "%",
                "label": f"Soil Moisture: {val}%",
                "status": status,
                "color": color
            }
            
    except Exception as e:
        print(f"[ERROR] {e}")
        return {"error": str(e)}