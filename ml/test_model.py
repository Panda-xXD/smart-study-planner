import joblib
import pandas as pd

# Load the trained model
model = joblib.load("models/efficiency_model.pkl")


# Create a sample student input
sample_student = pd.DataFrame(
    [[2, 5, 0, 12, 13]],
    columns=["studytime", "absences", "failures", "G1", "G2"]
)

# Predict learner type
prediction = model.predict(sample_student)

print("Predicted learner type:", prediction[0])
