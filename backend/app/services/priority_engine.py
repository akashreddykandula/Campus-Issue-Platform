"""
services/priority_engine.py
----------------------------
Calculates complaint priority based on keyword matching.
Score thresholds: 0-20=Low, 21-50=Medium, 51-80=High, 81+=Critical
"""

from app.utils.constants import PRIORITY_KEYWORDS, PRIORITY_LEVELS


class PriorityEngine:

    @staticmethod
    def calculate(title: str, description: str) -> tuple[int, str]:
        """Return (score, level) for the given complaint text."""
        text = (title + " " + description).lower()
        score = 0
        for keyword, weight in PRIORITY_KEYWORDS.items():
            if keyword in text:
                score += weight

        level = PriorityEngine._score_to_level(score)
        return score, level

    @staticmethod
    def _score_to_level(score: int) -> str:
        for level, (low, high) in PRIORITY_LEVELS.items():
            if low <= score <= high:
                return level
        return "Critical"
