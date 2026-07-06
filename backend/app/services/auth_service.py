"""
services/auth_service.py
------------------------
Business logic for student registration and login.
"""

import re
from app.extensions import db
from app.models import Student, Admin


class AuthService:

    # ── Registration ──────────────────────────────────────────────────────────

    @staticmethod
    def register_student(data: dict) -> tuple[Student | None, str | None]:
        """Validate and create a new student.  Returns (student, error_msg)."""
        errors = AuthService._validate_student_data(data)
        if errors:
            return None, errors

        if Student.query.filter_by(roll_number=data["roll_number"]).first():
            return None, "Roll number already registered."
        if Student.query.filter_by(email=data["email"].lower()).first():
            return None, "Email already registered."

        student = Student(
            full_name   = data["full_name"].strip(),
            roll_number = data["roll_number"].strip().upper(),
            email       = data["email"].strip().lower(),
            mobile      = data["mobile"].strip(),
            course      = data["course"],
            branch      = data["branch"],
            year        = data["year"],
        )
        student.set_password(data["password"])
        db.session.add(student)
        db.session.commit()
        return student, None

    # ── Login ─────────────────────────────────────────────────────────────────

    @staticmethod
    def login_student(roll_number: str, password: str) -> tuple[Student | None, str | None]:
        student = Student.query.filter_by(roll_number=roll_number.strip().upper()).first()
        if not student or not student.check_password(password):
            return None, "Invalid roll number or password."
        if not student.is_active:
            return None, "Account is deactivated. Contact admin."
        return student, None

    @staticmethod
    def login_admin(email: str, password: str) -> tuple[Admin | None, str | None]:
        admin = Admin.query.filter_by(email=email.strip().lower()).first()
        if not admin or not admin.check_password(password):
            return None, "Invalid email or password."
        if not admin.is_active:
            return None, "Admin account is deactivated."
        return admin, None

    # ── Validation helpers ────────────────────────────────────────────────────

    @staticmethod
    def _validate_student_data(data: dict) -> str | None:
        required = ["full_name", "roll_number", "email", "mobile", "course", "branch", "year", "password", "confirm_password"]
        for field in required:
            if not data.get(field, "").strip():
                return f"Field '{field}' is required."

        if not re.fullmatch(r"[^@]+@[^@]+\.[^@]+", data["email"]):
            return "Invalid email address."

        if not re.fullmatch(r"\d{10}", data["mobile"]):
            return "Mobile number must be exactly 10 digits."

        if len(data["password"]) < 6:
            return "Password must be at least 6 characters."

        if data["password"] != data["confirm_password"]:
            return "Passwords do not match."

        return None
