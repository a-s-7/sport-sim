from T20Match import T20Match
from T20Team import T20Team
from T20League import T20League

import csv

class T20LeagueInitializer:

    @staticmethod
    def initializeLeague(name, teamPath: str, schedulePath: str):
        league = T20League(name)
        T20LeagueInitializer.populateLeague(league, teamPath, schedulePath)

        return league

    @staticmethod
    def populateLeague(league: T20League, teamPath: str, schedulePath: str):
        T20LeagueInitializer.populateTeams(league, teamPath)
        T20LeagueInitializer.populateMatches(league, schedulePath)

    @staticmethod
    def populateTeams(league: T20League, path: str):
        with open(path, mode='r') as file:
            csv_reader = csv.DictReader(file)

            for row in csv_reader:
                team = T20Team(row['team_name'], row['acronym'])
                team.set_logo(row['logo'])
                league.add_team(team)

    @staticmethod
    def populateMatches(league: T20League, path: str):
        with open(path, mode='r') as file:
            csv_reader = csv.DictReader(file)

            for row in csv_reader:
                mNum = row['match_number']

                hTeam = league.get_Team(row['home_team'])
                aTeam = league.get_Team(row['away_team'])

                match = T20Match(mNum, hTeam, aTeam)

                match.setMatchLocation(row['location'])
                match.setMatchDate(row['date'])
                match.setMatchType(row['type'])

                league.add_match(match)
