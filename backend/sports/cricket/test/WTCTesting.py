from backend.sports.cricket.test.WTCInitializer import WTCInitializer

teamsPath = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/test/wtc_data/wtc-teams.json"
seriesPath = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/test/wtc_data/wtc-series.json"

# Initialize the WTC object
wtc = WTCInitializer.initializeWTC("ICC World Test Championship", 2023, 2025, teamsPath, seriesPath)
print("DONE")