from flask import Flask
from flask_cors import CORS

from backend.app.routes.ipl_routes import ipl_bp
from backend.app.routes.wtc_routes import wtc_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(wtc_bp)
    app.register_blueprint(ipl_bp)

    return app