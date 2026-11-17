import pytest
from fastapi.testclient import TestClient
try:
    from backend.main import app
except ImportError:
    from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_api_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "VIDYUT SPANDAN" in response.json()["platform"]
    assert response.json()["status"] == "operational"

def test_auth_login_success():
    response = client.post("/api/auth/login", json={
        "email": "officer@vidyutspandan.gov.in",
        "password": "Officer@1234"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "officer"

def test_auth_login_invalid():
    response = client.post("/api/auth/login", json={
        "email": "officer@vidyutspandan.gov.in",
        "password": "WrongPassword"
    })
    assert response.status_code == 401

def test_public_complaint_and_tracking():
    # Submit complaint
    submit_res = client.post("/api/public/complaint", json={
        "requester_name": "Test Citizen",
        "requester_phone": "9876543210",
        "issue_type": "streetlight_fault",
        "description": "Streetlight pole 4 is not functioning",
        "location_address": "Indiranagar 100 Feet Road"
    })
    assert submit_res.status_code == 200
    tracking_id = submit_res.json()["tracking_id"]
    assert tracking_id.startswith("VS2024")

    # Track complaint
    track_res = client.get(f"/api/public/track/{tracking_id}")
    assert track_res.status_code == 200
    assert track_res.json()["data"]["requester_name"] == "Test Citizen"

def test_list_assets():
    res = client.get("/api/assets/streetlights")
    assert res.status_code == 200
    assert res.json()["total"] >= 2

    res_tr = client.get("/api/assets/transformers")
    assert res_tr.status_code == 200
    assert res_tr.json()["total"] >= 1

def test_work_orders_with_token():
    # Get officer token
    login_res = client.post("/api/auth/login", json={
        "email": "officer@vidyutspandan.gov.in",
        "password": "Officer@1234"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # List work orders
    list_res = client.get("/api/work-orders", headers=headers)
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 2

    # Create work order
    create_res = client.post("/api/work-orders", headers=headers, json={
        "title": "Automated Test Maintenance Order",
        "fault_description": "Insulator replacement required",
        "location_address": "Jayanagar 9th Block",
        "priority": "high",
        "assigned_worker_id": "worker-001",
        "due_date": "2024-11-30"
    })
    assert create_res.status_code == 200
    order_id = create_res.json()["data"]["id"]

    # Update status
    patch_res = client.patch(f"/api/work-orders/{order_id}/status", headers=headers, json={
        "status": "in_progress"
    })
    assert patch_res.status_code == 200
    assert patch_res.json()["data"]["status"] == "in_progress"

def test_reports_summary():
    login_res = client.post("/api/auth/login", json={
        "email": "admin@vidyutspandan.gov.in",
        "password": "Admin@1234"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/reports/summary", headers=headers)
    assert res.status_code == 200
    assert res.json()["total_assets"] == 487
