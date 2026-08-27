import os
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

class BaseConfig:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_CSRF_PROTECT = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'tracker.db')}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_SAMESITE = 'Lax'
    CORS_ORIGINS = ['http://127.0.0.1:4200']

class ProductionConfig(BaseConfig):
    DEBUG = False
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_SAMESITE = 'None'
    CORS_ORIGINS = [os.environ.get('FRONTEND_URL')]