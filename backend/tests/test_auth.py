"""tests/test_auth.py"""


def test_register_student(client):
    resp = client.post("/api/v1/auth/register", json={
        "full_name": "New Student", "roll_number": "NEW001",
        "email": "new@student.edu", "mobile": "9111111111",
        "course": "B.Tech", "branch": "CSE", "year": "1st",
        "password": "Test@123", "confirm_password": "Test@123",
    })
    assert resp.status_code == 201
    assert resp.json["user"]["roll_number"] == "NEW001"


def test_login_student(client, student):
    resp = client.post("/api/v1/auth/login", json={
        "roll_number": student.roll_number,
        "password": "Test@123",
    })
    assert resp.status_code == 200
    assert resp.json["user"]["role"] == "student"


def test_login_invalid(client):
    resp = client.post("/api/v1/auth/login", json={
        "roll_number": "WRONG", "password": "wrong",
    })
    assert resp.status_code == 401


def test_admin_login(client, admin):
    resp = client.post("/api/v1/auth/admin/login", json={
        "email": admin.email, "password": "Admin@123",
    })
    assert resp.status_code == 200
    assert resp.json["user"]["role"] == "admin"
