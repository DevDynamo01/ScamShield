import { useState, useRef } from "react";
import axios from "axios";
import { FaFileAudio } from "react-icons/fa";
import './Transcription.css'
import Loader from "./Loader";
import { FaMicrophone } from "react-icons/fa";
function Transcription() {
  const [audioFile, setAudioFile] = useState(null);
  const [language, setLanguage] = useState("english");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.log("we obtained: ",{data})
      setTranscript(data.transcript);
    } catch (err) {
      alert("Transcription failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transcription-container">
      {loading && <Loader></Loader>}
      <div className="input-box">
        <h2>🎧 Audio to Text Converter</h2>
        <label>Select Language:</label>
        <FaMicrophone></FaMicrophone>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="select-input">
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>

        <div onClick={() => fileInputRef.current.click()}>
          <button>
            <svg
              aria-hidden="true"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-width="2"
                stroke="#fffffff"
                d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                stroke-linejoin="round"
                stroke-linecap="round"></path>
              <path
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2"
                stroke="#fffffff"
                d="M17 15V18M17 21V18M17 18H14M17 18H20"></path>
            </svg>
            ADD FILE
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Upload Button */}
        <button onClick={handleUpload} className="upload-btn">
          {loading ? "Transcribing..." : "Upload & Transcribe"}
        </button>
      </div>

      {/* Transcript Output */}
      <div className="output-box">
        {transcript && (
          <div>
            <h4>Transcript:</h4>
            <p>{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transcription;
