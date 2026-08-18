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

def test_login_rate_limit(client):
    for _ in range(5):
        client.post('/api/login', json={'email': 'test@example.com', 'password_hash': 'wrong'})
    
    response = client.post('/api/login', json={'email': 'test@example.com', 'password_hash': 'wrong'})
    assert response.status_code == 429

