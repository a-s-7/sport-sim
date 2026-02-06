import json
import os
from pymongo import MongoClient
from pymongo.errors import BulkWriteError, DuplicateKeyError
from datetime import datetime
from zoneinfo import ZoneInfo
from bson import ObjectId

if os.getenv("RENDER_STATUS") != "TRUE":
    from dotenv import load_dotenv
    load_dotenv()

connection_string = os.getenv('MONGODB_URI')

if not connection_string:
    raise ValueError("MONGODB_URI not found in environment variables")

client = MongoClient(connection_string)
db = client['events']

################################################################ (TOURNAMENTS COLLECTION)

# Load tournament info as JSON

event_folder = "t20-world-cup"
file_name = "t20-wc-2026.json"

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
file_path = os.path.join(base_dir, "sources", "events", event_folder, file_name)

with open(file_path, 'r') as file:
    json_info = json.load(file)


# Prepare tournament data for DB

tournament = json_info["tournament"]

zone = ZoneInfo("America/Los_Angeles")

tournament["startDate"] = datetime.fromisoformat(
    tournament["startDate"]
).replace(tzinfo=zone)

tournament["endDate"] = datetime.fromisoformat(
    tournament["endDate"]
).replace(tzinfo=zone)

# Add tournament to DB

tournaments_collection = db['tournaments']

try:
    result = tournaments_collection.insert_one(tournament)
    print(f"Tournament inserted with ID: {result.inserted_id}\n")
except DuplicateKeyError:
    print(f"Tournament with ID '{tournament['_id']}' already exists")

################################################################ (STAGES COLLECTION) 

stages = json_info["stages"]

stages_collection = db['stages']
stages_collection.create_index(
    [("tournamentId", 1), ("order", 1)],
    unique=True
)

DB_STAGE_ORDER_TO_ID = {}

try:
    result = stages_collection.insert_many(stages, ordered=True)
    print("Stages inserted with IDs:", result.inserted_ids, "\n")

    for i, stage in enumerate(stages):
        stage_order = stage["order"]
        object_id = result.inserted_ids[i]
        DB_STAGE_ORDER_TO_ID[stage_order] = object_id
            
except BulkWriteError as e:
    write_errors = e.details.get('writeErrors', [])
    
    first_error_index = write_errors[0]['index']

    print(f"Error: Stopped inserting stage entries at stage order {first_error_index + 1}")


################################################################ (STAGE TEAMS COLLECTION) 

stage_teams = json_info["stageTeams"]

stage_teams_collection = db['stageTeams']
stage_teams_collection.create_index(
    [("stageId", 1), ("teamId", 1)],
    unique=True
)

for s_team in stage_teams:
    s_team["stageId"] = DB_STAGE_ORDER_TO_ID[s_team["stageOrder"]]
    del s_team["stageOrder"]

try:
    result = stage_teams_collection.insert_many(stage_teams, ordered=True)
    print("Stage teams inserted with IDs:", result.inserted_ids, "\n")
except BulkWriteError as e:
    write_errors = e.details.get('writeErrors', [])
    
    first_error_index = write_errors[0]['index']

    print(f"Error: Stopped inserting stage teams at stage team index {first_error_index}")

################################################################ (MATCHES COLLECTION) 

matches = json_info["matches"]

matches_collection = db['matches']
matches_collection.create_index(
    [("stageId", 1), ("teamId", 1)],
    unique=True
)

for match in matches:
    match["stageId"] = DB_STAGE_ORDER_TO_ID[match["stageOrder"]]
    del match["stageOrder"]

try:
    result = matches_collection.insert_many(matches, ordered=True)
    print("Matches inserted with IDs:", result.inserted_ids, "\n")
except BulkWriteError as e:
    write_errors = e.details.get('writeErrors', [])
    
    first_error_index = write_errors[0]['index']

    print(f"Error: Stopped inserting matches at match index {first_error_index}")



    

    



