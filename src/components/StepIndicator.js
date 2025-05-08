import React from 'react';
import PropTypes from 'prop-types';

export default function StepIndicator({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <div key={s.key} className={`step ${i === current ? 'active' : ''}`}>
          <div className="step-circle">{i + 1}</div>
          <div className="step-label">{s.title}</div>
        </div>
      ))}
    </div>
  );
}

StepIndicator.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      key:   PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  current: PropTypes.number.isRequired,
};
