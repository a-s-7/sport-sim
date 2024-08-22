import os
from flask import Flask, send_from_directory, jsonify

from models.cricket.t20.T20LeagueInitializer import T20LeagueInitializer
from models.cricket.test.WTCInitializer import WTCInitializer

app = Flask(__name__, static_folder='../frontend/build')

iplTP = "./data/cricket/league_data/ipl/ipl-2024-t.json"
iplSP = "./data/cricket/league_data/ipl/ipl-2024-s.json"
bblTP = "./data/cricket/league_data/bbl/bbl-2024-t.json"
bblSP = "./data/cricket/league_data/bbl/bbl-2024-s.json"
ipl = T20LeagueInitializer.initializeLeague("IPL 2024", iplTP, iplSP)
bbl = T20LeagueInitializer.initializeLeague("BBL 2024", bblTP, bblSP)

wtcTP = "./data/cricket/wtc_data/wtc-teams.json"
wtcSP = "./data/cricket/wtc_data/wtc-series.json"
wtc = WTCInitializer.initializeWTC("ICC World Test Championship", 2023, 2025, wtcTP, wtcSP)

leagues = [ipl, bbl]
index_dict = {"IPL": 0, "BBL": 1}
@app.route('/')
@app.route('/<path:path>')
def serve_react_app(path=''):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/<league_name>/matches/<team_names>/<stadium_names>', methods=['GET'])
def get_league_match_data(league_name, team_names, stadium_names):
    league = leagues[index_dict[league_name]]

    return league.get_match_data_json(team_names, stadium_names)

@app.route('/<league_name>/points_table', methods=['GET'])
def get_league_points_table(league_name):
    league = leagues[index_dict[league_name]]

    return league.get_points_table_json()

@app.route('/<league_name>/teams', methods=['GET'])
def get_league_teams(league_name):
    league = leagues[index_dict[league_name]]

    return league.get_teams_json()

@app.route('/<league_name>/venues', methods=['GET'])
def get_league_venues(league_name):
    league = leagues[index_dict[league_name]]

    return league.get_venues_json()

@app.route('/<league_name>/match/<match_num>/<result>', methods=['PATCH'])
def update_league_match(league_name, match_num, result):
    league = leagues[index_dict[league_name]]

    try:
        league.update_match(match_num, result)
    except ValueError as e:
        return jsonify(str(e)), 400

    return jsonify({"message": f"{league_name} match updated successfully"})


@app.route('/<league_name>/clear/<match_nums>', methods=['PATCH'])
def clear_league_results(league_name, match_nums):
    league = leagues[index_dict[league_name]]

    try:
        league.clear_incomplete_matches(match_nums)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": f"{league_name} matches cleared successfully"})

@app.route('/<league_name>/sim/<match_nums>', methods=['PATCH'])
def sim_league_matches(league_name, match_nums):
    league = leagues[index_dict[league_name]]

    try:
        league.simulate_matches(match_nums)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": f"{league_name} matches simulated successfully"})

@app.route('/<league_name>/nrr/<match_num>/<home_runs>/<home_wickets>/<home_overs>/<away_runs>/<away_wickets>/<away_overs>', methods=['PATCH'])
def nrr_league_match(league_name, match_num, home_runs, home_wickets, home_overs, away_runs, away_wickets, away_overs):
    league = leagues[index_dict[league_name]]

    try:
        league.update_match_nrr(int(match_num), int(home_runs), int(home_wickets), home_overs, int(away_runs), int(away_wickets), away_overs)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": f"{league_name} matches simulated successfully"})




@app.route('/WTC/matches/<team_names>/<venue_names>', methods=['GET'])
def get_team_match_data(team_names, venue_names):
    return wtc.get_match_data_json(team_names, venue_names)

@app.route('/WTC/points_table', methods=['GET'])
def get_points_table():
    return wtc.get_points_table_json()

@app.route('/WTC/venues', methods=['GET'])
def get_ipl_venues():
    return wtc.get_venues_json()

@app.route('/WTC/teams', methods=['GET'])
def get_ipl_teams():
    return wtc.get_teams_json()

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

if __name__ == '__main__':
    app.run(debug=True)