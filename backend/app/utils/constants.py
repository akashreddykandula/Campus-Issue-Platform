"""
constants.py
------------
Single source of truth for all enum-like values used across models,
services, and API validation. Import from here — never redefine elsewhere.
"""

# ── PRIORITY ────────────────────────────────────────────────────────────────

PRIORITY_KEYWORDS: dict[str, int] = {
    "fire":            100,
    "smoke":            80,
    "electrical":       70,
    "spark":            60,
    "medical":         100,
    "emergency":        90,
    "water leakage":    40,
    "flood":            50,
    "broken chair":     10,
    "wifi":              5,
    "internet":          5,
    "light":            15,
    "fan":              15,
    "ac":               20,
    "air conditioner":  20,
    "sewage":           35,
    "toilet":           30,
    "pest":             25,
    "rodent":           30,
    "theft":            60,
    "damage":           20,
}

PRIORITY_LEVELS: dict[str, tuple[int, int]] = {
    "Low":      (0,   20),
    "Medium":   (21,  50),
    "High":     (51,  80),
    "Critical": (81, 9999),
}

# Escalation delays in hours (0 = immediate)
ESCALATION_HOURS: dict[str, int] = {
    "Low":      168,   # 7 days
    "Medium":    72,   # 3 days
    "High":      24,   # 24 hours
    "Critical":   0,   # Immediate
}

# ── COMPLAINT CATEGORIES ─────────────────────────────────────────────────────

CATEGORIES: list[str] = [
    "Electrical",
    "Water Supply",
    "Internet",
    "Hostel",
    "Classroom",
    "Furniture",
    "Medical",
    "Security",
    "Laboratory",
    "Library",
    "Transport",
    "Cleanliness",
    "Others",
]

# ── COMPLAINT STATUS ─────────────────────────────────────────────────────────

STATUSES: list[str] = [
    "Pending",
    "In Progress",
    "Resolved",
    "Rejected",
    "Escalated",
]

# ── LOCATIONS ────────────────────────────────────────────────────────────────

PREDEFINED_LOCATIONS: list[str] = [
    "Academic Block A",
    "Academic Block B",
    "Academic Block C",
    "Diploma Block",
    "Library",
    "Computer Lab",
    "Electronics Lab",
    "Mechanical Lab",
    "Civil Lab",
    "Hostel Block A",
    "Hostel Block B",
    "Hostel Block C",
    "Boys Hostel",
    "Girls Hostel",
    "Parking",
    "Ground",
    "Canteen",
    "Main Gate",
    "Others",
]

# ── COURSES ──────────────────────────────────────────────────────────────────

COURSES: list[str] = ["B.Tech", "Diploma"]

BTECH_BRANCHES: list[str] = [
    "CSE",
    "CSE AI & ML",
    "CSE Data Science",
    "Information Technology",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "MBA",
    "MCA",
    "Others",
]

DIPLOMA_BRANCHES: list[str] = [
    "Computer Engineering",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "Automobile",
    "Others",
]

BTECH_YEARS: list[str] = ["1st", "2nd", "3rd", "4th"]
DIPLOMA_YEARS: list[str] = ["1st", "2nd", "3rd"]

# ── DUPLICATE DETECTION ──────────────────────────────────────────────────────

DUPLICATE_SIMILARITY_THRESHOLD: int = 85   # RapidFuzz token_sort_ratio %

# ── FILE UPLOAD ──────────────────────────────────────────────────────────────

ALLOWED_IMAGE_EXTENSIONS: set[str] = {"jpg", "jpeg", "png"}
MAX_IMAGE_SIZE_BYTES: int = 5 * 1024 * 1024  # 5 MB
