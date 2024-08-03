from enum import Enum


class MatchResult(Enum):
    HOME_WIN = "Win"
    AWAY_WIN = "Loss"
    NO_RESULT = "No Result"
    DRAW = "Draw"
    TIE = "Tie"
