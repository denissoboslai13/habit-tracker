import pytest
from app import create_app
from app.extensions import db
from app.config import TestConfig

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
    
    token = res.json["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def add_habit(client, auth_headers):
    response = client.post('/api/habits', json={
        "name": "running"
    }, headers=auth_headers)
    return response.json

def test_add_log(client, auth_headers, add_habit):
    # can you add a log
    habit_id = add_habit['id']
    
    response = client.post(f'/api/habits/{habit_id}/logs', json={
        "completed": True
    }, headers=auth_headers)
    
    assert response.status_code == 201

    get_req = client.get(f'/api/habits/{habit_id}/logs')
    assert len(get_req.json) == 1

def test_add_log_duplicate(client, auth_headers, add_habit):
    # you cant add a duplicate log
    habit_id = add_habit['id']
    
    client.post(f'/api/habits/{habit_id}/logs', json={
        "completed": True
    }, headers=auth_headers)

    duplicate = client.post(f'/api/habits/{habit_id}/logs', json={
        "completed": False
    }, headers=auth_headers)
    
    assert duplicate.status_code == 409

def test_delete_log(client, auth_headers, add_habit):
    # you can delete a log, check length before and after delete
    habit_id = add_habit["id"]
    
    request = client.post(f'/api/habits/{habit_id}/logs', json={
        "completed": True
    }, headers=auth_headers)

    get_req = client.get(f'/api/habits/{habit_id}/logs')
    assert len(get_req.json) == 1

    log_id = request.json["id"]
    del_req = client.delete(f'/api/habits/{habit_id}/logs/{log_id}', headers=auth_headers)
    assert del_req.status_code == 204

    get_req = client.get(f'/api/habits/{habit_id}/logs')
    assert len(get_req.json) == 0

def test_delete_log_wrong(client, auth_headers, add_habit):
    # you can delete a log, check length before and after delete
    habit_id = add_habit["id"]
    
    request = client.post(f'/api/habits/{habit_id}/logs', json={
        "completed": True
    }, headers=auth_headers)

    get_req = client.get(f'/api/habits/{habit_id}/logs')
    assert len(get_req.json) == 1

    #creating and logging in as another user
    client.post('/api/register', json={
        'email': 'nieco@example.com',
        'password_hash': 'testpassword123'
    })
    
    res = client.post('/api/login', json={
        'email': 'nieco@example.com',
        'password_hash': 'testpassword123'
    })
    
    token = res.json["access_token"]
    header = {"Authorization": f"Bearer {token}"}

    log_id = request.json["id"]
    del_req = client.delete(f'/api/habits/{habit_id}/logs/{log_id}', headers=header)
    assert del_req.status_code == 403

    get_req = client.get(f'/api/habits/{habit_id}/logs')
    assert len(get_req.json) == 1