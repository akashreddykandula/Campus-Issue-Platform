"""
models/duplicate.py
-------------------
Links a duplicate complaint to the original.
When a student chooses 'Join Existing', a row is added here and the
original complaint's reporter_count is incremented.
"""

from datetime import datetime
from app.extensions import db


class DuplicateComplaint(db.Model):
    __tablename__ = "duplicate_complaints"

    id            = db.Column(db.Integer, primary_key=True)
    original_id   = db.Column(db.Integer, db.ForeignKey("complaints.id"), nullable=False, index=True)
    duplicate_id  = db.Column(db.Integer, db.ForeignKey("complaints.id"), nullable=False, index=True)
    similarity    = db.Column(db.Float, nullable=False)
    joined_at     = db.Column(db.DateTime, default=datetime.utcnow)

    original      = db.relationship("Complaint", foreign_keys=[original_id], back_populates="duplicates")
    duplicate_ref = db.relationship("Complaint", foreign_keys=[duplicate_id])

    def to_dict(self) -> dict:
        return {
            "id":           self.id,
            "original_id":  self.original_id,
            "duplicate_id": self.duplicate_id,
            "similarity":   self.similarity,
            "joined_at":    self.joined_at.isoformat(),
        }
