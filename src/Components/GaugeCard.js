import React from 'react';
import './GaugeCard.css';

const GaugeCard = ({ percentage, label }) => {
  return (
    <div className="gauge-card">
      <div className="gauge">
        <svg viewBox="0 0 36 36">
          <path
            className="circle-bg"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="circle"
            strokeDasharray={`${percentage}, 100`}
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" className="percentage">{`${percentage}%`}</text>
        </svg>
      </div>
      <div className="label">{label}</div>
    </div>
  );
};

export default GaugeCard;