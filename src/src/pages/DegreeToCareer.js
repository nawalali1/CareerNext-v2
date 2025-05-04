import React, { useState } from 'react';
import './DegreeToCareer.css';

const degreeCareerMap = {
  psychology: [
    "Clinical Psychologist",
    "HR Specialist",
    "User Researcher",
    "Social Worker",
    "Behavior Analyst"
  ],
  computer_science: [
    "Software Engineer",
    "Data Scientist",
    "Cybersecurity Analyst",
    "Web Developer",
    "AI Researcher"
  ],
  business: [
    "Business Analyst",
    "Marketing Manager",
    "Financial Analyst",
    "Project Manager",
    "Entrepreneur"
  ],
  law: [
    "Solicitor",
    "Legal Advisor",
    "Compliance Officer",
    "Policy Analyst",
    "Paralegal"
  ],
  english: [
    "Editor",
    "Content Strategist",
    "Teacher",
    "Communications Manager",
    "Copywriter"
  ]
};

function DegreeToCareer() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = input.toLowerCase().replace(/\s+/g, '_');
    const careers = degreeCareerMap[key];
    setResults(careers || []);
  };

  return (
    <div className="degree-container">
      <h2>What Can I Do With My Degree?</h2>
      <p>Enter your degree below to see potential career paths:</p>

      <form onSubmit={handleSubmit} className="degree-form">
        <input
          type="text"
          placeholder="e.g., Psychology, Business, Law"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Find Careers</button>
      </form>

      {results.length > 0 && (
        <div className="results-section">
          <h3>Career Suggestions:</h3>
          <ul>
            {results.map((career, index) => (
              <li key={index}>{career}</li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 && input && (
        <p className="no-results">No matches found. Try another degree.</p>
      )}
    </div>
  );
}

export default DegreeToCareer;
