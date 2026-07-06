"""tests/test_duplicate_detector.py"""

from rapidfuzz import fuzz
from app.utils.constants import DUPLICATE_SIMILARITY_THRESHOLD


def test_high_similarity():
    ratio = fuzz.token_sort_ratio("WiFi not working in library", "WiFi is not working in the library")
    assert ratio >= DUPLICATE_SIMILARITY_THRESHOLD


def test_low_similarity():
    ratio = fuzz.token_sort_ratio("Fire in computer lab", "Broken chair in classroom")
    assert ratio < DUPLICATE_SIMILARITY_THRESHOLD
