"""
api/v1/notifications/routes.py
-------------------------------
Notification listing and mark-read for students.
"""

from flask import request, jsonify
from flask_login import login_required, current_user
from app.api.v1.notifications import notifications_bp
from app.models import Notification
from app.services.notification_service import NotificationService
from app.extensions import csrf


@notifications_bp.route("/", methods=["GET"])
@login_required
def list_notifications():
    if current_user.role != "student":
        return jsonify({"error": "Students only"}), 403

    page     = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    unread   = request.args.get("unread", "false").lower() == "true"

    query = Notification.query.filter_by(student_id=current_user.id)
    if unread:
        query = query.filter_by(is_read=False)
    query = query.order_by(Notification.created_at.desc())
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "notifications": [n.to_dict() for n in paginated.items],
        "total":         paginated.total,
        "unread_count":  NotificationService.get_unread_count(current_user.id),
        "pages":         paginated.pages,
    }), 200


@notifications_bp.route("/<int:notif_id>/read", methods=["PATCH"])
@csrf.exempt
@login_required
def mark_read(notif_id):
    if current_user.role != "student":
        return jsonify({"error": "Students only"}), 403
    success, error = NotificationService.mark_read(notif_id, current_user.id)
    if error:
        return jsonify({"error": error}), 404
    return jsonify({"message": "Marked as read"}), 200


@notifications_bp.route("/read-all", methods=["PATCH"])
@csrf.exempt
@login_required
def mark_all_read():
    if current_user.role != "student":
        return jsonify({"error": "Students only"}), 403
    NotificationService.mark_all_read(current_user.id)
    return jsonify({"message": "All notifications marked as read"}), 200


@notifications_bp.route("/unread-count", methods=["GET"])
@login_required
def unread_count():
    if current_user.role != "student":
        return jsonify({"count": 0}), 200
    count = NotificationService.get_unread_count(current_user.id)
    return jsonify({"count": count}), 200
