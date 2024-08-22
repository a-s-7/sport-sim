from flask import Blueprint

from backend.app.routes.t20_league_routes import t20_league_bp
from backend.app.routes.wtc_routes import wtc_bp

main_blueprint = Blueprint('main', __name__)

main_blueprint.register_blueprint(wtc_bp)
main_blueprint.register_blueprint(t20_league_bp)

