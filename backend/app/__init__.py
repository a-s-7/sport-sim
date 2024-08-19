from flask import Flask, Config
from flask_cors import CORS

from backend.app.routes.t20_league_routes import t20_league_bp
from backend.app.routes.wtc_routes import wtc_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(wtc_bp)
    app.register_blueprint(t20_league_bp)


    return app