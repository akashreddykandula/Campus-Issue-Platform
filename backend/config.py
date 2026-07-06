"""
config.py
---------
Configuration classes for Development, Production, and Testing.

Loaded in app/__init__.py via create_app(config_name).

All sensitive values should come from environment variables.
"""

import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


class BaseConfig:
    """Base configuration shared across all environments."""

    # ------------------------------------------------------------------
    # Base Directory
    # ------------------------------------------------------------------
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))

    # ------------------------------------------------------------------
    # Security
    # ------------------------------------------------------------------
    SECRET_KEY: str = os.environ.get(
        "SECRET_KEY",
        "dev-insecure-key-change-me"
    )

    # ------------------------------------------------------------------
    # Database
    # ------------------------------------------------------------------
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False

    # ------------------------------------------------------------------
    # CSRF
    # ------------------------------------------------------------------
    WTF_CSRF_ENABLED: bool = True
    WTF_CSRF_TIME_LIMIT: int = 3600

    # ------------------------------------------------------------------
    # Upload Configuration
    # ------------------------------------------------------------------
    UPLOAD_FOLDER: str = os.environ.get(
        "UPLOAD_FOLDER",
        os.path.join(BASE_DIR, "uploads")
    )

    MAX_CONTENT_LENGTH: int = int(
        os.environ.get(
            "MAX_CONTENT_LENGTH",
            5 * 1024 * 1024
        )
    )

    ALLOWED_EXTENSIONS: set[str] = {
        "jpg",
        "jpeg",
        "png",
    }

    # ------------------------------------------------------------------
    # Session Configuration
    # ------------------------------------------------------------------
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"

    # ------------------------------------------------------------------
    # CORS
    # ------------------------------------------------------------------
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get(
            "CORS_ORIGINS",
            "http://localhost:5173"
        ).split(",")
        if origin.strip()
    ]


class DevelopmentConfig(BaseConfig):
    """Development configuration."""

    DEBUG = True

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///complaints.db"
    )

    SESSION_COOKIE_SECURE = False


class ProductionConfig(BaseConfig):
    DEBUG = False

    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "")

    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "None"

    WTF_CSRF_SSL_STRICT = True

    def __init__(self):
        if not self.SQLALCHEMY_DATABASE_URI:
            raise ValueError("DATABASE_URL environment variable is required.")


class TestingConfig(BaseConfig):
    """Testing configuration."""

    TESTING = True

    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

    WTF_CSRF_ENABLED = False

    SESSION_COOKIE_SECURE = False


CONFIG_MAP = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig,
}