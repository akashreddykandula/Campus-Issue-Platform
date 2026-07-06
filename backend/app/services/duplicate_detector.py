"""
services/duplicate_detector.py
-------------------------------
Uses RapidFuzz token_sort_ratio to detect similar complaints.
A complaint is flagged as duplicate if similarity >= 85% AND
same category AND same location.
"""

from rapidfuzz import fuzz
from app.models import Complaint
from app.utils.constants import DUPLICATE_SIMILARITY_THRESHOLD


class DuplicateDetector:

    @staticmethod
    def find_similar(title: str, category: str, location: str, exclude_id: int | None = None) -> list[dict]:
        """
        Return a list of existing complaints that are potential duplicates.
        Each item: {complaint_id, title, similarity, status}
        """
        candidates = (
            Complaint.query
            .filter_by(category=category, location=location)
            .filter(Complaint.status != "Resolved")
        )
        if exclude_id:
            candidates = candidates.filter(Complaint.id != exclude_id)

        results = []
        for c in candidates.all():
            ratio = fuzz.token_sort_ratio(title.lower(), c.title.lower())
            if ratio >= DUPLICATE_SIMILARITY_THRESHOLD:
                results.append({
                    "complaint_id": c.id,
                    "title":        c.title,
                    "similarity":   ratio,
                    "status":       c.status,
                    "reporter_count": c.reporter_count,
                })
        return sorted(results, key=lambda x: x["similarity"], reverse=True)
