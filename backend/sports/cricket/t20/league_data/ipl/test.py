import json

# Load the JSON data from the file
with open("ipl-2024-s.json", 'r') as file:
    data = json.load(file)

# Remove null fields and RoundNumber from each match object
cleaned_data = []
for match in data:
    cleaned_match = {k: v for k, v in match.items() if v is not None and k != 'RoundNumber'}
    cleaned_data.append(cleaned_match)

# Write the cleaned data back to the file
with open('backend/sports/cricket/t20/league_data/ipl/ipl-2024-s.json', 'w') as file:
    json.dump(cleaned_data, file, indent=2)