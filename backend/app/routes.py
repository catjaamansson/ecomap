from flask import Blueprint, jsonify, request
from .services.flood_model import flood_to_geojson
from .services.land_use_model import land_use_to_geojson, analyze_land_use_area, land_use_at_point
from .services.water_quality_model import water_quality_to_geojson, water_quality_at_point, analyze_water_quality_area
from .services.forest_model import forest_to_geojson, analyze_forest_area
from .services.waterbodies_model import water_bodies_to_geojson, analyze_water_bodies_area
from .services.soilmoisture_model import soil_moisture_to_geojson, soil_moisture_at_point, calculate_soilmoisture_summary
from .services.forest2_model import forest2_to_geojson
from .services.landuse_model_click import land_use_at_point as land_use_click_at_point
import csv
import os

api = Blueprint("api", __name__)

@api.route("/ping")
def ping():
    return jsonify({"status": "ok"})

@api.route("/flood")
def flood():
    level = request.args.get("level")

    if level is None:
        return jsonify({"error": "Missing level"}), 400
    
    level = float(level)

    geojson = flood_to_geojson(level)
    return jsonify(geojson)

@api.route("/land_use", methods=["GET"])
def get_land_use_point():
    try:
        lat = request.args.get("lat", type=float)
        lng = request.args.get("lng", type=float)

        if lat is None or lng is None:
            return jsonify({"error": "Sökparametrar 'lat' och 'lng' krävs"}), 400

        result = land_use_at_point(lat, lng)

        # Säkerställ att responset har exakt de nycklar som Frontend letar efter
        if isinstance(result, dict):
            info = result.get("land_use_type", {})
            name = info.get("name") if isinstance(info, dict) else (result.get("type") or str(info))
            desc = info.get("description") if isinstance(info, dict) else (result.get("description") or "N/A")

            return jsonify({
                "land_use_value": result.get("land_use_value", 0),
                "land_use_type": {
                    "name": name,
                    "description": desc
                },
                "type": name,
                "description": desc
            })

        return jsonify(result)

    except Exception as e:
        print(f"Fel i get_land_use_point: {e}")
        return jsonify({"error": str(e)}), 500

@api.route("/water_quality")
def water_quality():
    try:
        lat = request.args.get("lat")
        lng = request.args.get("lng")

        if lat is not None and lng is not None:
            point_data = water_quality_at_point(float(lat), float(lng))

            if "error" in point_data:
                return jsonify(point_data), 404

            return jsonify(point_data)

        geojson = water_quality_to_geojson()
        return jsonify(geojson)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route("/waterbodies")
def waterbodies():
    try:
        geojson = water_bodies_to_geojson()
        return jsonify(geojson)
    except Exception as e:
        return jsonify({"error": str(e)}), 500  

@api.route("/soil_moisture")
def soil_moisture():
    try:
        geojson = soil_moisture_to_geojson()
        return jsonify(geojson)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route("/soil_moisture_point")
def soil_moisture_point():
    lat = request.args.get("lat", type=float)
    lng = request.args.get("lng", type=float)

    if lat is None or lng is None:
        return jsonify({"error": "Missing parameters"}), 400

    try:
        data = soil_moisture_at_point(lat, lng)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route("/forest")
def forest():
    try:
        geojson = forest_to_geojson()
        return jsonify(geojson)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route("/species")
def species():
    threat = request.args.get("threat", "VU")
    
    species_list = []
    csv_path = os.path.join(os.path.dirname(__file__), "data", "rodlistade_arten.csv")
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=';')
            for row in reader:
                if len(row) >= 4 and row[3] == threat:
                    species_list.append({
                        "swedish_name": row[0],
                        "scientific_name": row[1],
                        "threat_status": row[3],
                        "count": int(row[4]) if len(row) > 4 else 0
                    })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    return jsonify({"species": species_list})

@api.route("/datasources")
def datasources():
    sources = [
        {"name": "Lantmäteriet", "url": "https://www.lantmateriet.se/"},
        {"name": "SMHI", "url": "https://www.smhi.se/"},
        {"name": "Naturvårdsverket", "url": "https://www.naturvardsverket.se/"},
        {"name": "ArtDatabanken", "url": "https://www.artdatabanken.se/"}
    ]
    return jsonify({"datasources": sources})

@api.route("/contact")
def contact():
    contact_info = {
        "email": "contact@ekomap.se", 
    }
    return jsonify(contact_info)    

@api.route("/privacypolicy")
def privacypolicy():
    policy = {
        "content": "EcoMap collects no personal data. All functionality is client-side, and your data remains on your device."
    }
    return jsonify(policy)

@api.route("/analyze-area", methods=["POST", "OPTIONS"])
def analyze_area():
    if request.method == "OPTIONS":
        return "", 200

    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Ingen giltig JSON skickades"}), 400

        geometry = data.get("geometry")
        sq_meters = data.get("sqMeters")
        layer_type = data.get("layer", "landuse") # Hämta aktivt lager från frontend

        if not geometry:
            return jsonify({"error": "Geometri saknas i anropet"}), 400

        # SKICKA MED sq_meters TILL ALLA ANALYSER
        land_use_res = analyze_land_use_area(geometry, sq_meters)
        water_res = analyze_water_bodies_area(geometry, sq_meters)
        forest_res = analyze_forest_area(geometry, sq_meters)
        water_quality_res = analyze_water_quality_area(geometry)
        
        # Beräkna markfuktighet och skicka med sq_meters för korrekt yta
        soil_moisture_res = calculate_soilmoisture_summary(geometry, sq_meters)

        # Extrahera breakdown-listor säkert
        land_breakdown = land_use_res.get('breakdown', []) if isinstance(land_use_res, dict) else []
        water_breakdown = water_res.get('breakdown', []) if isinstance(water_res, dict) else []
        forest_breakdown = forest_res.get('breakdown', []) if isinstance(forest_res, dict) else []
        wq_breakdown = water_quality_res.get('breakdown', []) if isinstance(water_quality_res, dict) else []
        soil_breakdown = soil_moisture_res.get('breakdown', []) if isinstance(soil_moisture_res, dict) else []

        # Om frontend förväntar sig ett platt 'breakdown' direkt på rotnivå:
        active_breakdown = land_breakdown
        if layer_type in ['waterbodies', 'waterBodies']:
            active_breakdown = water_breakdown
        elif layer_type in ['forest', 'vegetation']:
            active_breakdown = forest_breakdown
        elif layer_type in ['waterquality', 'waterQuality']:
            active_breakdown = wq_breakdown
        elif layer_type in ['soilmoisture', 'soil_moisture', 'soilMoisture']:
            active_breakdown = soil_breakdown

        return jsonify({
            'total_sqm': sq_meters,
            'breakdown': active_breakdown, # <--- Direkt breakdown för det valda lagret!
            'soil_moisture': soil_moisture_res, # Snabbåtkomst till min/max/medel för markfuktighet
            'layers': {
                'landUse': {
                    'title': 'Land Use Coverage',
                    'breakdown': land_breakdown
                },
                'waterbodies': {
                    'title': 'Water Bodies Coverage',
                    'breakdown': water_breakdown
                },
                'forest': {
                    'title': 'Forest Coverage',
                    'breakdown': forest_breakdown
                },
                'waterQuality': {
                    'title': 'Water Quality Coverage',
                    'breakdown': wq_breakdown
                },
                'soilMoisture': {
                    'title': 'Soil Moisture Coverage',
                    'data': soil_moisture_res,
                    'breakdown': soil_breakdown
                }
            }
        })

    except Exception as e:
        print(f"FEL I ANALYZE_AREA: {e}")
        return jsonify({"error": str(e)}), 500