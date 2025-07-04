import os
import random
from datetime import datetime

from flask import Blueprint, jsonify
from pymongo import MongoClient, UpdateOne

if os.getenv("RENDER_STATUS") != "TRUE":
    from dotenv import load_dotenv
    load_dotenv()

connection_string = os.getenv('MONGODB_URI')

# Connect with MongoDB
client = MongoClient(connection_string)
db = client['world_test_championship']

editions_collection = db['editions']
teams_collection = db['teams']
series_collection = db['series']
matches_collection = db['matches']

wtc_bp = Blueprint('wtc_bp', __name__)

@wtc_bp.route('/WTC/info', methods=['GET'])
def get_wtc_info():
    edition = editions_collection.find_one()

    wtc_info = {"id": edition["_id"],
                "name": edition["leagueName"],
                "year": edition["year"],
                "controlBarColor": edition["leagueControlBarColor"],
                "logo": edition["leagueLogo"],
                "pointsTableColor": edition["pointsTableColor"]}

    return wtc_info

@wtc_bp.route('/WTC/matches/<team_names>/<venue_names>', methods=['GET'])
def get_wtc_team_series_match_data(team_names, venue_names):

    # (1) GET TEAM DATA
    teamsData = {}

    teams = teams_collection.find({"year": 2025})

    for team in teams:
        teamsData[team["name"]] = {"gradient": team["gradient"], "flag": team["flag"]}

    # (2) GET SERIES DATA
    seriesData = {}

    series = series_collection.find()

    for s in series:
        seriesData[s["seriesId"]] = s["seriesName"]

    # (3) GET MATCH DATA
    matchData = []

    teams = team_names.split("-")
    venues = venue_names.split("#")

    team_all = len(teams) == 1 and teams[0] == "All"
    stadium_all = len(venues) == 1 and venues[0] == "All"

    if team_all and stadium_all:
        matchData = list(matches_collection.find({},{"_id": 0}).sort("startDate"))
    else:
        query = {}

        or_conditions = []

        if not team_all:
            or_conditions.append({"homeTeam": {"$in": teams}})
            or_conditions.append({"awayTeam": {"$in": teams}})

        if not stadium_all:
            or_conditions.append({"location": {"$in": venues}})

        query["$or"] = or_conditions

        matchData = list(matches_collection.find(query, {"_id": 0}).sort("startDate"))

    for match in matchData:
        suffixes = ["1st", "2nd", "3rd", "4th", "5th"]
        match["matchNumber"] = suffixes[match["matchNumber"] - 1] + " Test"

        d = datetime.strptime(match["startTime"], "%H:%M:%S")
        match["startTime"] = d.strftime("%-I:%M %p")

        sd = match["startDate"]
        ed = match["endDate"]

        month = sd.strftime("%b")
        date_range = ""

        if sd.month == ed.month:
            date_range = f"{month} {sd.day}-{ed.day}, {sd.year}"
        else:
            date_range = f"{sd.strftime('%b %d')}-{ed.strftime('%b %d')}, {ed.year}"

        match.pop("startDate")
        match.pop("endDate")
        match["dateRange"] = date_range

    return [teamsData, seriesData, matchData]

@wtc_bp.route('/WTC/points_table', methods=['GET'])
def get_wtc_points_table():
    # return wtc.get_points_table_json()
    teams = list(teams_collection.find({}, {"_id": 0, "acronym": 0, "gradient": 0, "editionID": 0, "year": 0}))

    for team in teams:
        team["points"] = 0
        team["pointsPercentage"] = 0
        team["played"] = 0
        team["won"] = 0
        team["lost"] = 0
        team["draw"] = 0
        team["deduction"] = 0
        team["previous5"] = [None, None, None, None, None]

    team_dict = {}

    for team in teams:
        team_dict[team["name"]] = team


    matches = list(matches_collection.find({"result": {"$ne": "None"}}, {"_id": 0, "location": 0, "year": 0, "startDate": 0,
                                                    "endDate": 0, "startTime":0, "seriesID": 0, "matchNumber":0}).sort({"startDate": 1}))

    for match in matches:
        awayTeamData = team_dict[match["awayTeam"]]
        homeTeamData = team_dict[match["homeTeam"]]

        awayTeamData["played"] += 1
        homeTeamData["played"] += 1

        if match["result"] == "Home-win":
            homeTeamData["won"] += 1
            homeTeamData["previous5"].pop()
            homeTeamData["previous5"].insert(0, "Win")
            homeTeamData["points"] += 12

            awayTeamData["lost"] += 1
            awayTeamData["previous5"].pop()
            awayTeamData["previous5"].insert(0, "Loss")
        elif match["result"] == "Away-win":
            awayTeamData["won"] += 1
            awayTeamData["previous5"].pop()
            awayTeamData["previous5"].insert(0, "Win")
            awayTeamData["points"] += 12

            homeTeamData["lost"] += 1
            homeTeamData["previous5"].pop()
            homeTeamData["previous5"].insert(0, "Loss")
        else:
            awayTeamData["draw"] += 1
            awayTeamData["points"] += 4
            awayTeamData["previous5"].pop()
            awayTeamData["previous5"].insert(0, "Draw")

            homeTeamData["draw"] += 1
            homeTeamData["points"] += 4
            homeTeamData["previous5"].pop()
            homeTeamData["previous5"].insert(0, "Draw")

        homeTeamData["deduction"] += match["homeDed"]
        awayTeamData["deduction"] += match["awayDed"]

    for team_key, team_data in team_dict.items():
        team_data["points"] -= team_data["deduction"]

        if team_data["played"] != 0:
            team_data["pointsPercentage"] = ((team_data["points"]) / (team_data["played"] * 12)) * 100

    points_table = sorted(list(team_dict.values()),
                          key=lambda t: (t["pointsPercentage"], t["played"]),
                          reverse=True)

    return points_table

@wtc_bp.route('/WTC/venues', methods=['GET'])
def get_wtc_locations():
    locations = matches_collection.distinct("location")

    result = []

    for location in locations:
        result.append({
            "label": location,
            "value": location,
        })

    return result

@wtc_bp.route('/WTC/teams', methods=['GET'])
def get_wtc_teams():
    teams = teams_collection.find().sort("name")

    result = []

    for team in teams:
        result.append({
            "label": team["name"],
            "value": team["acronym"],
        })

    return result

@wtc_bp.route('/WTC/match/<series_id>/<match_num>/<result>', methods=['PATCH'])
def update_wtc_match(series_id, match_num, result):
    try:
        result = matches_collection.update_one(
            {"seriesID": int(series_id), "matchNumber": int(match_num)},
            {"$set": {"result": result}},
        )

        if result.matched_count == 0:
            raise ValueError("No match was found")

    except ValueError as e:
        return jsonify(str(e)), 404

    return jsonify({"message": f"WTC match #{match_num} updated successfully"})

@wtc_bp.route('/WTC/deduction/<series_id>/<match_num>/<team>/<deduction>', methods=['PATCH'])
def update_wtc_match_deduction(series_id, match_num, team, deduction):
    try:
        field = "homeDed" if team == "home-team" else "awayDed"

        result = matches_collection.update_one(
            {"seriesID": int(series_id), "matchNumber": int(match_num)},
            {"$set": {field: int(deduction)}}
        )

        if result.matched_count == 0:
            raise ValueError("No match was modified")

    except ValueError as e:
        return jsonify(str(e)), 404

    return jsonify({"message": f"WTC series {series_id} - match #{match_num} deduction updated successfully"})

@wtc_bp.route('/WTC/sim/<match_nums>', methods=['PATCH'])
def simulate_wtc_matches(match_nums):
    try:
        sm = match_nums.split("-")

        results = ["Home-win", "Away-win", "Draw"]
        probabilities = [0.475, 0.475, 0.05]

        updates = []

        for ref in sm:
            s, m = ref.split(".")

            random_result = random.choices(results, weights=probabilities, k=1)[0]

            updates.append(UpdateOne(
                {"seriesID": int(s), "matchNumber": int(m), "status": "incomplete"},
                {"$set": {"result": random_result}}
            ))


        result = matches_collection.bulk_write(updates)
        num_modified = result.modified_count
        num_matched = result.matched_count

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": f"{num_matched} matched - {num_modified} simulated"})

@wtc_bp.route('/WTC/clear/<match_nums>', methods=['PATCH'])
def clear_wtc_matches(match_nums):
    try:
        sm = match_nums.split("-")

        updates = []

        for ref in sm:
            s, m = ref.split(".")

            updates.append(UpdateOne(
                {"seriesID": int(s), "matchNumber": int(m), "status": "incomplete"},
                {"$set": {"result": "None",
                                "homeDed": 0,
                                 "awayDed": 0,}}
            ))

        result = matches_collection.bulk_write(updates)
        num_modified = result.modified_count
        num_matched = result.matched_count

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": f"{num_matched} matched - {num_modified} cleared"})