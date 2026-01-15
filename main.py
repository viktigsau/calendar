import flask
import helpers

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

if __name__ == "__main__":
    app.run(debug=True)