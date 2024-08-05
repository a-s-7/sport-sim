from flask import Flask, jsonify
from flask_cors import CORS

from backend.sports.cricket.test.WTCInitializer import WTCInitializer
from backend.sports.cricket.test.WTC import WTC

app = Flask(__name__)
CORS(app)

wtc = None

def initialize_global_object():
    global wtc
    teamsPath = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/test/wtc_data/wtc-teams.json"
    seriesPath = "/Users/ayushsaldhi/Desktop/Projects/sport-sim/backend/sports/cricket/test/wtc_data/wtc-series.json"

    # Initialize the WTC object
    wtc = WTCInitializer.initializeWTC("ICC World Test Championship", 2023, 2025, teamsPath, seriesPath)


@app.route('/WTC/matches', methods=['GET'])
def get_data():
    if(wtc == None):
        return jsonify({"error": "WTC object not initialized"}), 500

    assert isinstance(wtc, WTC), "wtc should be an instance of WTC"

    return wtc.get_match_data_json()


@app.route('/WTC/points_table', methods=['GET'])
def get_points_table():
    if(wtc == None):
        return jsonify({"error": "WTC object not initialized"}), 500

    assert isinstance(wtc, WTC), "wtc should be an instance of WTC"

    return wtc.get_points_table_json()


@app.route('/WTC/match/<series_id>/<match_num>/<result>', methods=['PATCH'])
def update_wtc_match(series_id, match_num, result):
    if(wtc == None):
        return jsonify({"error": "WTC object not initialized"}), 500

    assert isinstance(wtc, WTC), "wtc should be an instance of WTC"

    try:
        wtc.update_match(series_id, match_num, result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"message": "Match updated successfully"})

if __name__ == '__main__':
    initialize_global_object()
    app.run(debug=True)
