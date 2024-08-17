from backend.sports.cricket.CricketTeam import CricketTeam
from backend.sports.cricket.CricketInningsScore import CricketInningsScore

class T20Team(CricketTeam):
    def __init__(self, name, acronym):
        super().__init__(name, acronym)
        self.logo = None
        self.gradient = None
        self.noResult = 0

        self.runsScored = 0
        self.ballsFaced = 0.0
        self.oppositionRunsScored = 0
        self.oppositionBallsFaced = 0.0
        self.nrr = 0.0


    def reset_nrr(self):
        self.nrr = 0.0
        self.runsScored = 0
        self.ballsFaced = 0.0
        self.oppositionRunsScored = 0
        self.oppositionBallsFaced = 0.0

    def get_basic_json(self):
        return {
            "logo": self.logo,
            "gradient": self.gradient
        }

    def get_previous_5_matches(self):
        results = []

        for i in range(self.played, self.played - 5, -1):
            if i <= 0:
                break

            # {'match': match, 'role': role}
            m = self.matchList[i - 1]
            match =  m["match"]
            status = match.check_team_winner(m['role'])
            results.append(status)

        if len(results) < 5:
            for i in range(5 - len(results)):
                results.append(None)

        return results

    def get_points_table_json(self):
        return {
            "acronym": self.acronym,
            "played": self.played,
            "won": self.won,
            "runsScored": self.runsScored,
            "ballsFaced": self.ballsFaced,
            "oppositionRunsScored": self.oppositionRunsScored,
            "oppositionBallsFaced": self.oppositionBallsFaced,
            "lost": self.lost,
            "noResult": self.noResult,
            "nrr": self.nrr,
            "points": self.get_point_total(),
            "logo": self.logo,
            "previous5": self.get_previous_5_matches()
        }

    def get_point_total(self):
        return (self.won * 2 + self.noResult * 1)

    def set_logo(self, logoData: str):
        self.logo = logoData

    def set_gradient(self, gradientData: str):
        self.gradient = gradientData

    def addMatchNRRDetails(self, selfScore: CricketInningsScore, opponentScore: CricketInningsScore):
        self.runsScored += selfScore.getRuns()
        self.ballsFaced += selfScore.getTotalBalls()
        self.oppositionRunsScored += opponentScore.getRuns()
        self.oppositionBallsFaced += opponentScore.getTotalBalls()

        self.calculateNRR()

    def undoMatchNRRDetails(self, selfScore: CricketInningsScore, opponentScore: CricketInningsScore):
        self.runsScored -= selfScore.getRuns()
        self.ballsFaced -= selfScore.getTotalBalls()
        self.oppositionRunsScored -= opponentScore.getRuns()
        self.oppositionBallsFaced -= opponentScore.getTotalBalls()

        self.calculateNRR()

    def calculateNRR(self):
        if(self.ballsFaced == 0 or self.oppositionBallsFaced == 0):
            self.nrr = 0.0
            return

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
