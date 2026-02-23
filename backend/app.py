from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)


# Load ML model
model = joblib.load("../ml/learner_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    df = pd.DataFrame([data])

    prediction = model.predict(df)[0]

    return jsonify({
        "learner_type": prediction
    })

if __name__ == "__main__":
    app.run(debug=True)
