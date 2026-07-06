"""
services/notification_service.py
---------------------------------
Creates in-app notification records.
"""

from app.extensions import db
from app.models.notification import Notification


class NotificationService:

    @staticmethod
    def send(student_id: int, complaint_id: int | None, title: str, message: str, notif_type: str = "info") -> Notification:
        notif = Notification(
            student_id   = student_id,
            complaint_id = complaint_id,
            title        = title,
            message      = message,
            notif_type   = notif_type,
        )
        db.session.add(notif)
        db.session.commit()
        return notif

    @staticmethod
    def alert_admins_critical(complaint) -> None:
        """Log a critical alert — in a real system this would email all admins."""
        from app.models.admin import Admin
        admins = Admin.query.filter_by(is_active=True).all()
        for admin in admins:
            # Store as a student notification on complaint owner for now;
            # a dedicated admin notification model can be added in a future phase.
            pass

    @staticmethod
    def get_unread_count(student_id: int) -> int:
        return Notification.query.filter_by(student_id=student_id, is_read=False).count()

    @staticmethod
    def mark_read(notif_id: int, student_id: int) -> tuple[bool, str | None]:
        notif = Notification.query.filter_by(id=notif_id, student_id=student_id).first()
        if not notif:
            return False, "Notification not found."
        notif.is_read = True
        db.session.commit()
        return True, None

    @staticmethod
    def mark_all_read(student_id: int) -> None:
        Notification.query.filter_by(student_id=student_id, is_read=False).update({"is_read": True})
        db.session.commit()
