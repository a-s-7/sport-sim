from flask import Blueprint, jsonify

from models.cricket.t20.T20LeagueInitializer import T20LeagueInitializer

iplTP = "./data/cricket/league_data/ipl/ipl-2024-t.json"
iplSP = "./data/cricket/league_data/ipl/ipl-2024-s.json"
bblTP = "./data/cricket/league_data/bbl/bbl-2024-t.json"
bblSP = "./data/cricket/league_data/bbl/bbl-2024-s.json"
sa20TP = "./data/cricket/league_data/sa20/sa20-2024-t.json"
sa20SP = "./data/cricket/league_data/sa20/sa20-2024-s.json"
ilt20TP = "./data/cricket/league_data/ilt20/ilt20-2024-t.json"
ilt20SP = "./data/cricket/league_data/ilt20/ilt20-2024-s.json"

ipl = T20LeagueInitializer.initializeLeague("IPL 2024", iplTP, iplSP)
bbl = T20LeagueInitializer.initializeLeague("BBL 2024", bblTP, bblSP)
sa20 = T20LeagueInitializer.initializeLeague("SA20 2024", sa20TP, sa20SP)
ilt20 = T20LeagueInitializer.initializeLeague("ILT20 2024", ilt20TP, ilt20SP)

league_dict = {"IPL": ipl, "BBL": bbl, "SA20": sa20, "ILT20": ilt20}

t20_league_bp = Blueprint('t20_league_bp', __name__)

@t20_league_bp.route('/<league_name>/matches/<team_names>/<stadium_names>', methods=['GET'])
def get_league_match_data(league_name, team_names, stadium_names):
    league = league_dict[league_name]

    return league.get_match_data_json(team_names, stadium_names)

@t20_league_bp.route('/<league_name>/points_table', methods=['GET'])
def get_league_points_table(league_name):
    league = league_dict[league_name]

    return league.get_points_table_json()

@t20_league_bp.route('/<league_name>/teams', methods=['GET'])
def get_league_teams(league_name):
    league = league_dict[league_name]

    return league.get_teams_json()

@t20_league_bp.route('/<league_name>/venues', methods=['GET'])
def get_league_venues(league_name):
    league = league_dict[league_name]

    return league.get_venues_json()

@t20_league_bp.route('/<league_name>/match/<match_num>/<result>', methods=['PATCH'])
def update_league_match(league_name, match_num, result):
    league = league_dict[league_name]

    try:
        league.update_match(match_num, result)
    except ValueError as e:
        return jsonify(str(e)), 400

    return jsonify({"message": f"{league_name} match updated successfully"})


@t20_league_bp.route('/<league_name>/clear/<match_nums>', methods=['PATCH'])
def clear_league_results(league_name, match_nums):
    league = league_dict[league_name]

    try:
        league.clear_incomplete_matches(match_nums)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": f"{league_name} matches cleared successfully"})

@t20_league_bp.route('/<league_name>/sim/<match_nums>', methods=['PATCH'])
def sim_league_matches(league_name, match_nums):
    league = league_dict[league_name]

    try:
        league.simulate_matches(match_nums)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": f"{league_name} matches simulated successfully"})

@t20_league_bp.route('/<league_name>/nrr/<match_num>/<home_runs>/<home_wickets>/<home_overs>/<away_runs>/<away_wickets>/<away_overs>', methods=['PATCH'])
def nrr_league_match(league_name, match_num, home_runs, home_wickets, home_overs, away_runs, away_wickets, away_overs):
    league = league_dict[league_name]

    try:
        league.update_match_nrr(int(match_num), int(home_runs), int(home_wickets), home_overs, int(away_runs), int(away_wickets), away_overs)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": f"{league_name} matches simulated successfully"})

