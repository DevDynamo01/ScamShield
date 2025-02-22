import "./ResultCard.css";

const ResultCard = ({ transcript, probability, reason, onClose }) => {
  // Function to determine fraud risk color
  const getFraudColor = (probability) => {
    if (probability < 20) return "#3DA114"; // Green (Low Risk)
    if (probability < 50) return "#FFD700"; // Yellow (Medium Risk)
    if (probability < 80) return "#FF8C00"; // Orange (High Risk)
    return "#FF4D4D"; // Red (Very High Risk)
  };

  return (
    <div className="result-card">
      <button className="close-btn" onClick={onClose}>
        ×
      </button>

      <h3>Transcription Result</h3>
      <textarea
        readOnly
        value={transcript}
        className="transcript-box"
      ></textarea>

      <div
        className="fraud-section"
        style={{ backgroundColor: getFraudColor(probability) }}
      >
        <p>
          <strong>Fraud Probability:</strong> {probability}%
        </p>
        {reason && (
          <p>
            <strong>Reason:</strong> {reason}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
