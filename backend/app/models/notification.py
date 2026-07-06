"""
models/notification.py
----------------------
In-app notifications delivered to students.
"""

from datetime import datetime
from app.extensions import db


class Notification(db.Model):
    __tablename__ = "notifications"

    id           = db.Column(db.Integer, primary_key=True)
    student_id   = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False, index=True)
    complaint_id = db.Column(db.Integer, db.ForeignKey("complaints.id"), nullable=True)
    title        = db.Column(db.String(200), nullable=False)
    message      = db.Column(db.Text, nullable=False)
    notif_type   = db.Column(db.String(50), default="info")   # info | success | warning | error
    is_read      = db.Column(db.Boolean, default=False)
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

    student      = db.relationship("Student", back_populates="notifications")
    complaint    = db.relationship("Complaint", back_populates="notifications")

    def to_dict(self) -> dict:
        return {
            "id":           self.id,
            "student_id":   self.student_id,
            "complaint_id": self.complaint_id,
            "title":        self.title,
            "message":      self.message,
            "notif_type":   self.notif_type,
            "is_read":      self.is_read,
            "created_at":   self.created_at.isoformat(),
        }
