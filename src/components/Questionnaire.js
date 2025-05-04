import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';

const questions = [
  {
    id: 1,
    question: 'What kind of work environment do you prefer?',
    options: ['Team-based', 'Independent', 'Remote', 'Fast-paced office'],
  },
  {
    id: 2,
    question: 'Which task appeals to you most?',
    options: ['Solving complex problems', 'Designing user experiences', 'Analyzing data', 'Building a business'],
  },
  {
    id: 3,
    question: 'What motivates you in a career?',
    options: ['High income', 'Creativity', 'Making impact', 'Job stability'],
  },
  {
    id: 4,
    question: 'How do you prefer to make decisions?',
    options: ['Data-driven', 'Intuition', 'Peer feedback', 'Experimentation'],
  },
  {
    id: 5,
    question: 'What is your field of study or interest?',
    options: ['Computer Science', 'Business', 'Design', 'Science/Research'],
  },
  {
    id: 6,
    question: 'What work-life balance do you value most?',
    options: ['Strict 9-5', 'Flexible hours', 'Always learning', 'Entrepreneur lifestyle'],
  },
];

export default function Questionnaire() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const choose = (option) => {
    const newAnswers = [...answers];
    newAnswers[current] = option;
    setAnswers(newAnswers);

    if (current === questions.length - 1) {
      submit(newAnswers);
    } else {
      setCurrent(current + 1);
    }
  };

  const submit = async (finalAnswers) => {
    setLoading(true);
    setError('');
    console.log('Submitting answers:', finalAnswers);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { recommendations } = await res.json();
      console.log('Received recommendations:', recommendations);

      // Navigate to results page, passing both answers and recs
      router.push({
        pathname: '/results',
        query: {
          recs: encodeURIComponent(JSON.stringify(recommendations)),
        },
      });
    } catch (e) {
      console.error('Recommendation error:', e);
      setError('Sorry, we couldn’t generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const q = questions[current];

  return (
    <div className="questionnaire-container">
      <Navbar />

      {loading ? (
        <p className="loading">Analyzing your answers…</p>
      ) : (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <h2>{q.question}</h2>
          <div className="options">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => choose(opt)}>
                {opt}
              </button>
            ))}
          </div>

          <p>
            Question {current + 1} of {questions.length}
          </p>
        </>
      )}
    </div>
  );
}
