from flask import Blueprint, jsonify, request
from .services.flood_model import flood_to_geojson


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
    