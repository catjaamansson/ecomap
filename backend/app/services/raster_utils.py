from typing import Any

from pyproj import CRS, Transformer
from shapely.ops import transform as shapely_transform


WGS84_CRS = "EPSG:4326"
DEFAULT_RASTER_CRS = "EPSG:3006"


def get_raster_crs(raster: Any, fallback: str = DEFAULT_RASTER_CRS) -> CRS:
    """Returnerar rastrets CRS, eller en explicit fallback om metadata saknas."""
    return CRS.from_user_input(raster.crs or fallback)


def transform_point_to_raster(
    longitude: float,
    latitude: float,
    raster: Any,
    fallback: str = DEFAULT_RASTER_CRS,
) -> tuple[float, float]:
    """Omvandlar en WGS84-punkt till rastrets koordinatsystem."""
    raster_crs = get_raster_crs(raster, fallback)
    transformer = Transformer.from_crs(WGS84_CRS, raster_crs, always_xy=True)
    x, y = transformer.transform(float(longitude), float(latitude))
    return x, y


def transform_geometry_to_raster(
    geometry: Any,
    raster: Any,
    fallback: str = DEFAULT_RASTER_CRS,
) -> Any:
    """Omvandlar en Shapely-geometri från WGS84 till rastrets CRS."""
    raster_crs = get_raster_crs(raster, fallback)
    transformer = Transformer.from_crs(WGS84_CRS, raster_crs, always_xy=True)
    return shapely_transform(transformer.transform, geometry)