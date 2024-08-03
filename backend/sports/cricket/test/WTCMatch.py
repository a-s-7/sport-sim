from backend.sports.cricket.MatchResult import MatchResult
from backend.sports.cricket.test.WTCTeam import WTCTeam


class WTCMatch:
    def __init__(self, matchNumber: int, homeTeam: WTCTeam, awayTeam: WTCTeam):
        # Match Details
        self.matchNumber = matchNumber
        self.location = None
        self.startDate = None
        self.startTime = None
        self.type = None

        # Match Teams
        self.homeTeam = homeTeam
        self.awayTeam = awayTeam

        # Match Score
        self.homeTeamFirstInningsScore = None
        self.homeTeamSecondInningsScore = None
        self.awayTeamFirstInningsScore = None
        self.awayTeamSecondInningsScore = None

        self.matchResult = None

        self.addMatchToTeams()

    def set_start_time(self, start_time: str):
        self.startTime = start_time

    def get_start_time(self):
        return self.startTime

    def getJSON(self):
        return {
            "matchNumber": self.matchNumber,
            "location": self.location,
            "startDate": self.startDate,
        }

    def addMatchToTeams(self):
        self.homeTeam.addMatch(self, "Home")
        self.awayTeam.addMatch(self, "Away")

    def setMatchLocation(self, location: str):
        self.location = location

    def setMatchDate(self, date: str):
        self.date = date

    def setMatchType(self, matchType: str):
        self.type = matchType

    def getMatchNumber(self):
        return self.matchNumber

    def getHomeTeamFirstInningsScore(self):
        return self.homeTeamFirstInningsScore

    def getHomeTeamSecondInningsScore(self):
        return self.homeTeamSecondInningsScore

    def getAwayTeamFirstInningsScore(self):
        return self.awayTeamFirstInningsScore

    def getAwayTeamSecondInningsScore(self):
        return self.awayTeamSecondInningsScore

    def getMatchResult(self):
        return self.matchResult

    def applyMatchResult(self, matchResult: MatchResult):
        self.checkMatchResult()

        if self.matchResult == None:
            self.matchResult = matchResult

            self.homeTeam.increment_played()
            self.awayTeam.increment_played()

            if matchResult == matchResult.HOME_WIN:
                self.homeTeam.increment_won()
                self.awayTeam.increment_loss()
            elif matchResult == matchResult.AWAY_WIN:
                self.homeTeam.increment_loss()
                self.awayTeam.increment_won()
            elif matchResult == matchResult.DRAW:
                self.homeTeam.increment_draw()
                self.awayTeam.increment_draw()
            else:
                self.homeTeam.increment_tie()
                self.awayTeam.increment_tie()
        else:
            self.undoMatchResult()
            self.applyMatchResult(matchResult)

    def undoMatchResult(self):
        self.homeTeam.decrement_played()
        self.awayTeam.decrement_played()

        if self.matchResult == MatchResult.HOME_WIN:
            self.homeTeam.decrement_won()
            self.awayTeam.decrement_loss()
        elif self.matchResult == MatchResult.AWAY_WIN:
            self.homeTeam.decrement_loss()
            self.awayTeam.decrement_won()
        elif self.matchResult == MatchResult.DRAW:
            self.homeTeam.decrement_draw()
            self.awayTeam.decrement_draw()
        else:
            self.homeTeam.decrement_tie()
            self.awayTeam.decrement_tie()

        self.matchResult = None

    def checkMatchResult(self, matchResult: MatchResult):
        possibleResults = [MatchResult.HOME_WIN, MatchResult.AWAY_WIN, MatchResult.DRAW, MatchResult.TIE]

        if matchResult not in possibleResults:
            raise ValueError("Invalid match result")
