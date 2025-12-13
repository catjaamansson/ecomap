from flask import Blueprint, jsonify, request
from .services.flood_model import flood_from_level


api = Blueprint("api", __name__)

@api.route("/ping")
def ping():
    return jsonify({"status": "ok"})

@api.route("/flood")
def flood():
    level = float(request.args.get("level"))

    flooded = flood_from_level(
        "app/data/dem.tif",
        level
    )

    flooded_cells = int(flooded.sum())

    return jsonify({
        "water_level": level,
        "flooded_cells": flooded_cells
    })