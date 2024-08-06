from backend.sports.cricket.CricketTeam import CricketTeam


class WTCTeam(CricketTeam):

    def __init__(self, name, acronym):
        super().__init__(name, acronym)
        self.draw = 0
        self.tie = 0
        self.deduction = 0
        self.seriesList = []
        self.numMatches = 0
        self.flag = ""
        self.gradient = ""

    def get_points_table_json(self):
        return {
            "name": self.name,
            "played": self.played,
            "won": self.won,
            "lost": self.lost,
            "draw": self.draw,
            "deduction": self.deduction,
            "points": self.get_points(),
            "pointsPercentage": self.get_points_percentage(),
            "flag": self.flag
        }

    def setFlag(self, link: str):
        self.flag = link

    def get_flag(self):
        return self.flag

    def setGradient(self, gradient: str):
        self.gradient = gradient

    def get_gradient(self):
        return self.gradient

    def addSeries(self, series):
        self.seriesList.append(series)
        self.numMatches += series.numMatches

    def increment_draw(self):
        self.draw += 1

    def decrement_draw(self):
        if self.draw > 0:
            self.draw -= 1
        else:
            raise ValueError("Cannot decrement DRAW below 0")

    def increment_tie(self):
        self.tie += 1

    def decrement_tie(self):
        if self.tie > 0:
            self.tie -= 1
        else:
            raise ValueError("Cannot decrement TIE below 0")

    def increase_deduction(self, deduction: int):
        self.deduction += int(deduction)

    def decrease_deduction(self, deduction: int):
        if self.deduction - int(deduction) < 0:
            raise ValueError("Cannot remove DEDUCTION below 0")

        self.deduction -= int(deduction)

    def get_non_deducted_points(self):
        return (self.won * 12) + (self.tie * 6) + (self.draw * 4)

    def get_points(self):
        return self.get_non_deducted_points() - self.deduction

    def get_potential_points(self):
        return self.played * 12

    def get_points_percentage(self):
        a = self.get_points()
        b = self.get_potential_points()

        if (b == 0):
            return 0
        else:
            return float((a / b) * 100)
