import os
from datetime import datetime, timedelta
import random

from flask import Blueprint, jsonify
from pymongo import MongoClient, UpdateOne

if os.getenv("RENDER_STATUS") != "TRUE":
    from dotenv import load_dotenv
    load_dotenv()

connection_string = os.getenv('MONGODB_URI')

# Connect with MongoDB
client = MongoClient(connection_string)
db = client['franchise_leagues']

leagues_collection = db['leagues']
teams_collection = db['teams']
matches_collection = db['matches']

franchise_leagues_bp = Blueprint('franchise_leagues_bp', __name__)

@franchise_leagues_bp.route('/league_info', methods=['GET'])
def get_league_info():
    league_info = []

    for league in leagues_collection.find():
        league_info.append({"id": league["_id"],
                            "name": league["leagueName"],
                            "year": league["year"],
                            "controlBarColor": league["leagueControlBarColor"],
                            "logo": league["leagueLogo"],
                            "pointsTableColor": league["pointsTableColor"]})

    return league_info

@franchise_leagues_bp.route('/<leagueID>/matches/<team_acronyms>/<stadium_names>', methods=['GET'])
def get_league_match_data(leagueID, team_acronyms, stadium_names):

    league = leagues_collection.find_one({"_id": leagueID})
    leagueName = league["leagueName"]

    team_data = {}
    teams = teams_collection.find({"leagueID": leagueID})

    for team in teams:
        team_data[team["acronym"]] = {"gradient": team["gradient"], "logo": team["logo"]}

    match_data = []

    team_acs = team_acronyms.split("-")
    stadiums = stadium_names.split(",")

    team_all = len(team_acs) == 1 and team_acs[0] == "All"
    stadium_all = len(stadiums) == 1 and stadiums[0] == "All"

    if team_all and stadium_all:
        match_data = list(matches_collection.find({"leagueID": leagueID}, {"_id": 0}).sort("MatchNumber"))
    else:
        query = {"leagueID": leagueID}

        or_conditions = []

        if not team_all:
            or_conditions.append({"HomeTeam": {"$in": team_acs}})
            or_conditions.append({"AwayTeam": {"$in": team_acs}})

        if not stadium_all:
            or_conditions.append({"Location": {"$in": stadiums}})

        query["$or"] = or_conditions

        match_data = list(matches_collection.find(query, {"_id": 0}).sort("MatchNumber"))

    for match in match_data:
        date = datetime.strptime(match["DateUtc"], "%Y-%m-%d %H:%M:%S%z")

        match["DateUtc"] = date.strftime("%b %-d") + ", " + date.strftime("%Y")
        match["date"] = match.pop("DateUtc")

        match["startTime"] = (date - timedelta(hours=7)).strftime("%-I:%M %p")

    result = [leagueID, leagueName, team_data, match_data]

    return result

@franchise_leagues_bp.route('/<leagueID>/points_table', methods=['GET'])
def get_league_points_table(leagueID):
    teams = list(teams_collection.find({"leagueID": leagueID}, {"_id": 0, "name": 0, "gradient": 0, "leagueID": 0, "year": 0}))

    for team in teams:
        team["points"] = 0
        team["played"] = 0
        team["won"] = 0
        team["lost"] = 0
        team["noResult"] = 0
        team["nrr"] = 0
        team["runsScored"] = 0
        team["ballsFaced"] = 0
        team["oppositionBallsFaced"] = 0
        team["oppositionRunsScored"] = 0
        team["previous5"] = [None, None, None, None, None]

    team_dict = {}

    for team in teams:
        team_dict[team["acronym"]] = team

    matches = list(matches_collection.find({"leagueID": leagueID}, {"_id": 0,
                                                                    "leagueID": 0,
                                                                    "year": 0}).sort({"MatchNumber": 1}))

    overBalls = 5 if leagueID == "THU" else 6

    for match in matches:
        if match["result"] != "None":
            awayTeamData = team_dict[match["AwayTeam"]]
            homeTeamData = team_dict[match["HomeTeam"]]

            awayTeamData["played"] += 1
            homeTeamData["played"] += 1

            if match["result"] == "Home-win":
                homeTeamData["won"] += 1
                homeTeamData["previous5"].pop()
                homeTeamData["previous5"].insert(0, "Win")
                homeTeamData["points"] += 2

                awayTeamData["lost"] += 1
                awayTeamData["previous5"].pop()
                awayTeamData["previous5"].insert(0, "Loss")
            elif match["result"] == "Away-win":
                awayTeamData["won"] += 1
                awayTeamData["previous5"].pop()
                awayTeamData["previous5"].insert(0, "Win")
                awayTeamData["points"] += 2

                homeTeamData["lost"] += 1
                homeTeamData["previous5"].pop()
                homeTeamData["previous5"].insert(0, "Loss")
            else:
                awayTeamData["noResult"] += 1
                awayTeamData["points"] += 1
                awayTeamData["previous5"].pop()
                awayTeamData["previous5"].insert(0, "No Result")

                homeTeamData["noResult"] += 1
                homeTeamData["points"] += 1
                homeTeamData["previous5"].pop()
                homeTeamData["previous5"].insert(0, "No Result")


            homeTeamData["runsScored"] += match["homeTeamRuns"]
            homeTeamData["oppositionRunsScored"] += match["awayTeamRuns"]

            awayTeamData["runsScored"] += match["awayTeamRuns"]
            awayTeamData["oppositionRunsScored"] += match["homeTeamRuns"]


            if match["awayTeamOvers"] != 0: ### Skip NRR --- awayTeamOvers can only be 0 at the start
                teamOvers = [match["awayTeamOvers"], match["homeTeamOvers"]]
                teamBalls = []

                for teamOver in teamOvers:
                    if '.' not in teamOver:
                        teamBalls.append(int(teamOver) * overBalls)
                    else:
                        over, balls = teamOver.split(".")
                        over = int(over)
                        balls = int(balls)

                        teamBalls.append(over * overBalls + balls)

                homeTeamData["ballsFaced"] += teamBalls[1]
                homeTeamData["oppositionBallsFaced"] += teamBalls[0]

                awayTeamData["ballsFaced"] += teamBalls[0]
                awayTeamData["oppositionBallsFaced"] += teamBalls[1]

    for team_key, team_data in team_dict.items():
        if team_data["runsScored"] != 0:
            f = (team_data["runsScored"] / (team_data["ballsFaced"] / overBalls))
            a = (team_data["oppositionRunsScored"] / (team_data["oppositionBallsFaced"] / overBalls))

            team_data["nrr"] = f - a
        else:
            team_data["nrr"] = 0

    points_table = sorted(list(team_dict.values()), key=lambda t: (t["points"], t["nrr"] if t["played"] > 0 else float("-inf")),
                              reverse=True)
    return points_table

@franchise_leagues_bp.route('/<leagueID>/teams', methods=['GET'])
def get_league_teams(leagueID):
    teams = teams_collection.find({"leagueID": leagueID}).sort("name")

    result = []

    for team in teams:
        result.append({
            "label": team["name"],
            "value": team["acronym"],
        })

    return result

@franchise_leagues_bp.route('/<leagueID>/venues', methods=['GET'])
def get_league_venues(leagueID):
    locations = matches_collection.distinct("Location", {"leagueID": leagueID})

    result = []

    for location in locations:
        result.append({
            "label": location,
            "value": location,
        })

    return result

@franchise_leagues_bp.route('/<leagueID>/match/<match_num>/<result>', methods=['PATCH'])
def update_league_match(leagueID, match_num, result):

    try:
        result = matches_collection.update_one(
            {"leagueID": leagueID, "MatchNumber": int(match_num)},
            {"$set": {"result": result}},
        )

        if result.matched_count == 0:
            raise ValueError("No match was found")

    except ValueError as e:
        return jsonify(str(e)), 404

    return jsonify({"message": f"{leagueID} match #{match_num} updated successfully"})

@franchise_leagues_bp.route('/<leagueID>/clear/<match_nums>', methods=['PATCH'])
def clear_league_results(leagueID, match_nums):
    try:
        match_num_strings = match_nums.split("-")
        match_numbers = list(map(int, match_num_strings))

        result = matches_collection.update_many(
            {"leagueID": leagueID,
             "MatchNumber": {"$in": match_numbers},
             "status": "incomplete"},
            {"$set": {
                "result": "None",
                "homeTeamRuns": 0,
                "awayTeamRuns": 0,
                "homeTeamWickets": 0,
                "awayTeamWickets": 0,
                "homeTeamOvers": 0,
                "awayTeamOvers": 0}},
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": f"{result.matched_count} matched - {result.modified_count} modified:"
                               f" {leagueID} matches cleared successfully"})

@franchise_leagues_bp.route('/<leagueID>/sim/<match_nums>', methods=['PATCH'])
def sim_league_matches(leagueID, match_nums):
    try:
        results = ["Home-win", "Away-win", "No-result"]
        probabilities = [0.475, 0.475, 0.05]

        match_num_strings = match_nums.split("-")
        match_numbers = list(map(int, match_num_strings))

        updates = []

        for match_num in match_numbers:
            random_result = random.choices(results, weights=probabilities, k=1)[0]

            updates.append(UpdateOne(
                {"leagueID": leagueID, "MatchNumber": match_num},
                {"$set": {"result": random_result}}
            ))

        result = matches_collection.bulk_write(updates)
        num_modified = result.modified_count
        num_matched = result.matched_count

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": f"{num_matched} matched - {num_modified} modified:"
                               f" {leagueID} matches simulated successfully"})

@franchise_leagues_bp.route('/<leagueID>/nrr/<match_num>/<home_runs>/<home_wickets>/<home_overs>/<away_runs>/<away_wickets>/<away_overs>', methods=['PATCH'])
def nrr_league_match(leagueID, match_num, home_runs, home_wickets, home_overs, away_runs, away_wickets, away_overs):
    try:
        result = matches_collection.update_one(
            {"leagueID": leagueID, "MatchNumber": int(match_num)},
            {"$set":
                        {"homeTeamRuns": int(home_runs),
                         "awayTeamRuns": int(away_runs),
                         "awayTeamWickets": int(away_wickets),
                         "homeTeamOvers": home_overs,
                         "awayTeamOvers": away_overs,
                         "homeTeamWickets": int(home_wickets)
                        }},
        )

        if result.matched_count == 0:
            raise ValueError("No match was found")

    except ValueError as e:
        return jsonify(str(e)), 404

    return jsonify({"message": f"{leagueID} match #{match_num} updated successfully"})
