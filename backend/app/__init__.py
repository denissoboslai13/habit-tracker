from flask import Flask
from .config import Config
from .extensions import db, jwt, limiter
import os
from flask_jwt_extended import JWTManager
from flask_cors import CORS

def create_app(config_class: type = Config):
    app = Flask(__name__, instance_relative_config=True, template_folder="../templates", static_folder="../static")
    CORS(app, origins=[os.environ.get("FRONTEND_URL")], supports_credentials=True)

    app.config.from_object(config_class)

    os.makedirs(app.instance_path, exist_ok=True)

    db.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)

    @app.get('/health')
    def health():
        return "OK", 200

    from .routes import bp
    app.register_blueprint(bp)

    return app