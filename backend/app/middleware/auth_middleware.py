"""
auth_middleware.py
------------------
Decorators for role-based access control.
Usage:
    @login_required
    @role_required("admin")
    def my_admin_view():
        ...
"""

from functools import wraps
from flask import jsonify
from flask_login import current_user


def role_required(role: str):
    """Restrict a view to users whose .role attribute matches *role*."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            if not current_user.is_authenticated:
                return jsonify({"error": "Authentication required"}), 401
            if getattr(current_user, "role", None) != role:
                return jsonify({"error": "Forbidden", "message": f"Requires {role} role"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def student_required(fn):
    """Shorthand: @student_required."""
    return role_required("student")(fn)


def admin_required(fn):
    """Shorthand: @admin_required."""
    return role_required("admin")(fn)
