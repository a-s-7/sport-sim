import random
from datetime import datetime, timedelta

from backend.sports.cricket.CricketFormat import CricketFormat
from backend.sports.cricket.t20.T20Team import T20Team
from backend.sports.cricket.CricketInningsScore import CricketInningsScore
from backend.sports.cricket.MatchResult import MatchResult

class T20Match():
    # matchNumber is the UNIQUE identifier for the match
    def __init__(self, matchNumber: int, homeTeam: T20Team, awayTeam: T20Team):
        # Match Details
        self.matchNumber = matchNumber
        self.type = None
        self.status = None

        # Match Geographical + Temporal Details
        self.venue = None
        self.datetime = None

        self.type = None
        self.homeTeam = homeTeam
        self.awayTeam = awayTeam
        
        self.homeTeamScore = None
        self.awayTeamScore = None
        self.matchResult = None
        
        self.addMatchToTeams()

    def set_team_score(self, team: str, runs: int, overs: str):
        over = 0
        balls = 0

        if '.' not in overs:
            over = overs
            balls = 0
        else:
            over, balls = overs.split(".")

        if(team == "Home"):
            self.homeTeamScore = CricketInningsScore(runs, int(over), int(balls), CricketFormat.T20)
        else:
            self.awayTeamScore = CricketInningsScore(runs, int(over), int(balls), CricketFormat.T20)

    def simulate_match(self):
        rand_decimal = random.uniform(0, 1)

        if 0 <= rand_decimal <= 0.475:
            self.applyMatchResult(MatchResult.HOME_WIN)
        elif 0.475 < rand_decimal <= 0.95:
            self.applyMatchResult(MatchResult.AWAY_WIN)
        else:
            self.applyMatchResult(MatchResult.NO_RESULT)

    def set_match_status(self, status: str):
        self.status = status

    def set_match_result(self, result: str):
        if result == "Home-win":
            self.applyMatchResult(MatchResult.HOME_WIN)
        elif result == "Away-win":
            self.applyMatchResult(MatchResult.AWAY_WIN)
        elif result == "No-result":
            self.applyMatchResult(MatchResult.DRAW)
        elif result == "None":
            self.matchResult = MatchResult.NONE
        else:
            raise ValueError()

    def getJSON(self):
        return {
            "homeTeam": self.homeTeam.acronym,
            "awayTeam": self.awayTeam.acronym,
            "matchNumber": self.matchNumber,
            "location": self.venue,
            "date": self.get_english_date(),
            "startTime": self.get_start_time(),
            "status": self.status,
            "result": self.matchResult.value
        }

    def get_english_date(self):
        return self.date.strftime("%b %-d") + ", " + self.date.strftime("%Y")

    def get_start_time(self):
        return (self.date - timedelta(hours=7)).strftime("%-I:%M %p")

    def check_if_team_present(self, teamNames: []):
        if self.homeTeam.acronym in teamNames or self.awayTeam.acronym in teamNames:
            return True
        return False

    def clear_match(self):
        self.undoMatchResult()
        self.homeTeamScore = None
        self.awayTeamScore = None

    def addMatchToTeams(self):
        self.homeTeam.addMatch(self, "Home")
        self.awayTeam.addMatch(self, "Away")
        
    def setMatchVenue(self, venue: str):
        self.venue = venue
        
    def setMatchDateTime(self, date: str):
        self.date = datetime.strptime(date, "%Y-%m-%d %H:%M:%S%z")
        
    def setMatchType(self, matchType: str):
        self.type = matchType
        
    def getMatchNumber(self):
        return self.matchNumber
    
    def getHomeTeamScore(self):
        return self.homeTeamScore

    def getAwayTeamScore(self):
        return self.awayTeamScore
    
    def getMatchResult(self):
        return self.matchResult
    
        
    def simulateMatch(self, homeTeamScore: CricketInningsScore, awayTeamScore: CricketInningsScore, resultComplete: bool):
        if(resultComplete):
            self.homeTeamScore = homeTeamScore
            self.awayTeamScore = awayTeamScore
            
            self.homeTeam.addMatchNRRDetails(homeTeamScore, awayTeamScore)      
            self.awayTeam.addMatchNRRDetails(awayTeamScore, homeTeamScore)  
            
            if(homeTeamScore.getRuns() > awayTeamScore.getRuns()):
                self.applyMatchResult(MatchResult.HOME_WIN)
            else:
                self.applyMatchResult(MatchResult.AWAY_WIN)
        else:
            self.applyMatchResult(MatchResult.NO_RESULT)


    def checkMatchResult(self, matchResult: MatchResult):
        possibleResults = [MatchResult.HOME_WIN, MatchResult.AWAY_WIN, MatchResult.NO_RESULT]

        if matchResult not in possibleResults:
            raise ValueError("Invalid match result")


    def undoMatchResult(self):
        if self.matchResult == MatchResult.NONE:
            return

        self.homeTeam.decrement_played()
        self.awayTeam.decrement_played()

        if self.matchResult == MatchResult.HOME_WIN:
            self.homeTeam.decrement_won()
            self.awayTeam.decrement_loss()
        elif self.matchResult == MatchResult.AWAY_WIN:
            self.homeTeam.decrement_loss()
            self.awayTeam.decrement_won()
        else:
            self.homeTeam.decrement_noResult()
            self.awayTeam.decrement_noResult()

        self.matchResult = MatchResult.NONE

    def applyMatchResult(self, matchResult: MatchResult):
        self.checkMatchResult(matchResult)
        self.undoMatchResult()

        self.matchResult = matchResult

        self.homeTeam.increment_played()
        self.awayTeam.increment_played()

        if matchResult == matchResult.HOME_WIN:
            self.homeTeam.increment_won()
            self.awayTeam.increment_loss()
        elif matchResult == matchResult.AWAY_WIN:
            self.homeTeam.increment_loss()
            self.awayTeam.increment_won()
        else:
            self.homeTeam.increment_noResult()
            self.awayTeam.increment_noResult()
