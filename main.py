# Copyright (C) 2026 viktig_sau
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

import flask
import helpers

# open config
config = helpers.load_conf()
HOST: str = config["host"]
PORT: int = config["port"]
DEBUG: bool = config["debug"]

if DEBUG:
    print(f"Starting server on {HOST}:{PORT} (debug mode)")

app = flask.Flask(__name__)

@app.route("/")
def index():
    return flask.render_template("index.html")

@app.route("/api/celender/<calendar_id>/new", methods=['POST'])
def new_calendar_item(calendar_id: str):
    try:
        data = helpers.StrictDict(flask.request.json, type_map={
            "title":str,
            "description":(str, None),
            "start":str,
            "end":str,
            "color":(str, None),
        })
    except TypeError:
        return flask.jsonify({"status":"error", "error":"invalid data"}), 400

    return flask.jsonify(data), 501

if __name__ == "__main__" and DEBUG:
    app.run(host=HOST, port=PORT, debug=True)