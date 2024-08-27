import os
from flask import Flask, send_from_directory

from routes.wtc_routes import wtc_bp
from routes.t20_league_routes import t20_league_bp

app = Flask(__name__, static_folder='../frontend/build')

app.register_blueprint(wtc_bp)
app.register_blueprint(t20_league_bp)

@app.route('/')
@app.route('/<path:path>')
def serve_react_app(path=''):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)