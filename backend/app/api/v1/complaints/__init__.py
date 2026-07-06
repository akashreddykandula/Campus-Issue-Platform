from flask import Blueprint
complaints_bp = Blueprint("complaints", __name__)
from app.api.v1.complaints import routes  # noqa: F401, E402
