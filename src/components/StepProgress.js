// src/components/StepProgress.js
import React from 'react';
import PropTypes from 'prop-types';

export default function StepProgress({ steps, current, onSelect }) {
  return (
    <div className="step-progress">
      {steps.map((label, i) => (
        <div
          key={i}
          className={`step-item ${
            i === current ? 'active' : i < current ? 'completed' : ''
          }`}
          onClick={() => onSelect(i)}
        >
          <div className="step-bullet">{i + 1}</div>
          <div className="step-label">{label}</div>
          {i < steps.length - 1 && <div className="step-connector" />}
        </div>
      ))}
    </div>
  );
}

StepProgress.propTypes = {
  steps:    PropTypes.arrayOf(PropTypes.string).isRequired,
  current:  PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};
