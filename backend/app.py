from flask import Flask, jsonify
from flask_cors import CORS

from backend.sports.cricket.t20.T20League import T20League
from backend.sports.cricket.t20.T20LeagueInitializer import T20LeagueInitializer
from backend.sports.cricket.test.WTCInitializer import WTCInitializer
from backend.sports.cricket.test.WTC import WTC

app = Flask(__name__)
CORS(app)

wtc = None
ipl = None

def initialize_global_objects():
    # Initialize the WTC object

    global wtc
    teamsPath = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/test/wtc_data/wtc-teams.json"
    seriesPath = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/test/wtc_data/wtc-series.json"

    wtc = WTCInitializer.initializeWTC("ICC World Test Championship", 2023, 2025, teamsPath, seriesPath)

    # Initialize the IPL object

    global ipl
    sP = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/t20/league_data/ipl/ipl-2024-s.json"
    tP = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/t20/league_data/ipl/ipl-2024-t.json"
    ipl = T20LeagueInitializer.initializeLeague("IPL 2024", tP, sP)

#region Routes for ICC World Test Championship

@app.route('/WTC/matches/<team_names>', methods=['GET'])
def get_team_match_data(team_names):
    if(wtc == None):
        return jsonify({"error": "WTC object not initialized"}), 500

    assert isinstance(wtc, WTC), "wtc should be an instance of WTC"

    return wtc.get_match_data_json(team_names)



@app.route('/WTC/points_table', methods=['GET'])
def get_points_table():
    if(wtc == None):
        return jsonify({"error": "WTC object not initialized"}), 500

    assert isinstance(wtc, WTC), "wtc should be an instance of WTC"

    return wtc.get_points_table_json()


@app.route('/WTC/match/<series_id>/<match_num>/<result>', methods=['PATCH'])
def update_wtc_match(series_id, match_num, result):
    if(wtc == None):
        return jsonify({"error": "WTC object not initialized"}), 500

    assert isinstance(wtc, WTC), "wtc should be an instance of WTC"

    try:
        wtc.update_match(series_id, match_num, result)
    except ValueError as e:
        return jsonify(str(e)), 400

    return jsonify({"message": "Match updated successfully"})


@app.route('/WTC/deduction/<series_id>/<match_num>/<team>/<deduction>', methods=['PATCH'])
def update_deduction(series_id, match_num, team, deduction):
    if(wtc == None):
        return jsonify({"error": "WTC object not initialized"}), 500

    assert isinstance(wtc, WTC), "wtc should be an instance of WTC"

    try:
        wtc.update_deduction(series_id, match_num, team, deduction)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Deduction updated successfully"})

@app.route('/WTC/sim/<team_names>', methods=['PATCH'])
def sim_matches(team_names):
    if(wtc == None):
        return jsonify({"error": "WTC object not initialized"}), 500

    assert isinstance(wtc, WTC), "wtc should be an instance of WTC"

    try:
        wtc.simulate_matches(team_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Matches simulated successfully"})


@app.route('/WTC/clear/<team_names>', methods=['PATCH'])
def clear_wtc(team_names):
    if(wtc == None):
        return jsonify({"error": "WTC object not initialized"}), 500

    assert isinstance(wtc, WTC), "wtc should be an instance of WTC"

    try:
        wtc.clear_incomplete_matches(team_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "WTC object cleared successfully"})

#endregion

#region Routes for IPL

@app.route('/IPL/matches/<team_names>', methods=['GET'])
def get_ipl_match_data(team_names):
    if(ipl == None):
        return jsonify({"error": "IPL object not initialized"}), 500

    assert isinstance(ipl, T20League), "ipl should instance of T20League"

    return ipl.get_match_data_json(team_names)

@app.route('/IPL/points_table', methods=['GET'])
def get_ipl_points_table():
    if(ipl == None):
        return jsonify({"error": "IPL object not initialized"}), 500

    assert isinstance(ipl, T20League), "ipl should be an instance of T20League"

    return ipl.get_points_table_json()


@app.route('/IPL/match/<match_num>/<result>', methods=['PATCH'])
def update_ipl_match(match_num, result):
    if(ipl == None):
        return jsonify({"error": "IPL object not initialized"}), 500

    assert isinstance(ipl, T20League), "ipl should be an instance of T20League"

    try:
        ipl.update_match(match_num, result)
    except ValueError as e:
        return jsonify(str(e)), 400

    return jsonify({"message": "IPL match updated successfully"})


@app.route('/IPL/clear/<team_names>', methods=['PATCH'])
def clear_ipl_results(team_names):
    if (ipl == None):
        return jsonify({"error": "IPL object not initialized"}), 500

    assert isinstance(ipl, T20League), "ipl should be an instance of T20League"

    try:
        ipl.clear_incomplete_matches(team_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "IPL matches cleared successfully"})


if __name__ == '__main__':
    initialize_global_objects()
    app.run(debug=True)

