from flask import Flask, jsonify
from flask_cors import CORS

from backend.sports.cricket.t20.T20League import T20League
from backend.sports.cricket.t20.T20LeagueInitializer import T20LeagueInitializer
from backend.sports.cricket.test.WTCInitializer import WTCInitializer
from backend.sports.cricket.test.WTC import WTC

app = Flask(__name__)
CORS(app)

wtcTP = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/test/wtc_data/wtc-teams.json"
wtcSP = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/test/wtc_data/wtc-series.json"
wtc = WTCInitializer.initializeWTC("ICC World Test Championship", 2023, 2025, wtcTP, wtcSP)

iplTP = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/t20/league_data/ipl/ipl-2024-t.json"
iplSP = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/t20/league_data/ipl/ipl-2024-s.json"
ipl = T20LeagueInitializer.initializeLeague("IPL 2024", iplTP, iplSP)

#region Routes for ICC World Test Championship

@app.route('/WTC/matches/<team_names>', methods=['GET'])
def get_team_match_data(team_names):
    return wtc.get_match_data_json(team_names)

@app.route('/WTC/points_table', methods=['GET'])
def get_points_table():
    return wtc.get_points_table_json()

@app.route('/WTC/match/<series_id>/<match_num>/<result>', methods=['PATCH'])
def update_wtc_match(series_id, match_num, result):
    try:
        wtc.update_match(series_id, match_num, result)
    except ValueError as e:
        return jsonify(str(e)), 400

    return jsonify({"message": "Match updated successfully"})


@app.route('/WTC/deduction/<series_id>/<match_num>/<team>/<deduction>', methods=['PATCH'])
def update_deduction(series_id, match_num, team, deduction):
    try:
        wtc.update_deduction(series_id, match_num, team, deduction)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Deduction updated successfully"})

@app.route('/WTC/sim/<team_names>', methods=['PATCH'])
def sim_matches(team_names):
    try:
        wtc.simulate_matches(team_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Matches simulated successfully"})


@app.route('/WTC/clear/<team_names>', methods=['PATCH'])
def clear_wtc(team_names):
    try:
        wtc.clear_incomplete_matches(team_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "WTC object cleared successfully"})

#endregion

#region Routes for IPL

@app.route('/IPL/matches/<team_names>', methods=['GET'])
def get_ipl_match_data(team_names):
    return ipl.get_match_data_json(team_names)

@app.route('/IPL/points_table', methods=['GET'])
def get_ipl_points_table():
    return ipl.get_points_table_json()

@app.route('/IPL/match/<match_num>/<result>', methods=['PATCH'])
def update_ipl_match(match_num, result):
    try:
        ipl.update_match(match_num, result)
    except ValueError as e:
        return jsonify(str(e)), 400

    return jsonify({"message": "IPL match updated successfully"})


@app.route('/IPL/clear/<team_names>', methods=['PATCH'])
def clear_ipl_results(team_names):
    try:
        ipl.clear_incomplete_matches(team_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "IPL matches cleared successfully"})

@app.route('/IPL/sim/<team_names>', methods=['PATCH'])
def sim_ipl_matches(team_names):
    try:
        ipl.simulate_matches(team_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "IPL matches simulated successfully"})

@app.route('/IPL/nrr/<match_num>/<home_team_runs>/<home_team_overs>/<away_team_runs>/<away_team_overs>', methods=['PATCH'])
def nrr_ipl_match(match_num, home_team_runs, home_team_overs, away_team_runs, away_team_overs):
    try:
        ipl.update_match_nrr(int(match_num), int(home_team_runs), home_team_overs, int(away_team_runs), away_team_overs)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "IPL matches simulated successfully"})

#endregion

if __name__ == '__main__':
    # initialize_global_objects()
    app.run(debug=True)

