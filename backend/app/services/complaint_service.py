"""
services/complaint_service.py
------------------------------
CRUD and lifecycle operations for complaints.
"""

from datetime import datetime
from app.extensions import db
from app.models import Complaint, ComplaintHistory, DuplicateComplaint
from app.services.priority_engine import PriorityEngine
from app.services.notification_service import NotificationService
from app.services.file_service import FileService


class ComplaintService:

    @staticmethod
    def create(student_id: int, data: dict, image_file=None) -> tuple[Complaint | None, str | None]:
        score, level = PriorityEngine.calculate(data["title"], data["description"])

        image_filename = None
        if image_file:
            image_filename, err = FileService.save_image(image_file)
            if err:
                return None, err

        location = data.get("location", "Others")
        custom_location = data.get("custom_location", "").strip() or None
        if location == "Others" and not custom_location:
            return None, "Custom location is required when 'Others' is selected."

        complaint = Complaint(
            student_id      = student_id,
            title           = data["title"].strip(),
            description     = data["description"].strip(),
            category        = data["category"],
            location        = location,
            custom_location = custom_location,
            image_filename  = image_filename,
            priority_score  = score,
            priority_level  = level,
            status          = "Pending",
        )
        db.session.add(complaint)
        db.session.flush()  # get complaint.id before commit

        # Log initial status
        history = ComplaintHistory(
            complaint_id = complaint.id,
            changed_by   = f"student:{student_id}",
            old_status   = None,
            new_status   = "Pending",
            remark       = "Complaint submitted",
        )
        db.session.add(history)
        db.session.commit()

        # Notify student
        NotificationService.send(
            student_id   = student_id,
            complaint_id = complaint.id,
            title        = "Complaint Submitted",
            message      = f"Your complaint '{complaint.title}' has been received and is under review.",
            notif_type   = "success",
        )

        # Critical alert — notify all admins
        if level == "Critical":
            NotificationService.alert_admins_critical(complaint)

        return complaint, None

    @staticmethod
    def update_status(complaint_id: int, new_status: str, admin_id: int, remark: str = "") -> tuple[Complaint | None, str | None]:
        complaint = Complaint.query.get(complaint_id)
        if not complaint:
            return None, "Complaint not found."

        old_status = complaint.status
        complaint.status = new_status

        if new_status == "Resolved":
            complaint.resolved_at = datetime.utcnow()

        history = ComplaintHistory(
            complaint_id = complaint_id,
            changed_by   = f"admin:{admin_id}",
            old_status   = old_status,
            new_status   = new_status,
            remark       = remark,
        )
        db.session.add(history)
        db.session.commit()

        NotificationService.send(
            student_id   = complaint.student_id,
            complaint_id = complaint_id,
            title        = f"Complaint {new_status}",
            message      = f"Your complaint '{complaint.title}' status changed from {old_status} to {new_status}. {remark}",
            notif_type   = "success" if new_status == "Resolved" else "info",
        )
        return complaint, None

    @staticmethod
    def join_duplicate(original_id: int, duplicate_id: int, similarity: float) -> tuple[bool, str | None]:
        original = Complaint.query.get(original_id)
        duplicate = Complaint.query.get(duplicate_id)
        if not original or not duplicate:
            return False, "Complaint not found."

        original.reporter_count += 1
        duplicate.is_duplicate = True
        duplicate.parent_id    = original_id

        link = DuplicateComplaint(
            original_id  = original_id,
            duplicate_id = duplicate_id,
            similarity   = similarity,
        )
        db.session.add(link)
        db.session.commit()

        NotificationService.send(
            student_id   = duplicate.student_id,
            complaint_id = original_id,
            title        = "Duplicate Complaint — Joined",
            message      = f"Your complaint was similar to an existing one. You've been added as a reporter. Total reporters: {original.reporter_count}.",
            notif_type   = "warning",
        )
        return True, None

    @staticmethod
    def delete(complaint_id: int) -> tuple[bool, str | None]:
        complaint = Complaint.query.get(complaint_id)
        if not complaint:
            return False, "Complaint not found."
        if complaint.image_filename:
            FileService.delete_image(complaint.image_filename)
        db.session.delete(complaint)
        db.session.commit()
        return True, None
