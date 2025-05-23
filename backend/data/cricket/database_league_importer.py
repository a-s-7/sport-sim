import json
import os
from pymongo import MongoClient

# NOTES:
# abb must match league folder name in league_data and the file format ("abb-year-t.json", "abb-year-s.json")
league_abb = "bbl"
league_year = "2024"

if os.getenv("RENDER_STATUS") != "TRUE":
    from dotenv import load_dotenv
    load_dotenv()

connection_string = os.getenv('MONGODB_URI')

client = MongoClient(connection_string)
db = client['franchise_leagues']

data = league_abb + "-" + league_year + '.json'
file_path = os.path.join(os.getcwd(), "league_data", data)

with open(file_path, 'r') as file:
    json_info = json.load(file)

########### ADD LEAGUE DOCUMENT (LEAGUE COLLECTION) ###########

leagues_collection = db['leagues']

fields_omitted = ["teams", "matches"]

league_collection = {}

for key in json_info:
    if key not in fields_omitted:
        league_collection[key] = json_info[key]

result = leagues_collection.insert_one(league_collection)

print(f"ID: {result.inserted_id}")

########### ADD TEAM DOCUMENTS (TEAMS COLLECTION) ###########

teams_collection = db['teams']

teams = json_info["teams"]

for team in teams:
     team["leagueID"] = json_info["_id"]
     team["year"] = json_info["year"]

result = teams_collection.insert_many(teams)

print(f"# Teams Inserted: {len(result.inserted_ids)}")

########### ADD MATCH DOCUMENTS (MATCHES COLLECTION) ###########

matches_collection = db['matches']

matches = json_info["matches"]

for match in matches:
    match["leagueID"] = json_info["_id"]
    match["year"] = json_info["year"]

result = matches_collection.insert_many(matches)

print(f"# Matches Inserted: {len(result.inserted_ids)}")

client.close()