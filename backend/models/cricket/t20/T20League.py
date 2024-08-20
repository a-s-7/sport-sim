from backend.models.cricket.MatchResult import MatchResult
from backend.models.cricket.t20.T20Team import T20Team
from backend.models.cricket.t20.T20Match import T20Match

class T20League():
    def __init__(self, name):
        self.name = name
        self.teamDict = {}
        self.matchList = []

    def get_points_table_json(self):
        teams = []

        for team in self.teamDict.values():
            teams.append(team.get_points_table_json())

        sorted_teams = sorted(teams, key=lambda t: (t["points"], t["nrr"] if t["played"] > 0 else float("-inf")),
                              reverse=True)

        return sorted_teams

    def get_teams_json(self):
        teams = []

        for team in self.teamDict.values():
            teams.append({"value": team.acronym, "label": team.name})

        return teams

    def update_match_nrr(self, match_num: int,
                         home_runs: int, home_wickets: int, home_overs: str,
                         away_runs: int, away_wickets: int, away_overs: str):

        # Find match
        match = self.matchList[int(match_num) - 1]

        if(match.homeTeamScore != None and match.awayTeamScore != None):
            ## Undo NRR addition for both teams
            match.homeTeam.undoMatchNRRDetails(match.homeTeamScore, match.awayTeamScore)
            match.awayTeam.undoMatchNRRDetails(match.awayTeamScore, match.homeTeamScore)

        # Update match team scores
        match.set_team_score("Home", home_runs, home_wickets, home_overs)
        match.set_team_score("Away", away_runs, away_wickets, away_overs)

        ## Update NRR for both teams
        match.homeTeam.addMatchNRRDetails(match.homeTeamScore, match.awayTeamScore)
        match.awayTeam.addMatchNRRDetails(match.awayTeamScore, match.homeTeamScore)


    def update_match(self, match_num: int, result: str):
        resultObj = None

        if str(result) == "Home-win":
            resultObj = MatchResult.HOME_WIN
        elif str(result) == "Away-win":
            resultObj = MatchResult.AWAY_WIN
        elif str(result) == "No-result":
            resultObj = MatchResult.NO_RESULT
        elif str(result) == "None":
            self.matchList[int(match_num) - 1].clear_match()
            return

        self.matchList[int(match_num) - 1].applyMatchResult(resultObj)

    def clear_incomplete_matches(self, team_acronyms: str):
        team_acs = team_acronyms.split("-")

        if len(team_acs) == 1 and team_acs[0] == "All":
            for match in self.matchList:
                if match.status == "incomplete":
                    match.clear_match()
        else:
            for match in self.matchList:
                if match.check_if_team_present(team_acs) and match.status == "incomplete":
                    match.clear_match()

    def simulate_matches(self, team_acronyms: str):
        team_acs = team_acronyms.split("-")

        if len(team_acs) == 1 and team_acs[0] == "All":
            for match in self.matchList:
                if match.status == "incomplete":
                    match.simulate_match()
        else:
            for match in self.matchList:
                if match.check_if_team_present(team_acs) and match.status == "incomplete":
                    match.simulate_match()


    def get_match_data_json(self, team_acronyms: str):
        ### TEAM DATA
        team_data = {}

        for team in self.teamDict.values():
            team_data.update({team.acronym: team.get_basic_json()})

        ## MATCH DATA

        team_acs = team_acronyms.split("-")

        match_data = []

        for match in self.matchList:
            if len(team_acs) == 1 and team_acs[0] == "All":
                match_data.append(match.getJSON())
            else:
                assert isinstance(match, T20Match), "Match should be an instance of T20Match"

                if match.check_if_team_present(team_acs):
                    match_data.append(match.getJSON())

        return [self.name, team_data, match_data]


    def clearAllMatchResults(self):
        for match in self.matchList:
            match.undoMatchResult()

    def checkIfAllMatchesComplete(self):
        for match in self.matchList:
            if match.matchResult == None:
                return False
        return True

    def getNumberOfTeams(self):
        return len(self.teamDict)

    def getNumberOfMatches(self):
        return len(self.matchList)

    def add_team(self, team: T20Team):
        # Ensure team is of type T20Team
        if not isinstance(team, T20Team):
            raise ValueError("Team must be of type T20Team")

        # Ensure team name is unique
        if any(tName == team.name for tName in self.teamDict.keys()):
            raise ValueError("Team already exists in the league")

        self.teamDict[team.name] = team

    def remove_team(self, teamName: str):
        # Ensure team exists in the league
        try:
            self.teamDict.pop(teamName)
            print(f"Team {teamName} removed successfully")
        except KeyError:
            raise KeyError("Team does not exist in the league")

    def get_Team(self, teamName: str):
        return self.teamDict[teamName]

    def add_match(self, match: T20Match):
        # Ensure match is of type T20Match
        if not isinstance(match, T20Match):
            raise ValueError("Match must be of type T20Match")

        # Ensure match number is unique
        if any(m.matchNumber == match.matchNumber for m in self.matchList):
            raise ValueError("Match already exists in the league")

        self.matchList.append(match)

    def remove_match(self, match_id: int):
        for m in self.matchList:
            if m.match_id == match_id:
                self.matchList.remove(m)
                return
        raise ValueError("Match does not exist in the league")

    ################ Print Methods ################

    def printTeamsList(self):
        print("Teams:")
        for index, team in enumerate(self.teamDict.values(), start=1):
            print(f"{index}. {team.name} - {team.acronym}")

    def printTeamMatchInformation(self):
        for team in self.teamDict.values():
            print(f"Team: {team.name}")
            print("{:<5}{:<20}{:<10}{:<30}{:<45}{:<10}".format("", "Match Number", "Role", "Opponent", "Venue", "Date"))

            for index, obj in enumerate(team.matchList, start=1):
                match = obj['match']
                role = obj['role']
                opponentTeam = match.homeTeam

                if role == "Home":
                    opponentTeam = match.awayTeam

                print("{:<5}{:<20}{:<10}{:<30}{:<45}{:<15}".format(index, match.matchNumber, role, opponentTeam.name,
                                                                   match.venue, match.date))

            print("")

    def print_schedule(self):
        print(f"{self.name} Schedule:")

        for match in self.matchList:
            print(
                "{:<15} {:<30} {:<30} {:<45} {:<15}".format(match.matchNumber, match.homeTeam.name, match.awayTeam.name,
                                                            match.venue, match.date))

    def print_points_table(self):
        print("Points Table for: " + self.name)
        print("{:<15} {:<10} {:<7} {:<7} {:<7} {:<12} {:<10} {:<7}".format("Position", "Team", "Played", "Won", "Lost",
                                                                           "No Result", "NRR", "Points"))

        sorted_teams = sorted(self.teamDict.values(), key=lambda t: ((t.won * 2 + t.noResult * 1), t.nrr, t.played),
                              reverse=True)

        for t in sorted_teams:
            index = sorted_teams.index(t) + 1
            print("{:<15} {:<10} {:<7} {:<7} {:<7} {:<12} {:<10.3f} {:<7.0f}".format(index, t.acronym, t.played, t.won,
                                                                                     t.lost, t.noResult, t.nrr,
                                                                                     (t.won * 2 + t.noResult * 1)))

