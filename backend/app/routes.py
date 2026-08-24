from flask import Blueprint, jsonify, request
from .services.flood_model import flood_to_geojson
from .services.land_use_model import land_use_to_geojson
from .services.water_quality_model import water_quality_to_geojson, water_quality_at_point
from .services.forest_model import forest_to_geojson
from .services.waterbodies_model import water_bodies_to_geojson
from .services.soilmoisture_model import soil_moisture_to_geojson
from .services.forest2_model import forest2_to_geojson
from .services.landuse_model_click import land_use_at_point
from .services.land_use_model import land_use_at_point
from .services.land_use_model import analyze_land_use_area
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

        # Anropa din funktion i land_use_model.py
        result = land_use_at_point(lat, lng)

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

@api.route("/species")
def species():
    threat = request.args.get("threat", "VU")  # Default: Vulnerable
    
    species_list = []
    csv_path = os.path.join(os.path.dirname(__file__), "data", "rodlistade_arten.csv")
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f, delimiter=';')
            for row in reader:
                if len(row) >= 4 and row[3] == threat:  # Column 4 is threat status
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
    # 1. Hantera Preflight (OPTIONS) direkt utan att röra datan
    if request.method == "OPTIONS":
        return "", 200

    try:
        # 2. Hämta JSON säkert
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Ingen giltig JSON skickades"}), 400

        geometry = data.get("geometry")
        if not geometry:
            return jsonify({"error": "Geometri saknas i anropet"}), 400

        # 3. KÖR DEN RIKTIGA ANALYSEN MOT DIN TIF-FIL
        # Ersätt 'analyze_land_use_area' nedan med namnet på din funktion som klipper och beräknar rasterdata:
        result = analyze_land_use_area(geometry)

        # 'result' förväntas returnera ett dictionary i formatet:
        # {
        #     "total_sqm": 9847177,
        #     "breakdown": [
        #         {"type": "Arable land", "sqm": 3446500, "percent": 35},
        #         {"type": "Deciduous forest", "sqm": 4923600, "percent": 50},
        #         ...
        #     ]
        # }
        return jsonify(result)

    except Exception as e:
        print(f"FEL I ANALYZE_AREA: {e}")  # Skrivs ut i din Python-terminal
        return jsonify({"error": str(e)}), 500