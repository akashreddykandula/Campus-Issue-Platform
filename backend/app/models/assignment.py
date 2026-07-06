"""
models/assignment.py
--------------------
Tracks which admin is assigned to which complaint.
One complaint → one assignment (one-to-one via uselist=False).
"""

from datetime import datetime
from app.extensions import db


class Assignment(db.Model):
    __tablename__ = "assignments"

    id           = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.Integer, db.ForeignKey("complaints.id"), unique=True, nullable=False)
    admin_id     = db.Column(db.Integer, db.ForeignKey("admins.id"), nullable=False)
    note         = db.Column(db.Text, nullable=True)
    assigned_at  = db.Column(db.DateTime, default=datetime.utcnow)

    complaint    = db.relationship("Complaint", back_populates="assignment")
    admin        = db.relationship("Admin", back_populates="assignments")

    def to_dict(self) -> dict:
        return {
            "id":           self.id,
            "complaint_id": self.complaint_id,
            "admin_id":     self.admin_id,
            "note":         self.note,
            "assigned_at":  self.assigned_at.isoformat(),
            "admin_name":   self.admin.full_name if self.admin else None,
        }
