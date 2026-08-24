from flask import Blueprint, request, jsonify
from services.land_use_model import analyze_raster_layer 

analysis_bp = Blueprint('analysis', __name__)

LAYER_FILES = {
    'landuse': 'app/data/land_use_skane_cut_new.tif',
    'water': 'app/data/waterbodies.tif',
    'soil': 'app/data/soilmoisture.tif',
    'water_quality': 'app/data/waterquality_skane.tif'
}

@analysis_bp.route('/api/analyze-area', methods=['POST'])
def analyze_area():
    data = request.get_json()
    geometry = data.get('geometry')
    selected_layer = data.get('layer', 'landuse') # Fetch selected layer, default to 'landuse'

    raster_path = LAYER_FILES.get(selected_layer)
    if not raster_path:
        return jsonify({"error": "Invalid layer selected"}), 400

    result = analyze_raster_layer(geometry, raster_path)
    
    return jsonify(result)


from flask import Blueprint, request, jsonify
from services.land_use_model import analyze_land_use_area 
from services.waterbodies_model import analyze_water_bodies_area

analysis_bp = Blueprint('analysis', __name__)

@analysis_bp.route('/api/analyze-area', methods=['POST'])
def analyze_area():
    data = request.get_json()
    geometry = data.get('geometry')
    selected_layer = data.get('layer', 'landuse')  # Fetch selected layer, default to 'landuse'

    if selected_layer == 'waterbodies' or selected_layer == 'water':
        result = analyze_water_bodies_area(geometry)
    else:
        result = analyze_land_use_area(geometry)

    return jsonify(result)