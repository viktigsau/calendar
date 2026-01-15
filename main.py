import flask
import helpers

app = flask.Flask(__name__)

@app.route("/")
def index():
    return flask.render_template("index.html")

@app.route("/api/celender/<calender_id>/new", methods=['POST'])
def new_calendar_item(calendar_id: str):
    data = flask.request.json



if __name__ == "__main__":
    app.run(debug=True)