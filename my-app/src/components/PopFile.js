import React from 'react';
import './PopFile.css';

const PopFile = ({ probability, reason, onClose }) => {
  const getColor = (probability) => {
    const red = Math.min(255, (probability / 100) * 255);
    const green = Math.min(255, ((100 - probability) / 100) * 255);
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className='pop-container'>
      <div className='pop' style={{ backgroundColor: getColor(probability) }}>
        <div>
          <h3>File Analysis</h3>
          <h4>Probability: {probability}%</h4>
        </div>
        {reason && <div className='reason-box'>Reason: {reason}</div>}

        {/* Close button */}
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PopFile;
