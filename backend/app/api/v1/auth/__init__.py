from flask import Blueprint
auth_bp = Blueprint("auth", __name__)
from app.api.v1.auth import routes  # noqa: F401, E402
