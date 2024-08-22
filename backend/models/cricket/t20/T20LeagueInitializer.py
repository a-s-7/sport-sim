import json
from .T20Match import T20Match
from .T20Team import T20Team
from .T20League import T20League

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
    def populateTeams(league: T20League, teamPath: str):
        with open(teamPath, 'r') as file:
            data = json.load(file)

        for team in data["teams"]:
            t20Team = T20Team(team["team_name"], team["acronym"])

            t20Team.set_gradient(team["gradient"])
            t20Team.set_logo(team["logo"])

            league.add_team(t20Team)


    @staticmethod
    def populateMatches(league: T20League, matchPath: str):
        with open(matchPath, mode='r') as file:
            data = json.load(file)

            for m in data:
                mNum = m["MatchNumber"]

                hTeam = league.get_Team(m["HomeTeam"])
                aTeam = league.get_Team(m["AwayTeam"])

                match = T20Match(mNum, hTeam, aTeam)

                match.setMatchVenue(m["Location"])
                match.setMatchDateTime(m["DateUtc"])
                match.set_match_status(m["status"])
                match.set_match_result(m["result"])

                if m["status"] == "complete":
                    match.set_team_score("Home", m["homeTeamRuns"], m["homeTeamWickets"], m["homeTeamOvers"])
                    match.set_team_score("Away", m["awayTeamRuns"], m["awayTeamWickets"], m["awayTeamOvers"])
                    match.set_team_nrrs()

                league.add_match(match)
