import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';

export default function Results() {
  const router = useRouter();
  const { recs } = router.query;
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('Loading recommendations…');

  useEffect(() => {
    if (!recs) return;

    try {
      const parsed = JSON.parse(decodeURIComponent(recs));
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid format');
      }
      setRecommendations(parsed);
      setError('');
    } catch (e) {
      console.error('Results parse error:', e);
      setError('Failed to load recommendations.');
    }
  }, [recs]);

  return (
    <div className="results-container">
      <Navbar />

      <h2>Your AI-Powered Career Recommendations</h2>

      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {recommendations.map((r, i) => (
            <li key={i}>
              <strong>{r.title}</strong>: {r.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
