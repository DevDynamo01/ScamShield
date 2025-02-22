import React, { useState } from "react";
import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const AudioFraudDetection = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  // Handle audio file selection
  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  // Start speech recognition when audio is played
  const handlePlayAudio = () => {
    resetTranscript(); // Clear previous transcript
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };

  // Stop speech recognition when audio ends
  const handleAudioEnd = () => {
    SpeechRecognition.stopListening();
    setTranscribedText(transcript); // Save transcribed text
  };

  // Call fraud detection API
  const handleDetectFraud = async () => {
    if (!transcribedText) {
      alert("Please play the audio first to transcribe it.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        text: transcribedText,
        id: "123", // Example ID
      });
      setApiResponse(response.data);
    } catch (error) {
      console.error("Error during detection:", error);
      alert("Error processing audio. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Fraud Detection from Audio</h2>

      {/* Audio File Input */}
      <input type="file" accept="audio/*" onChange={handleFileChange} />

      {/* Audio Player */}
      {audioFile && (
        <audio controls onPlay={handlePlayAudio} onEnded={handleAudioEnd}>
          <source src={URL.createObjectURL(audioFile)} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Detect Fraud Button */}
      <button onClick={handleDetectFraud} style={styles.button}>
        {loading ? "Processing..." : "Detect Fraud"}
      </button>

      {/* Display Transcribed Text */}
      {transcribedText && (
        <div style={styles.resultBox}>
          <h3>Transcribed Text</h3>
          <p>{transcribedText}</p>
        </div>
      )}

      {/* Display API Response */}
      {apiResponse && (
        <div style={styles.resultBox}>
          <h3>Fraud Detection Result</h3>
          <p>
            <strong>Fraud Probability:</strong>{" "}
            {apiResponse.fraud_probability || "N/A"}
          </p>
          <p>
            <strong>Reason:</strong> {apiResponse.reason || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "600px",
    margin: "30px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    marginBottom: "20px",
    color: "#333",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  resultBox: {
    marginTop: "20px",
    padding: "15px",
    background: "#f9f9f9",
    borderRadius: "5px",
  },
};

export default AudioFraudDetection;
