import React, { useEffect, useState } from "react";


function Results() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with Gemini API call later
    setTimeout(() => {
      setCareers([
        "UX Designer",
        "Front-End Developer",
        "Product Manager",
        "Data Analyst",
        "Digital Marketing Strategist",
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="results-container">
      <h2>Your Career Recommendations</h2>
      {loading ? (
        <p>Generating results...</p>
      ) : (
        <ul className="career-list">
          {careers.map((career, idx) => (
            <li key={idx} className="career-item">
              {career}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Results;
