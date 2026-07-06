"""
models/admin.py
---------------
Admin ORM model with Flask-Login integration.
"""

from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db


class Admin(UserMixin, db.Model):
    __tablename__ = "admins"

    id            = db.Column(db.Integer, primary_key=True)
    full_name     = db.Column(db.String(150), nullable=False)
    email         = db.Column(db.String(150), unique=True, nullable=False, index=True)
    department    = db.Column(db.String(100), nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    is_active     = db.Column(db.Boolean, default=True)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    assignments   = db.relationship("Assignment", back_populates="admin", lazy="dynamic")

    def get_id(self) -> str:
        return f"admin:{self.id}"

    @property
    def role(self) -> str:
        return "admin"

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self) -> dict:
        return {
            "id":         self.id,
            "full_name":  self.full_name,
            "email":      self.email,
            "department": self.department,
            "is_active":  self.is_active,
            "created_at": self.created_at.isoformat(),
            "role":       "admin",
        }

    def __repr__(self) -> str:
        return f"<Admin {self.email}>"
