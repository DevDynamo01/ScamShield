from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import joblib
import os
import json
from genai import gen_ai_json
import requests
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
cors_origin = os.getenv("CORS_ALLOWED_ORIGIN", "*") 
socketio = SocketIO(app, cors_allowed_origins=cors_origin)
CORS(app)

base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, 'model', 'model2.pkl')
vectorizer_path = os.path.join(base_dir, 'model', 'vectorizer2.pkl')
model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

store = {}

def transcribe_audio(audio_file, mimetype, language="en"):
    """Transcribe audio using Deepgram API"""
    url = f"https://api.deepgram.com/v1/listen?language={language}"
    headers = {
        "Authorization": f"Token {os.getenv('DEEPGRAM_API_KEY')}",
        "Content-Type": mimetype,
    }
    try:
        response = requests.post(url, data=audio_file.read(), headers=headers)
        response.raise_for_status()
        return response.json()["results"]["channels"][0]["alternatives"][0]["transcript"]
    except Exception as e:
        print(f"Transcription error: {str(e)}")
        raise

@app.route("/transcribe/<language>", methods=["POST"])
def transcribe(language):
    """Handle audio transcription requests"""
    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files["audio"]
        if not audio_file:
            return jsonify({"error": "Empty file"}), 400
            
        mimetype = audio_file.mimetype
        if language not in ["english", "hindi"]:
            return jsonify({"error": "Unsupported language"}), 400
            
        lang_code = "en" if language == "english" else "hi"
        transcript = transcribe_audio(audio_file, mimetype, lang_code)
        
        # Process transcript through fraud detection
        id = request.form.get('id', 'default')
        if id not in store:
            store[id] = [transcript]
        else:
            store[id].append(transcript)

        text = ' '.join(store[id])
        if len(store[id]) > 4:
            store[id].pop(0)

        # Run fraud detection
        input_transformed = vectorizer.transform([text]).toarray()
        probabilities = model.predict_proba(input_transformed)
        positive_prob = probabilities[0, 1] if probabilities.shape[1] > 1 else 0.5
        score = 100 - round(positive_prob * 100)

        if score > 50:
            result = gen_ai_json(text)
            if isinstance(result, str):
                result = json.loads(result)
            result["transcript"] = transcript
            return jsonify(result)

        return jsonify({
            "transcript": transcript,
            "fraud_probability": score
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Fraud Detection API!"})

@app.route('/predict', methods=['POST'])
def predict():
    """This endpoint handles regular HTTP POST requests for predictions."""
    data = request.json
    input_text = data.get('text')
    id = data.get('id')

    if not input_text:
        return jsonify({"error": "No input text provided"}), 400
    
    if id not in store:
        store[id] = [input_text]
    else:
        store[id].append(input_text)

    text = ' '.join(store[id])
    print("all text:", text)

    if len(store[id]) > 4:
        store[id].pop(0)

    input_transformed = vectorizer.transform([text]).toarray()

    probabilities = model.predict_proba(input_transformed)
    positive_prob = probabilities[0, 1] if probabilities.shape[1] > 1 else 0.5
    score = 100 - round(positive_prob * 100)

    if score > 50:
        result = gen_ai_json(text)
        result = json.loads(result)
        return jsonify(result)

    return jsonify({"fraud_probability": score})

@socketio.on('predict')
def handle_predict_event(data):
    """This handler responds to WebSocket messages for predictions."""
    input_text = data.get('text')
    id = data.get('id')

    print("Received text:", input_text)

    if not input_text:
        emit('error', {"error": "No input text provided"})
        return
    
    if id in store and store[id][-1].lower() in input_text.lower():
        print("deleted: ",store[id].pop())
    
    if id not in store:
        store[id] = [input_text]
    else:
        store[id].append(input_text)

    text = ', '.join(store[id])
    print("All text:", text)

    if len(store[id]) > 5:
        store[id].pop(0)

    input_transformed = vectorizer.transform([text]).toarray()

    probabilities = model.predict_proba(input_transformed)
    positive_prob = probabilities[0, 1] if probabilities.shape[1] > 1 else 0.5
    score = 100 - round(positive_prob * 100)

    if score > 50:
        result = gen_ai_json(text)
        emit('prediction', result)
    else:
        emit('prediction', {"fraud_probability": score})

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, allow_unsafe_werkzeug=True)
