import { useState, useRef } from "react";
import axios from "axios";
import { FaMicrophone } from "react-icons/fa6";
import "./Transcription.css";
import Loader from "./Loader";
import ResultCard from "./ResultCard";

function Transcription() {
  const [audioFile, setAudioFile] = useState(null);
  const [language, setLanguage] = useState("english");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [fraudData, setFraudData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!audioFile) return alert("Please select an audio file!");

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      setLoading(true);
      const endpoint =
        language === "english" ? "/transcribe/english" : "/transcribe/hindi";
      const { data } = await axios.post(
        `http://127.0.0.1:5000${endpoint}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setTranscript(data.transcript);
      setFraudData({
        probability: data.fraud_probability,
        reason: data.reason,
      });
    } catch (err) {
      alert("Transcription failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transcription-container">
      {loading && <Loader />}

      {fraudData && (
        <ResultCard
          transcript={transcript}
          probability={fraudData.probability}
          reason={fraudData.reason}
          onClose={() => setFraudData(null)}
        />
      )}

      <div className="input-box">
        <h2>Suspicious Audio File Analysis</h2>
        <label>Select Language:</label>
        <FaMicrophone />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="select-input"
        >
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>

        <div onClick={() => fileInputRef.current.click()}>
          <button>ADD FILE</button>
        </div>

        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <button onClick={handleUpload} className="upload-btn">
          {loading ? "Transcribing..." : "Upload & Transcribe"}
        </button>
      </div>
    </div>
  );
}

export default Transcription;
