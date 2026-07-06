"""
scripts/create_admin.py
------------------------
CLI helper to create an admin user.
Run: python scripts/create_admin.py
"""

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from app.extensions import db
from app.models.admin import Admin


def create_admin():
    app = create_app("development")
    with app.app_context():
        db.create_all()

        email    = os.environ.get("ADMIN_EMAIL",    "admin@campus.edu")
        password = os.environ.get("ADMIN_PASSWORD", "Admin@123")
        name     = os.environ.get("ADMIN_NAME",     "Campus Admin")

        existing = Admin.query.filter_by(email=email).first()
        if existing:
            print(f"Admin already exists: {email}")
            return

        admin = Admin(full_name=name, email=email, department="Administration")
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
        print(f"Admin created: {email} / {password}")


if __name__ == "__main__":
    create_admin()
