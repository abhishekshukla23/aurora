import functions_framework
import joblib
import numpy as np
import os
from google.cloud import storage

# Name of the model file in GCS
MODEL_FILENAME = "exoplanet_detector_model.joblib"
# The default bucket is determined by the project's Cloud Storage configuration.
# Leaving this as None will use the default bucket.
BUCKET_NAME = os.environ.get("GCP_PROJECT") + ".appspot.com"
MODEL_PATH = f"/tmp/{MODEL_FILENAME}"

# Global variable to hold the model in memory
model = None

def download_model_from_gcs():
    """Downloads the model from GCS to a temporary local path."""
    if os.path.exists(MODEL_PATH):
        return
    storage_client = storage.Client()
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(MODEL_FILENAME)
    blob.download_to_filename(MODEL_PATH)

@functions_framework.http
def predictExoplanet(request):
    """HTTP Cloud Function to predict exoplanet status.
    Args:
        request (flask.Request): The request object.
        <http://flask.pocoo.org/docs/1.0/api/#flask.Request>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>.
    """
    # Set CORS headers for the preflight request
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)

    # Set CORS headers for the main request
    headers = {"Access-Control-Allow-Origin": "*"}

    global model
    # Load model if not already in memory
    if model is None:
        try:
            download_model_from_gcs()
            model = joblib.load(MODEL_PATH)
        except Exception as e:
            return (f"Error loading model: {str(e)}", 500, headers)

    # Get data from the request
    try:
        request_json = request.get_json(silent=True)
        if not request_json:
            return ("Invalid JSON", 400, headers)

        # The order of features must match the order the model was trained on
        feature_order = [
            'planetOrbitalPeriod', 'planetTransitDuration', 'planetTransitDepth',
            'planetRadius', 'stellarEffectiveTemperature', 'stellarRadius'
        ]

        features = [request_json[feature] for feature in feature_order]
        input_data = np.array(features).reshape(1, -1)

    except (ValueError, KeyError) as e:
        return (f"Invalid input data: {str(e)}", 400, headers)

    # Make prediction
    try:
        prediction_val = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]

        prediction_str = "Is an Exoplanet" if prediction_val == 1 else "Not an Exoplanet"
        confidence = probabilities[1] if prediction_val == 1 else probabilities[0]

        response_data = {
            "prediction": prediction_str,
            "confidence": f"{confidence * 100:.2f}%",
        }

        return (response_data, 200, headers)

    except Exception as e:
        return (f"Error during prediction: {str(e)}", 500, headers)
