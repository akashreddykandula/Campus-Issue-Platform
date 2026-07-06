"""tests/test_complaints.py"""


def _login_student(client, student):
    client.post("/api/v1/auth/login", json={
        "roll_number": student.roll_number,
        "password": "Test@123",
    })


def test_create_complaint(client, student):
    _login_student(client, student)
    resp = client.post("/api/v1/complaints/", data={
        "title": "Electrical sparking in lab",
        "description": "There are sparks near the electrical panel in the computer lab corridor.",
        "category": "Electrical",
        "location": "Computer Lab",
    }, content_type="multipart/form-data")
    assert resp.status_code == 201
    data = resp.json["complaint"]
    assert data["priority_level"] in ("High", "Critical")
    assert data["status"] == "Pending"


def test_list_complaints(client, student):
    _login_student(client, student)
    resp = client.get("/api/v1/complaints/")
    assert resp.status_code == 200
    assert "complaints" in resp.json


def test_duplicate_check(client, student):
    _login_student(client, student)
    resp = client.post("/api/v1/complaints/check-duplicate", json={
        "title": "Electrical sparking in lab",
        "category": "Electrical",
        "location": "Computer Lab",
    })
    assert resp.status_code == 200
    assert "found" in resp.json
