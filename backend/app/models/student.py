"""
models/student.py
-----------------
Student ORM model.  Implements Flask-Login's UserMixin so student
sessions work with login_manager.
"""

from datetime import datetime
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db


class Student(UserMixin, db.Model):
    __tablename__ = "students"

    id            = db.Column(db.Integer, primary_key=True)
    full_name     = db.Column(db.String(150), nullable=False)
    roll_number   = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email         = db.Column(db.String(150), unique=True, nullable=False, index=True)
    mobile        = db.Column(db.String(15), nullable=False)
    course        = db.Column(db.String(50), nullable=False)
    branch        = db.Column(db.String(100), nullable=False)
    year          = db.Column(db.String(10), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    is_active     = db.Column(db.Boolean, default=True)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at    = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    complaints    = db.relationship("Complaint", back_populates="student", lazy="dynamic")
    notifications = db.relationship("Notification", back_populates="student", lazy="dynamic")

    # Flask-Login requires get_id() to return a unique string
    def get_id(self) -> str:
        return f"student:{self.id}"

    @property
    def role(self) -> str:
        return "student"

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self) -> dict:
        return {
            "id":          self.id,
            "full_name":   self.full_name,
            "roll_number": self.roll_number,
            "email":       self.email,
            "mobile":      self.mobile,
            "course":      self.course,
            "branch":      self.branch,
            "year":        self.year,
            "is_active":   self.is_active,
            "created_at":  self.created_at.isoformat(),
            "role":        "student",
        }

    def __repr__(self) -> str:
        return f"<Student {self.roll_number}>"
