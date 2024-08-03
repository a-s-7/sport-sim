import json

from backend.sports.cricket.test.WTC import WTC
from backend.sports.cricket.test.WTCSeries import WTCSeries
from backend.sports.cricket.test.WTCTeam import WTCTeam


class WTCInitializer:

    @staticmethod
    def initializeWTC(name: str, start: int, end: int, teamPath: str, seriesPath):
        wtc = WTC(name, start, end)
        WTCInitializer.populateTeams(wtc, teamPath)
        WTCInitializer.populateSeries(wtc, seriesPath)

        return wtc

    @staticmethod
    def populateTeams(wtc: WTC, teamsPath: str):
        with open(teamsPath, 'r') as file:
            data = json.load(file)

        for team in data["teams"]:
            wtcTeam = WTCTeam(team["team_name"], team["acronym"])
            wtcTeam.setGradient(team["gradient"])
            wtcTeam.setFlag(team["flag"])

            wtc.addTeam(wtcTeam)

    @staticmethod
    def populateSeries(wtc: WTC, seriesPath: str):
        with open(seriesPath, 'r') as file:
            data = json.load(file)

        for series in data["series"]:
            homeTeam = wtc.get_Team(series["homeTeam"])
            awayTeam = wtc.get_Team(series["awayTeam"])
            wtcSeries = WTCSeries(series["seriesName"], series["seriesId"], series["numMatches"], homeTeam, awayTeam)
            wtc.add_series(wtcSeries)
