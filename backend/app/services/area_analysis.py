from flask import Blueprint, request, jsonify
import geopandas as gpd
from shapely.geometry import shape

from services.land_use_model import analyze_land_use_area 
from services.waterbodies_model import analyze_water_bodies_area
from services.water_quality_model import analyze_water_quality_area

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/api/analyze-area', methods=['POST'])
def analyze_area():
    data = request.get_json()
    geometry = data.get('geometry')

    if not geometry:
        return jsonify({'error': 'No geometry provided'}), 400

    # 1. Beräkna den exakta valda ytan i meter (EPSG:3006 / SWEREF99 TM)
    user_shape = shape(geometry)
    user_gdf = gpd.GeoDataFrame(geometry=[user_shape], crs="EPSG:4326").to_crs(epsg=3006)
    calculated_sqm = float(user_gdf.geometry.area.sum())

    # 2. Kör alla tre analyser med den RIKTIGA kvadratmeterytan
    land_use_res = analyze_land_use_area(geometry, calculated_sqm)
    water_res = analyze_water_bodies_area(geometry, calculated_sqm)
    water_quality_res = analyze_water_quality_area(geometry, calculated_sqm)

    # 3. Returnera i layers-formatet med den verifierade ytan
    return jsonify({
        'total_sqm': calculated_sqm,
        'layers': {
            'landUse': {
                'title': 'Land Use Coverage',
                'breakdown': land_use_res.get('breakdown', [])
            },
            'waterBodies': {
                'title': 'Water Bodies Coverage',
                'breakdown': water_res.get('breakdown', [])
            },
            'waterQuality': {
                'title': 'Water Quality Coverage',
                'breakdown': water_quality_res.get('breakdown', [])
            }
        }
    })