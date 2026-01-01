from flask import Blueprint, jsonify, request
from .services.flood_model import flood_to_geojson
from .services.land_use_model import land_use_to_geojson
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

@api.route("/land_use")
def land_use():
    try:
        geojson = land_use_to_geojson()
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