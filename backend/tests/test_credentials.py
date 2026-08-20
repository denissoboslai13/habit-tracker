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

def test_register_success(client):
    # determine whether you can register with a new email, check status code
    response = client.post('/api/register', json={
        'email': 'test@example.com',
        'password_hash': 'somepassword'
    })
    assert response.status_code == 201

def test_register_duplicate_email(client):
    # determine that you cant register with duplicate email, again status code
    client.post('/api/register', json={'email': 'test@example.com', 'password_hash': 'pw'})
    response = client.post('/api/register', json={'email': 'test@example.com', 'password_hash': 'pw'})
    assert response.status_code == 409

def test_login(client):
    # first create account, then assert whether you get 200 and a jwt back
    client.post('/api/register', json={
        'email': 'test@example.com',
        'password_hash': 'somepassword'
    })

    response = client.post('/api/login', json={
        'email': 'test@example.com',
        'password_hash': 'somepassword'
    })

    assert response.status_code == 200
    assert 'access_token_cookie' in response.headers.get('Set-Cookie', '')

def test_wrong_login(client):
    # account doesnt exist or wrong credentials logging in
    response = client.post('/api/login', json={
        'email': 'test@example.com',
        'password_hash': 'somepassword'
    })

    assert response.status_code == 401

def test_delete_user(client):
    # can you delete your own account account
    client.post('/api/register', json={
            'email': 'test@example.com',
            'password_hash': 'somepassword'
        })
    
    res = client.post('/api/login', json={
        'email': 'test@example.com',
        'password_hash': 'somepassword'
    })
    assert res.status_code == 200

    csrf_token = client.get_cookie('csrf_access_token').value

    delete = client.delete('/api/users/1', headers={'X-CSRF-TOKEN': csrf_token})

    assert delete.status_code == 204

def test_wrong_delete(client):
    # you cant delete someone elses account, or your own without jwt
    client.post('/api/register', json={
            'email': 'test@example.com',
            'password_hash': 'somepassword'
        })

    client.post('/api/register', json={
                'email': 'nieco@example.com',
                'password_hash': 'niecopassword'
            })
    
    res = client.post('/api/login', json={
        'email': 'test@example.com',
        'password_hash': 'somepassword'
    })

    csrf_token = client.get_cookie('csrf_access_token').value

    # different user, cant delete
    delete_wrong = client.delete('/api/users/2', headers={'X-CSRF-TOKEN': csrf_token})
    # no auth key, cant even delete your own account without auth key
    delete_no_key = client.delete('/api/users/1')

    assert delete_wrong.status_code == 401
    assert delete_no_key.status_code == 401