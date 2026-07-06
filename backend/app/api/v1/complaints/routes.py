"""
api/v1/complaints/routes.py
----------------------------
Student complaint CRUD + duplicate detection endpoints.
"""

from flask import request, jsonify, current_app, send_from_directory
from flask_login import login_required, current_user
from app.api.v1.complaints import complaints_bp
from app.models import Complaint
from app.services.complaint_service import ComplaintService
from app.services.duplicate_detector import DuplicateDetector
from app.middleware.auth_middleware import student_required
from app.extensions import csrf

import os

from flask import abort

# ── List complaints ───────────────────────────────────────────────────────────

@complaints_bp.route("/", methods=["GET"])
@login_required
def list_complaints():
    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    status   = request.args.get("status")
    category = request.args.get("category")

    if current_user.role == "student":
        query = Complaint.query.filter_by(student_id=current_user.id)
    else:
        query = Complaint.query

    if status:
        query = query.filter_by(status=status)
    if category:
        query = query.filter_by(category=category)

    query = query.order_by(Complaint.created_at.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    include_student = (current_user.role == "admin")
    return jsonify({
        "complaints": [c.to_dict(include_student=include_student) for c in paginated.items],
        "total":      paginated.total,
        "pages":      paginated.pages,
        "page":       page,
        "per_page":   per_page,
    }), 200


# ── Create complaint ──────────────────────────────────────────────────────────

@complaints_bp.route("/", methods=["POST"])
@csrf.exempt
@login_required
@student_required
def create_complaint():
    data = {
        "title":           request.form.get("title", ""),
        "description":     request.form.get("description", ""),
        "category":        request.form.get("category", ""),
        "location":        request.form.get("location", "Others"),
        "custom_location": request.form.get("custom_location", ""),
    }

    if not all([data["title"], data["description"], data["category"]]):
        return jsonify({"error": "Title, description and category are required."}), 400

    image_file = request.files.get("image")
    complaint, error = ComplaintService.create(current_user.id, data, image_file)
    if error:
        return jsonify({"error": error}), 400

    return jsonify({"message": "Complaint submitted successfully", "complaint": complaint.to_dict()}), 201


# ── Get single complaint ──────────────────────────────────────────────────────

@complaints_bp.route("/<int:complaint_id>", methods=["GET"])
@login_required
def get_complaint(complaint_id):
    complaint = Complaint.query.get_or_404(complaint_id)

    # Students can only view their own complaints
    if current_user.role == "student" and complaint.student_id != current_user.id:
        return jsonify({"error": "Access denied"}), 403

    data = complaint.to_dict(include_student=True)
    data["history"] = [h.to_dict() for h in complaint.history.order_by("changed_at")]
    if complaint.assignment:
        data["assignment"] = complaint.assignment.to_dict()
    return jsonify({"complaint": data}), 200


# ── Check for duplicates (before submit) ─────────────────────────────────────

@complaints_bp.route("/check-duplicate", methods=["POST"])
@csrf.exempt
@login_required
@student_required
def check_duplicate():
    data     = request.get_json(silent=True) or {}
    title    = data.get("title", "")
    category = data.get("category", "")
    location = data.get("location", "")

    if not title or not category:
        return jsonify({"duplicates": []}), 200

    duplicates = DuplicateDetector.find_similar(title, category, location)
    return jsonify({"duplicates": duplicates, "found": len(duplicates) > 0}), 200


# ── Join existing complaint (duplicate) ───────────────────────────────────────

@complaints_bp.route("/<int:complaint_id>/join", methods=["POST"])
@csrf.exempt
@login_required
@student_required
def join_complaint(complaint_id):
    data        = request.get_json(silent=True) or {}
    duplicate_id = data.get("duplicate_id")
    similarity   = data.get("similarity", 100.0)

    if not duplicate_id:
        return jsonify({"error": "duplicate_id is required"}), 400

    success, error = ComplaintService.join_duplicate(complaint_id, duplicate_id, similarity)
    if error:
        return jsonify({"error": error}), 400
    return jsonify({"message": "Joined existing complaint successfully"}), 200


# ── Serve uploaded images ─────────────────────────────────────────────────────
@complaints_bp.route("/image/<filename>", methods=["GET"])

def serve_image(filename):

    upload_folder = os.path.abspath(current_app.config["UPLOAD_FOLDER"])

    file_path = os.path.join(upload_folder, filename)

    print("=" * 60)

    print("UPLOAD FOLDER :", upload_folder)

    print("REQUEST FILE  :", filename)

    print("FULL PATH     :", file_path)

    print("EXISTS        :", os.path.exists(file_path))

    print("=" * 60)

    if not os.path.exists(file_path):

        abort(404)

    return send_from_directory(upload_folder, filename)