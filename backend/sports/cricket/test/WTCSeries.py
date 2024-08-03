from backend.sports.cricket.test.WTCMatch import WTCMatch
from backend.sports.cricket.test.WTCTeam import WTCTeam


class WTCSeries:
    def __init__(self, name: str, id: int, numMatches: int, homeTeam: WTCTeam, awayTeam: WTCTeam):
        self.id = id
        self.seriesName = name
        self.numMatches = numMatches

        self.homeTeam = homeTeam
        self.awayTeam = awayTeam

        self.addSeriesToTeams()
        self.matches = []
        self.populateMatches()

    def getJSON(self):
        seriesJSON = {
            "id": self.id,
            "seriesName": self.seriesName,
            "homeTeam": self.homeTeam.name,
            "homeGradient": self.homeTeam.get_gradient(),
            "homeFlag": self.homeTeam.get_flag(),
            "awayTeam": self.awayTeam.name,
            "awayGradient": self.awayTeam.get_gradient(),
            "awayFlag": self.awayTeam.get_flag(),
            "numMatches": self.numMatches,
            "matches": [m.getJSON() for m in self.matches]
        }

        return seriesJSON

    def addSeriesToTeams(self):
        self.homeTeam.addSeries(self)
        self.awayTeam.addSeries(self)

    def populateMatches(self):
        for i in range(1, self.numMatches+1):
            self.addMatch(WTCMatch(i, self.homeTeam, self.awayTeam))

    def addMatch(self, match: WTCMatch):
        if(len(self.matches) >= self.numMatches):
            raise ValueError("Cannot add more matches to the series")
        self.matches.append(match)

    def getMatch(self, matchNumber: int):
        return self.matches[matchNumber-1]

    def get_matches(self):
        return self.matches