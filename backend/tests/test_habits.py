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

def test_add_habit(client, auth_headers):
    # can you add a habit (testing for adding two habits aswell)
    habit_post = client.post('/api/habits', json={
        "name": "running"
    }, headers=auth_headers)
    assert habit_post.status_code == 201

    habit_get = client.get('/api/habits')
    assert habit_get.status_code == 200
    assert len(habit_get.json) == 1

    # checking if adding another one increases the count
    client.post('/api/habits', json={
        "name": "cleaning"
    }, headers=auth_headers)

    habits_get_multiple = client.get('/api/habits')
    assert len(habits_get_multiple.json) == 2

def test_add_habit_wrong(client, auth_headers):
    # no multiple habits
    post1 = client.post('/api/habits', json={
        "name": "running"
    }, headers=auth_headers)
    assert post1.status_code == 201

    post2 = client.post('/api/habits', json={
        "name": "running"
    }, headers=auth_headers)

    assert post2.status_code == 409

def test_delete_habit(client, auth_headers):
    # can delete a habit after its created, check for length after get and after delete
    habit_post = client.post('/api/habits', json={
        "name": "running"
    }, headers=auth_headers)
    assert habit_post.status_code == 201

    habit_get = client.get('/api/habits')
    assert habit_get.status_code == 200
    assert len(habit_get.json) == 1

    habit_delete = client.delete(f'/api/habits/{habit_post.json["id"]}', headers=auth_headers)
    assert habit_delete.status_code == 204

    habit_get = client.get('/api/habits')
    assert habit_get.status_code == 200
    assert len(habit_get.json) == 0

def test_delete_habit_wrong(client, auth_headers):
    # cannot delete habit of someone else
    habit_post = client.post('/api/habits', json={
        "name": "running"
    }, headers=auth_headers)
    assert habit_post.status_code == 201

    habit_get = client.get('/api/habits')
    assert habit_get.status_code == 200
    assert len(habit_get.json) == 1

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

    # sending delete request to the id of the habit created by user 1, but with the token of user two
    habit_delete = client.delete('/api/habits/1', headers=header)
    assert habit_delete.status_code == 403