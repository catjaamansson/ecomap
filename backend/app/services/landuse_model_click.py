
import rasterio
from .land_use_model import LU_PATH, classify_land_use
from rasterio.warp import transform as transform_coords

def land_use_at_point(lat, lng):
    with rasterio.open(LU_PATH) as src:
        x, y = lng, lat

        if src.crs and src.crs.to_string() != "EPSG:4326":
            x_coords, y_coords = transform_coords("EPSG:4326", src.crs, [lng], [lat])
            x, y = x_coords[0], y_coords[0]

        sampled_value = next(src.sample([(x, y)]))[0]

    if sampled_value == -128:
        return {"error": "No data at this location"}

    sampled_value = int(sampled_value)

    return {
        "land_use_value": sampled_value,
        "land_use_type": classify_land_use(sampled_value)
    }