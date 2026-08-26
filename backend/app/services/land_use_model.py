import rasterio
from rasterio.features import shapes
from rasterio.mask import mask
import numpy as np
from pathlib import Path
from pyproj import Transformer
from shapely.geometry import shape, mapping
from shapely.ops import transform

# Sökväg till rasterfilen
LU_PATH = Path(__file__).parent.parent / "data" / "land_use.tif"

def classify_land_use(value):
    """
    Classifies land use types based on NMD values
    https://www.naturvardsverket.se/verktyg-och-tjanster/kartor-och-karttjanster/nationella-marktackedata/
    """

    CODE_ALIASES = {
        46: 217 #Urban green areas (46) should be treated as 217 (Urban green areas)
    }
    
    # Use the alias if it exists, otherwise use the original value
    target_code = CODE_ALIASES.get(value, value)

    land_use_classes = {
        218: {
        "name": "High-density urban area",
        "description": "Densely built-up urban centers where structures, roads, and paved surfaces cover the vast majority of the land."
        },
        240: {
            "name": "Residential area",
            "description": "Housing areas including single-family homes and apartment complexes, interspersed with gardens, yards, and local roads."
        },
        178: {
            "name": "Industrial area",
            "description": "Zones dedicated to industrial activities, manufacturing plants, commercial facilities, and logistical hubs."
        },
        88: {
            "name": "Roads and railways",
            "description": "Transportation infrastructure including motorways, railways, associated embankments, and station yards."
        },
        109: {
            "name": "Lakes / Coastal area",
            "description": "Infrastructure and modified land directly supporting maritime activities, such as commercial ports and docks."
        },
        124: {
            "name": "Airports",
            "description": "Aviation infrastructure including runways, taxiways, terminals, and surrounding managed grounds."
        },
        119: {
            "name": "Mineral extraction sites",
            "description": "Open-pit mines, quarries, gravel pits, and associated processing sites."
        },
        8: {
            "name": "Waste disposal sites",
            "description": "Active or historical landfills, dump sites, and industrial waste management facilities."
        },
        139: {
            "name": "Construction sites",
            "description": "Land currently undergoing excavation, building, or major infrastructure development."
        },
        217: {
            "name": "Urban green areas",
            "description": "Vegetated urban land including public parks, botanical gardens, and recreational green spaces."
        },
        203: {
            "name": "Sports and leisure facilities",
            "description": "Recreational areas such as golf courses, sports fields, camping sites, and leisure parks."
        },
        166: {
            "name": "Arable land",
            "description": "Cultivated farmland used for annual crop production such as cereals, legumes, and root crops."
        },
        2: {
            "name": "Fruit orchards",
            "description": "Parcels planted with fruit trees, berry plantations, or nut-bearing trees."
        },
        156: {
            "name": "Pastures",
            "description": "Enclosed, managed grasslands used regularly for livestock grazing or fodder production."
        },
        19: {
            "name": "Permanent crops",
            "description": "Land dedicated to perennial crops that occupy the soil for long periods without annual replanting."
        },
        154: {
            "name": "Agricultural land",
            "description": "Heterogeneous agricultural areas combining small crop fields, pastures, and farm structures."
        },
        113: {
            "name": "Deciduous forest",
            "description": "Woodlands dominated by broad-leaved broadleaf trees (e.g., oak, birch, beech) that shed leaves annually."
        },
        61: {
            "name": "Coniferous forest",
            "description": "Woodlands dominated by evergreen needle-leaf trees (e.g., pine, spruce)."
        },
        85: {
            "name": "Mixed forest",
            "description": "Forests with a balanced mix of both broad-leaved deciduous trees and needle-leaved coniferous trees."
        },
        245: {
            "name": "Natural grassland",
            "description": "Unmanaged or lightly grazed grasslands dominated by native grass species and wild flora."
        },
        29: {
            "name": "Open land - sandy ground",
            "description": "Sparsely vegetated coastal or inland areas dominated by exposed sand dunes and beaches."
        },
        255: {
            "name": "Open land - gravel and rock",
            "description": "Bare rock outcrops, scree, gravel beds, and areas with extremely sparse vegetation."
        },
        35: {
            "name": "Streams and rivers",
            "description": "Natural or modified inland running watercourses, including streams, rivers, and canals."
        },
        95: {
            "name": "Peat bogs",
            "description": "Wetlands characterized by acidic, waterlogged conditions and an accumulation of undecomposed peat moss."
        },
        37: {
            "name": "Coastal marshes",
            "description": "Vegetated tidally-influenced coastal wetlands regularly submerged by salt or brackish water."
        },
        110: {
            "name": "Lakes and waterbodies",
            "description": "Inland standing waterbodies, including natural lakes, reservoirs, and large ponds."
        },
        42: {
            "name": "Coastal lagoons",
            "description": "Unenclosed or semi-enclosed bodies of shallow salt or brackish water separated from the open sea by reefs or sandbars."
        },
        43: {
            "name": "Other permanent agricultural crops",
            "description": "Specialized perennial agricultural areas, such as agro-forestry systems combining trees and crops."
        },
        11: {
            "name": "Marine areas",
            "description": "Open marine waters, sea bays, and estuarine waters outside coastal land boundaries."
        },

        211: {
            "name": "Protected areas",
            "description": "Open marine waters, sea bays, and estuarine waters outside coastal land boundaries."
                },

        0: {
            "name": "No data / Unknown",
            "description": "Areas where satellite sensor data is missing, obscured by clouds, or unclassified."
        },
        -1: {
            "name": "Oceans and seas",
            "description": "Open marine waters, sea bays, and estuarine waters outside coastal land boundaries."
        },
    }  

    return land_use_classes.get(
        target_code,
        {
            "name": f"Code {value}",
            "description": f"Class with code {value} is not yet defined.",
        },
    )

def land_use_at_point(lat, lng):
    if not LU_PATH.exists():
        return {
            "land_use_value": 0,
            "land_use_type": {"name": "File Error", "description": "land_use.tif missing"},
            "type": "File Error",
            "description": "land_use.tif missing"
        }

    lat_f = float(lat)
    lng_f = float(lng)

    with rasterio.open(LU_PATH) as src:
        bounds = src.bounds

        # Om rastret har ett CRS definierat, transformerar vi direkt till det!
        if src.crs:
            # Transformera från WGS84 (EPSG:4326) direkt till rastrets exakta CRS
            transformer = Transformer.from_crs("EPSG:4326", src.crs, always_xy=True)
            x, y = transformer.transform(lng_f, lat_f)
        else:
            # Fallback om CRS saknas helt i tif-filen (gissar RT90 2.5 gon V)
            transformer = Transformer.from_crs("EPSG:4326", "EPSG:2400", always_xy=True)
            x, y = transformer.transform(lng_f, lat_f)

        try:
            val = list(src.sample([(x, y)]))[0][0]
            sampled_val = int(val)
        except Exception as e:
            print(f"Sample-fel vid ({x}, {y}): {e}")
            sampled_val = 0

    info = classify_land_use(sampled_val)
    name = info.get("name", f"Code {sampled_val}") if isinstance(info, dict) else str(info)
    desc = info.get("description", "N/A") if isinstance(info, dict) else "N/A"

    return {
        "land_use_value": sampled_val,
        "land_use_type": {
            "name": name,
            "description": desc
        },
        "type": name,
        "name": name,
        "description": desc
    }

from pyproj import Geod

import rasterio
from rasterio.mask import mask
from shapely.geometry import shape, mapping
from shapely.ops import transform
from pyproj import Transformer, Geod
import numpy as np

def analyze_land_use_area(geojson_geometry, total_sq_meters=None):
    if not geojson_geometry or not LU_PATH.exists():
        return {"total_sqm": 0, "breakdown": []}

    try:
        wgs84_geom = shape(geojson_geometry)
    except Exception as e:
        print(f"Geometry error: {e}")
        return {"total_sqm": 0, "breakdown": []}

    # 1. Beräkna den riktiga geodetiska ytan på jordklotet (WGS84)
    geod = Geod(ellps="WGS84")
    total_area_sqm = abs(geod.geometry_area_perimeter(wgs84_geom)[0])

    with rasterio.open(LU_PATH) as src:
        # 2. Omvandla WGS84-geometrin till rastrets interna koordinatsystem (CRS)
        target_crs = src.crs if src.crs else "EPSG:3006"  # SWEREF99 TM som standard i Sverige
        try:
            transformer = Transformer.from_crs("EPSG:4326", target_crs, always_xy=True)
            transformed_geom = transform(transformer.transform, wgs84_geom)
        except Exception as e:
            print(f"Transform error: {e}")
            transformed_geom = wgs84_geom

        mask_shapes = [mapping(transformed_geom)]

        # 3. Klipp ut rastret för den valda geometrin
        try:
            out_image, _ = mask(src, mask_shapes, crop=True, filled=False)
        except Exception as e:
            print(f"Mask error: {e}")
            return {"total_sqm": round(total_area_sqm, 2), "breakdown": []}

        data = out_image[0]

        # Hämta enbart de pixlar som faller inom polygonen
        if hasattr(data, 'compressed'):
            pixels = data.compressed()
        else:
            pixels = data.flatten()

        if len(pixels) == 0:
            return {"total_sqm": round(total_area_sqm, 2), "breakdown": []}

        # Ta bort Nodata / bakgrundsvärden
        nodata_val = src.nodata if src.nodata is not None else 0
        valid_pixels = pixels[pixels != nodata_val]

        total_valid_pixels = len(valid_pixels)
        if total_valid_pixels == 0:
            return {"total_sqm": round(total_area_sqm, 2), "breakdown": []}

        # 4. Räkna förekomsten av varje markanvändningskod
        counts = {}
        for pixel_val in valid_pixels:
            val = int(pixel_val)
            counts[val] = counts.get(val, 0) + 1

        # 5. Räkna ut procenten exakt baserat på antalet träffade markpixlar
        breakdown = []
        for val, count in counts.items():
            info = classify_land_use(val)
            name = info.get("name", f"Kod {val}") if isinstance(info, dict) else str(info)

            # Procentandel av den faktiska markytan
            percent = (count / total_valid_pixels) * 100.0
            cat_sqm = (percent / 100.0) * total_area_sqm

            breakdown.append({
                "type": name,
                "name": name,
                "sqm": round(cat_sqm, 2),
                "percent": round(percent, 2)
            })

        breakdown.sort(key=lambda x: x["sqm"], reverse=True)

        return {
            "total_sqm": round(total_area_sqm, 2),
            "breakdown": breakdown
        }

def land_use_to_geojson():
    """
    Vektoriserar landuse.tif till GeoJSON-format.
    """
    if not LU_PATH.exists():
        return {"type": "FeatureCollection", "features": []}

    with rasterio.open(LU_PATH) as src:
        lu = src.read(1)
        transform_mat = src.transform

    land_use_mask = lu > -128
    features = []

    for geom, value in shapes(lu, mask=land_use_mask, transform=transform_mat):
        try:
            val_int = int(value)
        except (ValueError, TypeError):
            continue

        if val_int <= -128 or val_int == 0:
            continue

        info = classify_land_use(val_int)
        name = info.get("name", f"Code {val_int}")
        desc = info.get("description", "N/A")

        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": {
                "land_use_value": val_int,
                "land_use_type": {
                    "name": name,
                    "description": desc
                },
                "type": name,
                "name": name,
                "description": desc
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }