from app.models.student import Student
from app.models.admin import Admin
from app.models.complaint import Complaint, ComplaintHistory
from app.models.assignment import Assignment
from app.models.notification import Notification
from app.models.duplicate import DuplicateComplaint

__all__ = [
    "Student",
    "Admin",
    "Complaint",
    "ComplaintHistory",
    "Assignment",
    "Notification",
    "DuplicateComplaint",
]
