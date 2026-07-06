"""
error_handlers.py
-----------------
Centralised JSON error responses for all HTTP error codes.
Registered via register_error_handlers(app) in the app factory.
"""

from flask import Flask, jsonify


def register_error_handlers(app: Flask) -> None:

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad request", "message": str(e)}), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({"error": "Unauthorized", "message": "Authentication required"}), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({"error": "Forbidden", "message": "You do not have permission"}), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found", "message": str(e)}), 404

    @app.errorhandler(413)
    def request_entity_too_large(e):
        return jsonify({"error": "File too large", "message": "Maximum upload size is 5 MB"}), 413

    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify({"error": "Unprocessable entity", "message": str(e)}), 422

    @app.errorhandler(429)
    def too_many_requests(e):
        return jsonify({"error": "Too many requests", "message": "Slow down"}), 429

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error", "message": "Something went wrong"}), 500
