"""
services/escalation_service.py
--------------------------------
Auto-escalates complaints that have stayed in 'Pending' beyond their
priority-level threshold.  Run this as a cron job (e.g. every hour).

Usage (manual):
    python -c "from app.services.escalation_service import EscalationService; EscalationService.run()"
"""

from datetime import datetime, timedelta
from app.extensions import db
from app.models import Complaint, ComplaintHistory
from app.services.notification_service import NotificationService
from app.utils.constants import ESCALATION_HOURS


class EscalationService:

    @staticmethod
    def run() -> int:
        """Check all pending complaints and escalate overdue ones. Returns count escalated."""
        now = datetime.utcnow()
        escalated = 0

        pending = Complaint.query.filter_by(status="Pending").all()
        for c in pending:
            threshold_hours = ESCALATION_HOURS.get(c.priority_level)
            if threshold_hours is None:
                continue

            age_hours = (now - c.created_at).total_seconds() / 3600
            if age_hours >= threshold_hours and c.status == "Pending":
                c.status       = "Escalated"
                c.escalated_at = now

                history = ComplaintHistory(
                    complaint_id = c.id,
                    changed_by   = "system",
                    old_status   = "Pending",
                    new_status   = "Escalated",
                    remark       = f"Auto-escalated after {threshold_hours}h ({c.priority_level} priority threshold).",
                )
                db.session.add(history)

                NotificationService.send(
                    student_id   = c.student_id,
                    complaint_id = c.id,
                    title        = "Complaint Escalated",
                    message      = f"Your complaint '{c.title}' has been escalated due to no response within the expected timeframe.",
                    notif_type   = "warning",
                )
                escalated += 1

        if escalated:
            db.session.commit()

        return escalated
