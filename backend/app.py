import os
from flask import Flask, send_from_directory
from backend.app import main_blueprint
app = Flask(__name__, static_folder='../frontend/build')

# Register your blueprints
app.register_blueprint(main_blueprint)

# Serve React static files
@app.route('/')
@app.route('/<path:path>')
def serve_react_app(path=''):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)