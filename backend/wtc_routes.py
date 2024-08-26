from flask import Blueprint, jsonify

from models.cricket.test.WTCInitializer import WTCInitializer

wtcTP = "./data/cricket/wtc_data/wtc-teams.json"
wtcSP = "./data/cricket/wtc_data/wtc-series.json"
wtc = WTCInitializer.initializeWTC("ICC World Test Championship", 2023, 2025, wtcTP, wtcSP)

wtc_bp = Blueprint('wtc_bp', __name__)

@wtc_bp.route('/WTC/matches/<team_names>/<venue_names>', methods=['GET'])
def get_team_match_data(team_names, venue_names):
    return wtc.get_match_data_json(team_names, venue_names)

@wtc_bp.route('/WTC/points_table', methods=['GET'])
def get_points_table():
    return wtc.get_points_table_json()

@wtc_bp.route('/WTC/venues', methods=['GET'])
def get_ipl_venues():
    return wtc.get_venues_json()

@wtc_bp.route('/WTC/teams', methods=['GET'])
def get_ipl_teams():
    return wtc.get_teams_json()

@wtc_bp.route('/WTC/match/<series_id>/<match_num>/<result>', methods=['PATCH'])
def update_wtc_match(series_id, match_num, result):
    try:
        wtc.update_match(series_id, match_num, result)
    except ValueError as e:
        return jsonify(str(e)), 400

    return jsonify({"message": "Match updated successfully"})

@wtc_bp.route('/WTC/deduction/<series_id>/<match_num>/<team>/<deduction>', methods=['PATCH'])
def update_deduction(series_id, match_num, team, deduction):
    try:
        wtc.update_deduction(series_id, match_num, team, deduction)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Deduction updated successfully"})

@wtc_bp.route('/WTC/sim/<team_names>', methods=['PATCH'])
def sim_matches(team_names):
    try:
        wtc.simulate_matches(team_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Matches simulated successfully"})

@wtc_bp.route('/WTC/clear/<team_names>', methods=['PATCH'])
def clear_wtc(team_names):
    try:
        wtc.clear_incomplete_matches(team_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "WTC object cleared successfully"})