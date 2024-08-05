from datetime import datetime

from backend.sports.cricket.MatchResult import MatchResult
from backend.sports.cricket.test.WTCTeam import WTCTeam


class WTCMatch:
    def __init__(self, matchNumber: int, homeTeam: WTCTeam, awayTeam: WTCTeam):
        # Match Details
        self.matchNumber = matchNumber
        self.type = None

        # Match Geographical + Temporal Details
        self.venue = None
        self.startDate = None
        self.endDate = None
        self.startTime = None

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

    def check_dates_added(self):
        if(self.startDate == None and self.endDate == None):
            return False
        else:
            return True


    def getJSON(self):
        location = self.venue if self.venue is not None else "TBA"
        dateRange = self.get_english_date() if self.check_dates_added() else "TBA"
        startTime = self.get_12_hour_time() if self.startTime is not None else "TBA"

        return {
            "matchNumber": self.get_ordinal_number(),
            "location": location,
            "dateRange": dateRange,
            "startTime": startTime,
            "result": self.matchResult.value if self.matchResult is not None else "None",
        }

    def get_ordinal_number(self):
        suffixes = ["1st", "2nd", "3rd", "4th", "5th"]

        return suffixes[self.matchNumber - 1] + " Test"

    def get_english_date(self):
        start_month = self.startDate.strftime("%B")
        end_month = self.endDate.strftime("%B")

        start_day = self.startDate.strftime("%d")
        end_day = self.endDate.strftime("%d")

        year = self.startDate.strftime("%Y") ## ASSUMING TEST MATCHES ARE PLAYED IN THE SAME YEAR

        if(start_month == end_month):
            return start_month + " " + start_day + "-" + end_day + ", " + year
        else:
            return start_month + " " + start_day + "-" + end_month + " " + end_day + ", " + year

    def get_12_hour_time(self):
        return self.startTime.strftime("%I:%M %p")

    ################################################### GETTERS

    def getMatchNumber(self):
        return self.matchNumber

    def get_match_venue(self):
        return self.venue

    def get_start_date(self):
        return self.startDate

    def get_end_date(self):
        return self.endDate

    def get_start_time(self):
        return self.startTime

    def get_match_type(self):
        return self.type

    def get_home_team(self):
        return self.homeTeam

    def get_away_team(self):
        return self.awayTeam

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

    ################################################### SETTERS

    def set_match_info(self, venue: str, startDate: str, endDate: str, start_time: str):
        self.set_match_venue(venue)
        self.set_start_date(startDate)
        self.set_end_date(endDate)
        self.set_start_time(start_time)

    def set_match_venue(self, location: str):
        self.venue = location

    def set_start_date(self, s_date: str):
        self.startDate = datetime.strptime(s_date, "%Y-%m-%d")

    def set_end_date(self, e_date: str):
        self.endDate = datetime.strptime(e_date, "%Y-%m-%d")

    def set_start_time(self, start_time: str):
        self.startTime = datetime.strptime(start_time, "%H:%M:%S")

    def setMatchType(self, matchType: str):
        self.type = matchType

    ## TODO: Add remaining setters


    ################################################### OTHER METHODS

    def addMatchToTeams(self):
        self.homeTeam.addMatch(self, "Home")
        self.awayTeam.addMatch(self, "Away")


    def applyMatchResult(self, matchResult: MatchResult):
        self.checkMatchResult(matchResult)

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
