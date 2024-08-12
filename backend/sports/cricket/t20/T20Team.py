from backend.sports.cricket.CricketTeam import CricketTeam
from backend.sports.cricket.CricketInningsScore import CricketInningsScore

class T20Team(CricketTeam):
    def __init__(self, name, acronym):
        super().__init__(name, acronym)
        self.logo = None
        self.noResult = 0

        self.runsScored = 0
        self.ballsFaced = 0.0
        self.oppositionRunsScored = 0
        self.oppositionBallsFaced = 0.0

        self.nrr = 0.0

    def set_logo(self, logoData: str):
        self.logo = logoData

    def addMatchNRRDetails(self, selfScore: CricketInningsScore, opponentScore: CricketInningsScore):
        self.runsScored += selfScore.getRuns()
        self.ballsFaced += selfScore.getTotalBalls()
        self.oppositionRunsScored += opponentScore.getRuns()
        self.oppositionBallsFaced += opponentScore.getTotalBalls()

        self.calculateNRR()

    def calculateNRR(self):  
        nrrFor = self.runsScored/(self.ballsFaced/6)
        nrrAgainst = self.oppositionRunsScored/((self.oppositionBallsFaced/6))
        
        self.nrr = nrrFor - nrrAgainst
    
    def getSelfNRR(self):
        return self.nrr

    ## noResult ---------------------
    def increment_noResult(self):
        self.noResult += 1

    def decrement_noResult(self):
        if self.noResult > 0:
            self.noResult -= 1
        else:
            raise ValueError("Cannot decrement noResult below 0")
