"""
tests/conftest.py
-----------------
Pytest fixtures shared across all test modules.
"""

import pytest
import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
from app.extensions import db as _db
from app.models import Student, Admin


@pytest.fixture(scope="session")
def app():
    app = create_app("testing")
    with app.app_context():
        _db.create_all()
        yield app
        _db.drop_all()


@pytest.fixture(scope="session")
def client(app):
    return app.test_client()


@pytest.fixture(scope="function")
def db(app):
    with app.app_context():
        yield _db
        _db.session.rollback()


@pytest.fixture
def student(db):
    s = Student(
        full_name="Test Student", roll_number="TEST001",
        email="test@student.edu", mobile="9000000000",
        course="B.Tech", branch="CSE", year="1st",
    )
    s.set_password("Test@123")
    db.session.add(s)
    db.session.commit()
    return s


@pytest.fixture
def admin(db):
    a = Admin(full_name="Test Admin", email="testadmin@campus.edu", department="IT")
    a.set_password("Admin@123")
    db.session.add(a)
    db.session.commit()
    return a
