import json

file_path = "cricket/league_data/ipl/ipl-2025-s.json"

with open(file_path, "r") as file:
    data = json.load(file)

fields_to_remove = ["RoundNumber", "Group", "HomeTeamScore", "AwayTeamScore"]

fields_to_add = {
    "result": "None",
    "status": "incomplete",
    "homeTeamRuns": 0,
    "homeTeamWickets": 0,
    "homeTeamOvers": "0",
    "awayTeamRuns": 0,
    "awayTeamWickets": 0,
    "awayTeamOvers": 0
}

for match in data:
    for field in fields_to_remove:
        match.pop(field, None)

    for field, value in fields_to_add.items():
        match.setdefault(field, value)

with open(file_path, "w") as file:
    json.dump(data, file, indent=4)