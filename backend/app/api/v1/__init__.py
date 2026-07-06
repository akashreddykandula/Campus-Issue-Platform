from flask import Blueprint

api_v1 = Blueprint("api_v1", __name__)

from app.api.v1.auth import auth_bp
from app.api.v1.complaints import complaints_bp
from app.api.v1.admin import admin_bp
from app.api.v1.analytics import analytics_bp
from app.api.v1.notifications import notifications_bp

api_v1.register_blueprint(auth_bp,          url_prefix="/auth")
api_v1.register_blueprint(complaints_bp,    url_prefix="/complaints")
api_v1.register_blueprint(admin_bp,         url_prefix="/admin")
api_v1.register_blueprint(analytics_bp,     url_prefix="/analytics")
api_v1.register_blueprint(notifications_bp, url_prefix="/notifications")
