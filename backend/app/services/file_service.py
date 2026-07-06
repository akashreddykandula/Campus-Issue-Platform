"""
services/file_service.py
------------------------
Handles image upload validation and storage.
"""

import os
import uuid
from flask import current_app
from werkzeug.utils import secure_filename
from app.utils.constants import ALLOWED_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE_BYTES


class FileService:

    @staticmethod
    def save_image(file) -> tuple[str | None, str | None]:
        """Validate and save an uploaded image. Returns (filename, error)."""
        if not file or not file.filename:
            return None, "No file provided."

        ext = file.filename.rsplit(".", 1)[-1].lower()
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            return None, f"File type '.{ext}' not allowed. Use jpg, jpeg, or png."

        # Read into memory to check size
        file_bytes = file.read()
        if len(file_bytes) > MAX_IMAGE_SIZE_BYTES:
            return None, "File size exceeds 5 MB limit."

        filename = f"{uuid.uuid4().hex}.{ext}"
        safe_name = secure_filename(filename)
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        os.makedirs(upload_folder, exist_ok=True)
        path = os.path.join(upload_folder, safe_name)

        with open(path, "wb") as f:
            f.write(file_bytes)

        return safe_name, None

    @staticmethod
    def delete_image(filename: str) -> None:
        """Remove an image from disk. Silently ignores missing files."""
        try:
            upload_folder = current_app.config["UPLOAD_FOLDER"]
            path = os.path.join(upload_folder, secure_filename(filename))
            if os.path.exists(path):
                os.remove(path)
        except Exception:
            pass
