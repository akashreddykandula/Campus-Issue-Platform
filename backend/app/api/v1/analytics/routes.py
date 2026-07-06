"""
api/v1/analytics/routes.py
---------------------------
Analytics endpoints — admin only.
"""

from flask import jsonify, Response
from flask_login import login_required
from app.api.v1.analytics import analytics_bp
from app.services.analytics_service import AnalyticsService
from app.middleware.auth_middleware import admin_required


@analytics_bp.route("/overview", methods=["GET"])
@login_required
@admin_required
def overview():
    return jsonify(AnalyticsService.get_overview()), 200


@analytics_bp.route("/monthly", methods=["GET"])
@login_required
@admin_required
def monthly():
    return jsonify({"data": AnalyticsService.get_monthly()}), 200


@analytics_bp.route("/category", methods=["GET"])
@login_required
@admin_required
def by_category():
    return jsonify({"data": AnalyticsService.get_by_category()}), 200


@analytics_bp.route("/priority", methods=["GET"])
@login_required
@admin_required
def priority_distribution():
    return jsonify({"data": AnalyticsService.get_priority_distribution()}), 200


@analytics_bp.route("/locations", methods=["GET"])
@login_required
@admin_required
def top_locations():
    return jsonify({"data": AnalyticsService.get_top_locations()}), 200


@analytics_bp.route("/resolution-time", methods=["GET"])
@login_required
@admin_required
def resolution_time():
    return jsonify(AnalyticsService.get_resolution_time()), 200


@analytics_bp.route("/department", methods=["GET"])
@login_required
@admin_required
def by_department():
    return jsonify({"data": AnalyticsService.get_by_department()}), 200


@analytics_bp.route("/export-csv", methods=["GET"])
@login_required
@admin_required
def export_csv():
    csv_data = AnalyticsService.export_csv()
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=complaints_export.csv"},
    )
