import json

from backend.sports.cricket.test.WTCSeries import WTCSeries
from backend.sports.cricket.test.WTCTeam import WTCTeam


class WTC:
    def __init__(self, name: str, startYear: int, endYear: int):
        self.name = name
        self.startYear = startYear
        self.endYear = endYear

        self.teamDict = {}
        self.series = []

    def get_points_table_json(self):
        teams = []

        for team in self.teamDict.values():
            teams.append(team.get_points_table_json())

        sorted_teams = sorted(teams, key=lambda t: t["pointsPercentage"],
                              reverse=True)

        return sorted_teams

    def get_match_data_json(self):
        data = []
        for series in self.series:
            data.append(series.getJSON());

        return data

    def addTeam(self, team: WTCTeam):
        if not isinstance(team, WTCTeam):
            raise ValueError("Team must be of type WTCTeam")

        if any(tName == team.name for tName in self.teamDict.keys()):
            raise ValueError("Team already exists in the championship")

        self.teamDict[team.name] = team

    def remove_team(self, teamName: str):
        try:
            self.teamDict.pop(teamName)
            print(f"Team {teamName} removed successfully")
        except KeyError:
            raise KeyError("Team does not exist in the championship")

    def get_Team(self, teamName: str):
        return self.teamDict[teamName]


    def add_series(self, series: WTCSeries):
        if not isinstance(series, WTCSeries):
            raise ValueError("Series must be of type WTCSeries")

        for ss in self.series:
            if ss.id == series.id:
                raise ValueError("Series already exists in the championship")

        self.series.append(series)

    def getTotalNumberOfMatches(self):
        return sum([s.numMatches for s in self.series])

    ############################## Print methods ##############################

    def printTeamsList(self):
        print("Teams:")

        for index, team in enumerate(self.teamDict.values(), start=1):
            print(f"{index}. {team.name} - {team.acronym}")

    def printSeriesList(self):
        print("Series:")
        print("{:<5} {:<10} {:<20} {:<20} {:<15}".format("", "Name", "Home Team", "Away Team", "Match Count"))
        for index, series in enumerate(self.series, start=1):
            print("{:<5} {:<10} {:<20} {:<20} {:<15}".format(index, series.seriesName, series.homeTeam.name, series.awayTeam.name, series.numMatches))

    def printTeamsSeriesCounts(self):
        print("Teams Series Counts:")
        print("{:<5} {:<20} {:<15}".format("", "Team", "Series Count"))
        for index, team in enumerate(self.teamDict.values(), start=1):
            print("{:<5} {:<20} {:<15}".format(index, team.name, len(team.seriesList)))

    def printTeamsMatchCounts(self):
            print("Teams Match Counts:")
            print("{:<5} {:<20} {:<15}".format("", "Team", "Match Count"))
            for index, team in enumerate(self.teamDict.values(), start=1):
                print("{:<5} {:<20} {:<15}".format(index, team.name, team.numMatches))

    def printTeamSeriesInformation(self):
        print("")
        for team in self.teamDict.values():
               print(f"Team: {team.name}")
               print('-' * 35)
               print("{:<5} {:<20} {:<10}".format("", "Opponent", "Matches"))
               for index, series in enumerate(team.seriesList, start=1):
                   opponent = series.homeTeam
                   if opponent == team:
                         opponent = series.awayTeam
                   print("{:<5} {:<20} {:<10}".format(index, opponent.name, series.numMatches))
               print("")

    def print_points_table(self):
        print("Points Table for: " + self.name)
        print("{:<10} {:<15} {:<7} {:<7} {:<7} {:<7} {:<7} {:<7} {:<10}".format("Position", "Team", "Played", "Won", "Lost", "Draw", "Ded", "Points", "Points %"))

        sorted_teams = sorted(self.teamDict.values(), key=lambda t: t.get_points_percentage(),
                              reverse=True)

        for t in sorted_teams:
            index = sorted_teams.index(t) + 1
            print("{:<10} {:<15} {:<7} {:<7} {:<7} {:<7} {:<7} {:<7} {:<7.2f}".format(index, t.name, t.played, t.won, t.lost, t.draw, t.deduction, float(t.get_points()), float(t.get_points_percentage())))


