"""
api/v1/auth/routes.py
---------------------
Authentication endpoints for students and admins.
CSRF is disabled on these endpoints via exempt (login/register use JSON body).
"""

from flask import request, jsonify, session, current_app
from flask_login import login_user, logout_user, login_required, current_user
from app.api.v1.auth import auth_bp
from app.services.auth_service import AuthService
from app.extensions import csrf


# ── Student Registration ──────────────────────────────────────────────────────

@auth_bp.route("/register", methods=["POST"])
@csrf.exempt
def register():
    data = request.get_json(silent=True) or {}
    student, error = AuthService.register_student(data)
    if error:
        return jsonify({"error": error}), 400
    login_user(student)
    return jsonify({"message": "Registration successful", "user": student.to_dict()}), 201


# ── Student Login ─────────────────────────────────────────────────────────────

@auth_bp.route("/login", methods=["POST"])
@csrf.exempt
def login():
    data = request.get_json(silent=True) or {}
    roll_number = data.get("roll_number", "")
    password    = data.get("password", "")
    student, error = AuthService.login_student(roll_number, password)
    if error:
        return jsonify({"error": error}), 401
    login_user(student)
    return jsonify({"message": "Login successful", "user": student.to_dict()}), 200


# ── Admin Login ───────────────────────────────────────────────────────────────

@auth_bp.route("/admin/login", methods=["POST"])
@csrf.exempt
def admin_login():
    data = request.get_json(silent=True) or {}
    email    = data.get("email", "")
    password = data.get("password", "")
    admin, error = AuthService.login_admin(email, password)
    if error:
        return jsonify({"error": error}), 401
    login_user(admin)
    return jsonify({"message": "Admin login successful", "user": admin.to_dict()}), 200


# ── Logout ────────────────────────────────────────────────────────────────────

@auth_bp.route("/logout", methods=["POST"])
@csrf.exempt
@login_required
def logout():
    logout_user()
    session.clear()

    response = jsonify({"message": "Logged out successfully"})

    response.delete_cookie(
        current_app.config.get("REMEMBER_COOKIE_NAME", "remember_token"),
        path="/"
    )

    return response, 200


# ── Current User ──────────────────────────────────────────────────────────────

@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    return jsonify({"user": current_user.to_dict()}), 200
