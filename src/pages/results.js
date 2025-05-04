
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Results.css';

export default function Results() {
  const { state } = useLocation();
  const { answers = [], userType = '' } = state || {};
  const navigate = useNavigate();

  // Generate career suggestions based on a key answer
  const suggestions = useMemo(() => {
    if (answers.length === 0) return [];

    const skillAnswer = answers[3]; // Q4: Which skill set best describes you?
    let list = [];

    switch (true) {
      case skillAnswer.includes('Technical'):
        list = [
          'Quantum Computing Researcher',
          'DevOps Reliability Engineer',
          'AI Ethicist',
          'Blockchain Solutions Architect'
        ];
        break;
      case skillAnswer.includes('Creative'):
        list = [
          'UX Researcher',
          '3D Animator',
          'Creative Technologist',
          'Voice Interface Designer'
        ];
        break;
      case skillAnswer.includes('Interpersonal'):
        list = [
          'Customer Success Manager',
          'Corporate Trainer',
          'Community Outreach Coordinator',
          'Employee Engagement Specialist'
        ];
        break;
      case skillAnswer.includes('Strategic'):
        list = [
          'Business Intelligence Analyst',
          'Corporate Strategy Consultant',
          'Product Manager',
          'Innovation Consultant'
        ];
        break;
      case skillAnswer.includes('Research'):
        list = [
          'Policy Analyst',
          'Data Visualization Specialist',
          'UX Researcher',
          'Academic Research Coordinator'
        ];
        break;
      default:
        list = [
          'Project Coordinator',
          'Operations Analyst',
          'Talent Acquisition Specialist',
          'Digital Transformation Lead'
        ];
    }

    return list;
  }, [answers]);

  return (
    <>
      <Navbar />
      <div className="results-container">
        <h2>Your Top Career Matches</h2>
        <div className="results-grid">
          {suggestions.map((title, idx) => (
            <div key={idx} className="career-card">
              <h3>{title}</h3>
              <p>
                A role that aligns with your skills in “{answers[3] || '—'}”
                and your preferences as a {userType || 'participant'}.
              </p>
              <div className="career-buttons">
                <button
                  onClick={() =>
                    navigate('/jobs', { state: { answers, userType } })
                  }
                >
                  View Live Jobs
                </button>
                <button onClick={() => navigate('/cvbuilder')}>
                  Build My CV
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
