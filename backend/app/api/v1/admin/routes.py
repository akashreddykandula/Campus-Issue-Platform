"""
api/v1/admin/routes.py
-----------------------
Admin-only endpoints: manage complaints, assign, update status, manage students.
"""

from flask import request, jsonify
from flask_login import login_required, current_user
from app.api.v1.admin import admin_bp
from app.models import Complaint, Student, Assignment
from app.services.complaint_service import ComplaintService
from app.middleware.auth_middleware import admin_required
from app.extensions import db, csrf


# ── All complaints (admin view) ───────────────────────────────────────────────

@admin_bp.route("/complaints", methods=["GET"])
@login_required
@admin_required
def get_all_complaints():
    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 15, type=int)
    status   = request.args.get("status")
    category = request.args.get("category")
    priority = request.args.get("priority")
    search   = request.args.get("search", "")

    query = Complaint.query
    if status:
        query = query.filter_by(status=status)
    if category:
        query = query.filter_by(category=category)
    if priority:
        query = query.filter_by(priority_level=priority)
    if search:
        query = query.filter(
            Complaint.title.ilike(f"%{search}%") |
            Complaint.description.ilike(f"%{search}%")
        )

    query = query.order_by(Complaint.priority_score.desc(), Complaint.created_at.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "complaints": [c.to_dict(include_student=True) for c in paginated.items],
        "total":      paginated.total,
        "pages":      paginated.pages,
        "page":       page,
        "per_page":   per_page,
    }), 200


# ── Update complaint status ───────────────────────────────────────────────────

@admin_bp.route("/complaints/<int:complaint_id>/status", methods=["PUT"])
@csrf.exempt
@login_required
@admin_required
def update_status(complaint_id):
    data       = request.get_json(silent=True) or {}
    new_status = data.get("status")
    remark     = data.get("remark", "")

    valid = ["Pending", "In Progress", "Resolved", "Rejected", "Escalated"]
    if new_status not in valid:
        return jsonify({"error": f"Invalid status. Must be one of: {valid}"}), 400

    complaint, error = ComplaintService.update_status(complaint_id, new_status, current_user.id, remark)
    if error:
        return jsonify({"error": error}), 404

    return jsonify({"message": "Status updated", "complaint": complaint.to_dict()}), 200


# ── Assign complaint to admin ─────────────────────────────────────────────────

@admin_bp.route("/complaints/<int:complaint_id>/assign", methods=["POST"])
@csrf.exempt
@login_required
@admin_required
def assign_complaint(complaint_id):
    data     = request.get_json(silent=True) or {}
    admin_id = data.get("admin_id", current_user.id)
    note     = data.get("note", "")

    complaint = Complaint.query.get_or_404(complaint_id)

    existing = Assignment.query.filter_by(complaint_id=complaint_id).first()
    if existing:
        existing.admin_id = admin_id
        existing.note     = note
    else:
        assignment = Assignment(complaint_id=complaint_id, admin_id=admin_id, note=note)
        db.session.add(assignment)

    db.session.commit()
    return jsonify({"message": "Complaint assigned successfully"}), 200


# ── Delete complaint ──────────────────────────────────────────────────────────

@admin_bp.route("/complaints/<int:complaint_id>", methods=["DELETE"])
@csrf.exempt
@login_required
@admin_required
def delete_complaint(complaint_id):
    success, error = ComplaintService.delete(complaint_id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Complaint deleted"}), 200


# ── List all students ─────────────────────────────────────────────────────────

@admin_bp.route("/students", methods=["GET"])
@login_required
@admin_required
def get_students():
    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 15, type=int)
    search   = request.args.get("search", "")

    query = Student.query
    if search:
        query = query.filter(
            Student.full_name.ilike(f"%{search}%") |
            Student.roll_number.ilike(f"%{search}%") |
            Student.email.ilike(f"%{search}%")
        )
    query = query.order_by(Student.created_at.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "students": [s.to_dict() for s in paginated.items],
        "total":    paginated.total,
        "pages":    paginated.pages,
        "page":     page,
    }), 200


# ── Get single student ────────────────────────────────────────────────────────

@admin_bp.route("/students/<int:student_id>", methods=["GET"])
@login_required
@admin_required
def get_student(student_id):
    student = Student.query.get_or_404(student_id)
    data    = student.to_dict()
    data["complaint_count"] = student.complaints.count()
    data["resolved_count"]  = student.complaints.filter_by(status="Resolved").count()
    return jsonify({"student": data}), 200


# ── Toggle student active status ──────────────────────────────────────────────

@admin_bp.route("/students/<int:student_id>/toggle", methods=["PATCH"])
@csrf.exempt
@login_required
@admin_required
def toggle_student(student_id):
    student = Student.query.get_or_404(student_id)
    student.is_active = not student.is_active
    db.session.commit()
    status_str = "activated" if student.is_active else "deactivated"
    return jsonify({"message": f"Student {status_str}", "is_active": student.is_active}), 200


# ── Dashboard summary for admin ───────────────────────────────────────────────

@admin_bp.route("/dashboard", methods=["GET"])
@login_required
@admin_required
def dashboard():
    from app.services.analytics_service import AnalyticsService
    overview = AnalyticsService.get_overview()
    recent   = Complaint.query.order_by(Complaint.created_at.desc()).limit(5).all()
    critical = Complaint.query.filter_by(priority_level="Critical", status="Pending").all()
    return jsonify({
        "overview":          overview,
        "recent_complaints": [c.to_dict(include_student=True) for c in recent],
        "critical_pending":  [c.to_dict(include_student=True) for c in critical],
    }), 200
