from flask import jsonify, Blueprint

from backend.models.cricket.t20.T20LeagueInitializer import T20LeagueInitializer

t20_league_bp = Blueprint('t20_league', __name__)

iplTP = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/data/cricket/league_data/ipl/ipl-2024-t.json"
iplSP = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/data/cricket/league_data/ipl/ipl-2024-s.json"

ipl = T20LeagueInitializer.initializeLeague("IPL 2024", iplTP, iplSP)

@t20_league_bp.route('/IPL/matches/<team_names>', methods=['GET'])
def get_ipl_match_data(team_names):
    return ipl.get_match_data_json(team_names)

@t20_league_bp.route('/IPL/points_table', methods=['GET'])
def get_ipl_points_table():
    return ipl.get_points_table_json()

@t20_league_bp.route('/IPL/match/<match_num>/<result>', methods=['PATCH'])
def update_ipl_match(match_num, result):
    try:
        ipl.update_match(match_num, result)
    except ValueError as e:
        return jsonify(str(e)), 400

    return jsonify({"message": "IPL match updated successfully"})


@t20_league_bp.route('/IPL/clear/<team_names>', methods=['PATCH'])
def clear_ipl_results(team_names):
    try:
        ipl.clear_incomplete_matches(team_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "IPL matches cleared successfully"})

@t20_league_bp.route('/IPL/sim/<team_names>', methods=['PATCH'])
def sim_ipl_matches(team_names):
    try:
        ipl.simulate_matches(team_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "IPL matches simulated successfully"})

@t20_league_bp.route('/IPL/nrr/<match_num>/<home_runs>/<home_wickets>/<home_overs>/<away_runs>/<away_wickets>/<away_overs>', methods=['PATCH'])
def nrr_ipl_match(match_num, home_runs, home_wickets, home_overs, away_runs, away_wickets, away_overs):
    try:
        ipl.update_match_nrr(int(match_num), int(home_runs), int(home_wickets), home_overs, int(away_runs), int(away_wickets), away_overs)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "IPL matches simulated successfully"})

