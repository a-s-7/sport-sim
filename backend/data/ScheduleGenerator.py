import json
import random


class ScheduleGenerator:

    @staticmethod
    def generate_round_robin_matches(team_names, matchOccurences: int):
        matches = []

        for i in range(len(team_names)):
            for j in range(i + 1, len(team_names)):
                for k in range(matchOccurences):
                    matches.append({"HomeTeam": team_names[i], "AwayTeam": team_names[j]})

        random.shuffle(matches)

        return matches

    @staticmethod
    def generate_cricket_json_schedule(matches):
        for index, match in enumerate(matches):
            match["MatchNumber"] = index + 1;
            match["DateUtc"] = ""
            match["Location"] = ""
            match["result"] = "None"
            match["status"] = "incomplete"
            match["homeTeamRuns"] = 0
            match["homeTeamWickets"] = 0
            match["homeTeamOvers"] = 0
            match["awayTeamRuns"] = 0
            match["awayTeamWickets"] = 0
            match["awayTeamOvers"] = 0

        return matches

    @staticmethod
    def print_schedule(matches):
        index = 1
        for match in matches:
            print(f"{index}) {match['HomeTeam']} vs {match['AwayTeam']}")
            index += 1

    @staticmethod
    def sort_schedule(fileName):
        matches = []

        with open(f"{fileName}.json", 'r') as file:
            matches = json.load(file)

        with open(f"{fileName}.json", 'w') as file:
            json.dump(sorted(matches, key=lambda m: m["MatchNumber"]), file, indent=4)

    @staticmethod
    def generate_round_robin_schedule_file(teams, fileName, matchOccurences: int):
        matches = ScheduleGenerator.generate_round_robin_matches(teams, matchOccurences)
        json_sc = ScheduleGenerator.generate_cricket_json_schedule(matches)

        with open(f"{fileName}.json", 'w') as file:
            json.dump(matches, file, indent=4)

    @staticmethod
    def generate_team_data_file(teams, fileName):
        team_list = []

        for team in teams:
            team_list.append({"team_name": team, "acronym": "", "logo": "", "gradient": ""})

        team_obj = {"teams": team_list}

        with open(f"{fileName}.json", 'w') as file:
            json.dump(team_obj, file, indent=4)


ilt20teams = ["Abu Dhabi Knight Riders", "Desert Vipers", "Dubai Capitals", "Gulf Giants", "MI Emirates",
              "Sharjah Warriors"]
sa20_teams = ["MI Cape Town", "Paarl Royals", "Pretoria Capitals", "Joburg Super Kings", "Sunrisers Eastern Cape", "Durban's Super Giants"]

ScheduleGenerator.generate_round_robin_schedule_file(sa20_teams, "sa20-2024-s", 2)
ScheduleGenerator.generate_team_data_file(sa20_teams, "sa20-2024-t")

# ScheduleGenerator.sort_schedule("ilt20-2024-s")
