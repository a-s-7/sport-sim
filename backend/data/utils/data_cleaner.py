import json
import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
file_path = os.path.join(base_dir, "sources", "leagues", "ipl-2025.json")

if not os.path.exists(file_path):
    print(f"File not found: {file_path}")
else:
    with open(file_path, "r") as file:
        data = json.load(file)

    # Note: data might be a dict or a list depending on the JSON structure
    # In league files, matches are usually inside a 'matches' key
    matches = data.get("matches", data) if isinstance(data, dict) else data

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

    if isinstance(matches, list):
        for match in matches:
            for field in fields_to_remove:
                match.pop(field, None)

            for field, value in fields_to_add.items():
                match.setdefault(field, value)

        with open(file_path, "w") as file:
            json.dump(data, file, indent=4)
        print(f"Cleaned {file_path}")
    else:
        print("Data is not a list. Check the structure.")