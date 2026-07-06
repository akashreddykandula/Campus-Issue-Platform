"""
app/__init__.py
---------------
Flask application factory.
"""

import os

from flask import Flask, session
from flask_login import current_user

from config import CONFIG_MAP
from app.extensions import db, login_manager, migrate, csrf, cors


def create_app(config_name: str | None = None) -> Flask:
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")

    app = Flask(__name__, instance_relative_config=False)
    app.config.from_object(CONFIG_MAP[config_name])

    # ------------------------------------------------------------------
    # Extensions
    # ------------------------------------------------------------------

    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)
    csrf.init_app(app)

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["CORS_ORIGINS"]
            }
        },
        supports_credentials=True,
    )

    # ------------------------------------------------------------------
    # Login Manager
    # ------------------------------------------------------------------

    login_manager.login_view = "auth.login"
    login_manager.login_message_category = "info"

    @login_manager.unauthorized_handler
    def unauthorized():
        from flask import jsonify

        print("\n" + "=" * 80)
        print("UNAUTHORIZED REQUEST")
        print("SESSION:", dict(session))
        print("=" * 80 + "\n")

        return jsonify({"error": "Authentication required"}), 401

    # ------------------------------------------------------------------
    # User Loader
    # ------------------------------------------------------------------

    @login_manager.user_loader
    def load_user(user_id: str):

        print("\n" + "=" * 80)
        print("USER LOADER CALLED")
        print("USER ID:", user_id)

        from app.models import Student, Admin

        if user_id.startswith("student:"):
            student = Student.query.get(int(user_id.split(":")[1]))
            print("FOUND STUDENT:", student)
            print("=" * 80 + "\n")
            return student

        if user_id.startswith("admin:"):
            admin = Admin.query.get(int(user_id.split(":")[1]))
            print("FOUND ADMIN:", admin)
            print("=" * 80 + "\n")
            return admin

        print("INVALID USER ID")
        print("=" * 80 + "\n")

        return None

    # ------------------------------------------------------------------
    # Debug Every Request
    # ------------------------------------------------------------------

    @app.before_request
    def debug_request():

        print("\n" + "=" * 80)
        print("NEW REQUEST")
        print("PATH:", session)
        print("SESSION DATA:", dict(session))
        print("CURRENT USER:", current_user)
        print("IS AUTHENTICATED:", current_user.is_authenticated)
        print("=" * 80 + "\n")

    # ------------------------------------------------------------------
    # Upload Folder
    # ------------------------------------------------------------------

    upload_folder = app.config.get("UPLOAD_FOLDER", "uploads")
    os.makedirs(upload_folder, exist_ok=True)

    # ------------------------------------------------------------------
    # Blueprints
    # ------------------------------------------------------------------

    from app.api.v1 import api_v1

    app.register_blueprint(
        api_v1,
        url_prefix="/api/v1",
    )

    # ------------------------------------------------------------------
    # Error Handlers
    # ------------------------------------------------------------------

    from app.middleware.error_handlers import register_error_handlers

    register_error_handlers(app)

    # ------------------------------------------------------------------
    # Security Headers
    # ------------------------------------------------------------------

    @app.after_request
    def set_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

    return app