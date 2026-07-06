"""tests/test_priority_engine.py"""

from app.services.priority_engine import PriorityEngine


def test_critical_priority():
    score, level = PriorityEngine.calculate("Fire in lab", "There is fire and smoke everywhere")
    assert level == "Critical"
    assert score >= 81


def test_low_priority():
    score, level = PriorityEngine.calculate("WiFi slow", "The wifi connection drops sometimes")
    assert level in ("Low", "Medium")


def test_high_priority():
    score, level = PriorityEngine.calculate("Electrical spark", "There are sparks near the electrical panel")
    assert level in ("High", "Critical")


def test_medium_priority():
    score, level = PriorityEngine.calculate("Water leakage", "Water is dripping from the ceiling")
    assert level in ("Medium", "High")
