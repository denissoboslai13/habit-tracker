from flask import Flask
from .config import ProductionConfig, DevelopmentConfig
from .extensions import db, jwt, limiter
import os
from flask_jwt_extended import JWTManager
from flask_cors import CORS

def create_app():
    app = Flask(__name__, instance_relative_config=True, template_folder="../templates", static_folder="../static")

    if os.environ.get('FLASK_ENV') == 'production':
        app.config.from_object(ProductionConfig)
    else:
        app.config.from_object(DevelopmentConfig)

    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True,
         allow_headers=["Content-Type", "X-CSRF-TOKEN"])

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