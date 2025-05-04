import React from 'react';
import { Link } from 'react-router-dom';
import './Students.css';

function Students() {
  return (
    <div className="students-page">
      <h2>Current Students</h2>
      <p className="intro-text">
        Whether you're in your first year or approaching graduation, CareerNext can help you explore paths aligned with your degree and strengths.
      </p>

      <div className="students-options">
        <div className="option-card">
          <h3>📘 What Can I Do With My Degree?</h3>
          <p>Discover career paths that align with your academic background.</p>
          <Link to="/degree-to-career">
            <button>Explore Careers by Degree</button>
          </Link>
        </div>

        <div className="option-card">
          <h3>🧠 Take the Career Quiz</h3>
          <p>Answer a few quick questions to find your ideal career match based on your interests.</p>
          <Link to="/questionnaire">
            <button>Start Quiz</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Students;
