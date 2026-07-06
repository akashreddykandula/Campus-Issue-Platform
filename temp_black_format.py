"""
api/v1/auth/routes.py
---------------------
Authentication endpoints for students and admins.
CSRF is disabled on these endpoints via exempt (login/register use JSON body).
"""

from flask import request, jsonify, session, current_app
from flask_login import (
    login_user,
    logout_user,
    login_required,
    current_user,
)

from app.api.v1.auth import auth_bp
from app.services.auth_service import AuthService
from app.extensions import csrf


# =============================================================================
# Student Registration
# =============================================================================

@auth_bp.route("/register", methods=["POST"])
@csrf.exempt
def register():

    data = request.get_json(silent=True) or {}

    student, error = AuthService.register_student(data)

    if error:
        print("\n" + "=" * 80)
        print("REGISTRATION FAILED")
        print(error)
        print("=" * 80 + "\n")

        return jsonify({"error": error}), 400

    login_user(student)

    print("\n" + "=" * 80)
    print("REGISTRATION SUCCESS")
    print("USER:", student)
    print("USER ID:", student.get_id())
    print("SESSION:", dict(session))
    print("=" * 80 + "\n")

    return jsonify(
        {
            "message": "Registration successful",
            "user": student.to_dict(),
        }
    ), 201


# =============================================================================
# Student Login
# =============================================================================

@auth_bp.route("/login", methods=["POST"])
@csrf.exempt
def login():

    data = request.get_json(silent=True) or {}

    roll_number = data.get("roll_number", "").strip()
    password = data.get("password", "")

    print("\n" + "=" * 80)
    print("LOGIN REQUEST")
    print("ROLL NUMBER:", roll_number)
    print("=" * 80)

    student, error = AuthService.login_student(
        roll_number,
        password,
    )

    if error:

        print("LOGIN FAILED:", error)
        print("=" * 80 + "\n")

        return jsonify({"error": error}), 401

    login_user(student)

    print("LOGIN SUCCESS")
    print("USER OBJECT:", student)
    print("USER ID:", student.get_id())
    print("SESSION AFTER LOGIN:", dict(session))
    print("=" * 80 + "\n")

    return jsonify(
        {
            "message": "Login successful",
            "user": student.to_dict(),
        }
    ), 200


# =============================================================================
# Admin Login
# =============================================================================

@auth_bp.route("/admin/login", methods=["POST"])
@csrf.exempt
def admin_login():

    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip()
    password = data.get("password", "")

    admin, error = AuthService.login_admin(
        email,
        password,
    )

    if error:
        print("\n" + "=" * 80)
        print("ADMIN LOGIN FAILED")
        print(error)
        print("=" * 80 + "\n")

        return jsonify({"error": error}), 401

    login_user(admin)

    print("\n" + "=" * 80)
    print("ADMIN LOGIN SUCCESS")
    print("USER:", admin)
    print("USER ID:", admin.get_id())
    print("SESSION:", dict(session))
    print("=" * 80 + "\n")

    return jsonify(
        {
            "message": "Admin login successful",
            "user": admin.to_dict(),
        }
    ), 200


# =============================================================================
# Logout
# =============================================================================

@auth_bp.route("/logout", methods=["POST"])
@csrf.exempt
@login_required
def logout():

    print("\n" + "=" * 80)
    print("LOGOUT")
    print("CURRENT USER:", current_user)
    print("SESSION BEFORE:", dict(session))

    logout_user()
    session.clear()

    print("SESSION AFTER:", dict(session))
    print("=" * 80 + "\n")

    response = jsonify(
        {
            "message": "Logged out successfully",
        }
    )

    response.delete_cookie(
        current_app.config.get(
            "REMEMBER_COOKIE_NAME",
            "remember_token",
        ),
        path="/",
    )

    return response, 200


# =============================================================================
# Current Logged-in User
# =============================================================================

@auth_bp.route("/me", methods=["GET"])
@login_required
def me():

    print("\n" + "=" * 80)
    print("CURRENT USER ENDPOINT")
    print("CURRENT USER:", current_user)
    print("SESSION:", dict(session))
    print("=" * 80 + "\n")

    return jsonify(
        {
            "user": current_user.to_dict(),
        }
    ), 200