"""
models/complaint.py
-------------------
Complaint and ComplaintHistory ORM models.
Every status change is appended to ComplaintHistory for a full audit trail.
"""

from datetime import datetime
from app.extensions import db


class Complaint(db.Model):
    __tablename__ = "complaints"

    id               = db.Column(db.Integer, primary_key=True)
    student_id       = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False, index=True)
    title            = db.Column(db.String(200), nullable=False)
    description      = db.Column(db.Text, nullable=False)
    category         = db.Column(db.String(100), nullable=False)
    location         = db.Column(db.String(200), nullable=False)
    custom_location  = db.Column(db.String(200), nullable=True)
    image_filename   = db.Column(db.String(255), nullable=True)

    # Priority engine output
    priority_score   = db.Column(db.Integer, default=0)
    priority_level   = db.Column(db.String(20), default="Low")

    # Lifecycle
    status           = db.Column(db.String(50), default="Pending")
    reporter_count   = db.Column(db.Integer, default=1)  # incremented on duplicate join
    is_duplicate     = db.Column(db.Boolean, default=False)
    parent_id        = db.Column(db.Integer, db.ForeignKey("complaints.id"), nullable=True)
    escalated_at     = db.Column(db.DateTime, nullable=True)
    resolved_at      = db.Column(db.DateTime, nullable=True)

    created_at       = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at       = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student          = db.relationship("Student", back_populates="complaints")
    history          = db.relationship("ComplaintHistory", back_populates="complaint", lazy="dynamic", cascade="all, delete-orphan")
    assignment       = db.relationship("Assignment", back_populates="complaint", uselist=False, cascade="all, delete-orphan")
    notifications    = db.relationship("Notification", back_populates="complaint", lazy="dynamic", cascade="all, delete-orphan")
    duplicates       = db.relationship("DuplicateComplaint", foreign_keys="DuplicateComplaint.original_id", back_populates="original", lazy="dynamic")

    @property
    def full_location(self) -> str:
        """Return custom_location if set, otherwise the dropdown location."""
        return self.custom_location or self.location

    def to_dict(self, include_student: bool = False) -> dict:
        data = {
            "id":              self.id,
            "title":           self.title,
            "description":     self.description,
            "category":        self.category,
            "location":        self.location,
            "custom_location": self.custom_location,
            "full_location":   self.full_location,
            "image_filename":  self.image_filename,
            "priority_score":  self.priority_score,
            "priority_level":  self.priority_level,
            "status":          self.status,
            "reporter_count":  self.reporter_count,
            "is_duplicate":    self.is_duplicate,
            "parent_id":       self.parent_id,
            "escalated_at":    self.escalated_at.isoformat() if self.escalated_at else None,
            "resolved_at":     self.resolved_at.isoformat() if self.resolved_at else None,
            "created_at":      self.created_at.isoformat(),
            "updated_at":      self.updated_at.isoformat(),
            "student_id":      self.student_id,
        }
        if include_student and self.student:
            data["student"] = {
                "full_name":   self.student.full_name,
                "roll_number": self.student.roll_number,
                "course":      self.student.course,
                "branch":      self.student.branch,
            }
        return data

    def __repr__(self) -> str:
        return f"<Complaint #{self.id} [{self.priority_level}] {self.status}>"


class ComplaintHistory(db.Model):
    __tablename__ = "complaint_history"

    id           = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.Integer, db.ForeignKey("complaints.id"), nullable=False, index=True)
    changed_by   = db.Column(db.String(100), nullable=False)   # "admin:<id>" or "system"
    old_status   = db.Column(db.String(50), nullable=True)
    new_status   = db.Column(db.String(50), nullable=False)
    remark       = db.Column(db.Text, nullable=True)
    changed_at   = db.Column(db.DateTime, default=datetime.utcnow)

    complaint    = db.relationship("Complaint", back_populates="history")

    def to_dict(self) -> dict:
        return {
            "id":           self.id,
            "complaint_id": self.complaint_id,
            "changed_by":   self.changed_by,
            "old_status":   self.old_status,
            "new_status":   self.new_status,
            "remark":       self.remark,
            "changed_at":   self.changed_at.isoformat(),
        }
