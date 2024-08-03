from T20Team import T20Team
from backend.sports.cricket.CricketInningsScore import CricketInningsScore
from backend.sports.cricket.MatchResult import MatchResult

class T20Match():
    # matchNumber is the UNIQUE identifier for the match
    def __init__(self, matchNumber: int, homeTeam: T20Team, awayTeam: T20Team):
        self.matchNumber = matchNumber
        self.location = None
        self.date = None
        self.type = None
        self.homeTeam = homeTeam
        self.awayTeam = awayTeam
        
        self.homeTeamScore = None
        self.awayTeamScore = None
        self.matchResult = None
        
        self.addMatchToTeams()
    
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

    def applyMatchResult(self, matchResult: MatchResult):
        if matchResult != MatchResult.HOME_WIN and matchResult != MatchResult.AWAY_WIN and matchResult != MatchResult.NO_RESULT:
            raise ValueError("Invalid match result")

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
            else:
                self.homeTeam.increment_noResult()
                self.awayTeam.increment_noResult()
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
        else:
            self.homeTeam.decrement_noResult()
            self.awayTeam.decrement_noResult()

        self.matchResult = None
