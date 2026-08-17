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
    response = client.post('/api/register', json={
        'email': 'test@example.com',
        'password_hash': 'somepassword'
    })
    assert response.status_code == 202

def test_register_duplicate_email(client):
    client.post('/api/register', json={'email': 'test@example.com', 'password_hash': 'pw'})
    response = client.post('/api/register', json={'email': 'test@example.com', 'password_hash': 'pw'})
    assert response.status_code == 409