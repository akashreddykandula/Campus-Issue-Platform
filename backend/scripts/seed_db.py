"""
scripts/seed_db.py
------------------
Populates the database with demo data for development.
Run: python scripts/seed_db.py
"""

import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from app.extensions import db
from app.models import Student, Admin, Complaint, ComplaintHistory, Notification
from app.services.priority_engine import PriorityEngine


def seed():
    app = create_app("development")
    with app.app_context():
        db.create_all()

        # Admin
        if not Admin.query.filter_by(email="admin@campus.edu").first():
            admin = Admin(full_name="Campus Admin", email="admin@campus.edu", department="Administration")
            admin.set_password("Admin@123")
            db.session.add(admin)

        # Students
        students_data = [
            dict(full_name="Rahul Sharma", roll_number="24HU5A0511", email="rahul@student.edu",
                 mobile="9876543210", course="B.Tech", branch="CSE", year="2nd"),
            dict(full_name="Priya Reddy", roll_number="22EC001", email="priya@student.edu",
                 mobile="9876543211", course="B.Tech", branch="ECE", year="3rd"),
            dict(full_name="Arjun Mehta", roll_number="23DP001", email="arjun@student.edu",
                 mobile="9876543212", course="Diploma", branch="Computer Engineering", year="1st"),
        ]

        students = []
        for sd in students_data:
            if not Student.query.filter_by(roll_number=sd["roll_number"]).first():
                s = Student(**sd)
                s.set_password("Student@1")
                db.session.add(s)
                students.append(s)

        db.session.commit()

        # Complaints
        students = Student.query.all()
        if students and Complaint.query.count() == 0:
            complaints_data = [
                dict(title="Electrical short circuit in lab", description="There is sparking near the electrical panel in Computer Lab.", category="Electrical", location="Computer Lab"),
                dict(title="Water leakage in hostel corridor", description="Water is dripping from the ceiling in Hostel Block A corridor.", category="Water Supply", location="Hostel Block A"),
                dict(title="WiFi not working in library", description="The WiFi connection in library is extremely slow and keeps dropping.", category="Internet", location="Library"),
                dict(title="Broken chair in classroom 204", description="Multiple chairs in Academic Block A room 204 are broken.", category="Furniture", location="Academic Block A"),
                dict(title="Canteen food quality issue", description="The food quality in canteen has degraded significantly.", category="Cleanliness", location="Canteen"),
            ]
            for i, cd in enumerate(complaints_data):
                score, level = PriorityEngine.calculate(cd["title"], cd["description"])
                c = Complaint(
                    student_id     = students[i % len(students)].id,
                    title          = cd["title"],
                    description    = cd["description"],
                    category       = cd["category"],
                    location       = cd["location"],
                    priority_score = score,
                    priority_level = level,
                    status         = ["Pending", "In Progress", "Resolved", "Pending", "Pending"][i],
                )
                db.session.add(c)
            db.session.commit()
            print(f"Seeded {len(complaints_data)} complaints.")

        print("Database seeded successfully.")
        print("Admin login  → admin@campus.edu / Admin@123")
        print("Student login→ 24HU5A0511 / Student@1")


if __name__ == "__main__":
    seed()
