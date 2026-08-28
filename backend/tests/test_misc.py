import pytest
from app import create_app
from app.extensions import db
from app.config import TestConfig
import random
from app.utils import calculate_longest
from datetime import date, timedelta

@pytest.fixture
def app():
    app = create_app(config_class=TestConfig)
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(client):
    client.post('/api/register', json={
        'email': 'test@example.com',
        'password_hash': 'testpassword123'
    })
    
    res = client.post('/api/login', json={
        'email': 'test@example.com',
        'password_hash': 'testpassword123'
    })
    
    csrf_token = client.get_cookie('csrf_access_token').value
    return {'X-CSRF-TOKEN': csrf_token}

@pytest.fixture
def add_habit(client, auth_headers):
    response = client.post('/api/habits', json={
        "name": "running",
        "color": "random"
    }, headers=auth_headers)
    return response.json

def test_login_rate_limit(client):
    # test if login rate limit is implemented properly (max 5 per minute)
    for _ in range(5):
        client.post('/api/login', json={'email': 'test@example.com', 'password_hash': 'wrong'})
    
    response = client.post('/api/login', json={'email': 'test@example.com', 'password_hash': 'wrong'})
    assert response.status_code == 429

def test_log_interval(client, auth_headers, add_habit):
    # check if giving a from and to string returns an interval of dates
    habit_id = add_habit['id']

    for i in range(1, 10):
        client.post(f'/api/habits/{habit_id}/logs', json={
            "completed": False if random.randint(0, 1) == 1 else True,
            "date": f"2026-08-0{i}"
        }, headers=auth_headers)

    get_req = client.get(f'/api/habits/{habit_id}/logs?from=2026-08-01&to=2026-08-09', headers=auth_headers)
    assert get_req.status_code == 200
    assert len(get_req.json["logs"]) == 9

def test_longest_streak(client, auth_headers, add_habit):
    # check if longest streak returned from the api matches the streak calculated in the test
    habit_id = add_habit['id']

    logs = [
        {"date": date(2026, 8, 1) + timedelta(days=i), "completed": False if random.randint(0, 1) == 1 else True}
        for i in range(10)
    ]

    for log in logs:
        res = client.post(f'/api/habits/{habit_id}/logs', json={
            "date": log["date"].strftime("%Y-%m-%d"),
            "completed": log["completed"]
        }, headers=auth_headers)
        assert res.status_code == 201, res.json

    longest = calculate_longest(logs)

    get_req = client.get(f'/api/habits/{habit_id}/stats', headers=auth_headers)
    print(longest)
    print(get_req.json)
    assert len(get_req.json) == len(longest)

def test_delete_cascading(client, auth_headers, add_habit):
    # Check for cascading: If a user is deleted, delete all their relationships (habits, logs, ...)
    habit_id = add_habit['id']

    client.post(f'/api/habits/{habit_id}/logs', json={"completed": True}, headers=auth_headers)

    habit_get_before = client.get('/api/habits')
    log_get_before = client.get(f'/api/habits/{habit_id}/logs', headers=auth_headers)
    assert len(habit_get_before.json) == 1
    assert len(log_get_before.json["logs"]) == 1

    deletion = client.delete('/api/users/1', headers=auth_headers)
    assert deletion.status_code == 204

    habit_get_after = client.get('/api/habits')
    log_get_after = client.get(f'/api/habits/{habit_id}/logs', headers=auth_headers)
    
    assert habit_get_after.json["error"] == "User not found"
    assert log_get_after.json["error"] == "Not found"