"""
app/__init__.py
---------------
Flask application factory.  Call create_app(config_name) to get a
fully-configured Flask instance.  Extensions are initialised here so
they can be imported from app.extensions without circular refs.
"""

import os
from flask import Flask
from config import CONFIG_MAP
from app.extensions import db, login_manager, migrate, csrf, cors


def create_app(config_name: str | None = None) -> Flask:
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")

    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(CONFIG_MAP[config_name])

    # ── Extensions ────────────────────────────────────────────────────────────
    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    csrf.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )

    # ── Login manager ─────────────────────────────────────────────────────────
    login_manager.login_view = "auth.login"
    login_manager.login_message_category = "info"

    @login_manager.unauthorized_handler
    def unauthorized():
        from flask import jsonify
        return jsonify({"error": "Authentication required"}), 401

    # ── User loader ───────────────────────────────────────────────────────────
    @login_manager.user_loader
    def load_user(user_id: str):
        from app.models import Student, Admin
        # user_id is prefixed: "student:<id>" or "admin:<id>"
        if user_id.startswith("student:"):
            return Student.query.get(int(user_id.split(":")[1]))
        if user_id.startswith("admin:"):
            return Admin.query.get(int(user_id.split(":")[1]))
        return None

    # ── Upload folder ─────────────────────────────────────────────────────────
    upload_folder = app.config.get("UPLOAD_FOLDER", "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    # ── Blueprints ────────────────────────────────────────────────────────────
    from app.api.v1 import api_v1
    app.register_blueprint(api_v1, url_prefix="/api/v1")

    # ── Error handlers ────────────────────────────────────────────────────────
    from app.middleware.error_handlers import register_error_handlers
    register_error_handlers(app)

    # ── Security headers ──────────────────────────────────────────────────────
    @app.after_request
    def set_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

    return app
