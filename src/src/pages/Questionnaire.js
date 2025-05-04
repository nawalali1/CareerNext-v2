import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Questionnaire.css';

const questions = [
  {
    id: 1,
    text: 'Which activity energizes you most?',
    options: [
      'Solving complex logical puzzles',
      'Designing user experiences',
      'Analyzing large datasets',
      'Leading and motivating teams',
      'Crafting stories and content',
    ],
  },
  {
    id: 2,
    text: 'What impact do you want your work to have?',
    options: [
      'Drive technological innovation',
      'Improve everyday lives',
      'Shape business strategy',
      'Advance academic research',
      'Inspire and educate others',
    ],
  },
  {
    id: 3,
    text: 'How do you like to structure your day?',
    options: [
      'Highly flexible, set my own rhythm',
      'Structured with clear goals',
      'A blend of routine and spontaneity',
      'Team-focused collaborative sessions',
      'Deep-focus solo time',
    ],
  },
  {
    id: 4,
    text: 'Which skill set best describes you?',
    options: [
      'Technical & analytical (coding, math)',
      'Creative & design (visual, UX)',
      'Interpersonal & communication',
      'Strategic & management',
      'Research & critical thinking',
    ],
  },
  {
    id: 5,
    text: 'In your ideal job, what’s most important?',
    options: [
      'Rapid career advancement',
      'Work–life balance',
      'High earning potential',
      'Social good / sustainability',
      'Continuous learning',
    ],
  },
  {
    id: 6,
    text: 'Which industry excites you most?',
    options: [
      'AI & Robotics',
      'Healthcare & Biotech',
      'FinTech & Blockchain',
      'Creative Media & Entertainment',
      'Renewable Energy',
    ],
  },
  {
    id: 7,
    text: 'What is your desired salary range?',
    options: [
      'Under £30K',
      '£30K–£50K',
      '£50K–£70K',
      '£70K–£100K',
      'Over £100K',
    ],
  },
];

const Questionnaire = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [qIndex, setQIndex] = useState(0);

  useEffect(() => {
    if (location.state?.userType) {
      setUserType(location.state.userType);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const selectOption = (opt) => {
    const updated = [...answers];
    updated[qIndex] = opt;
    setAnswers(updated);
  };

  const next = () => {
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      navigate('/loading', { state: { answers, userType } });
    }
  };

  const back = () => qIndex > 0 && setQIndex(qIndex - 1);

  const currentAnswer = answers[qIndex];

  return (
    <>
      <Navbar />
      <div className="questionnaire-wrapper">
        <div className="questionnaire-card">
          <h2>
            Deep Dive Quiz
            {userType && ` for ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
          </h2>
          <div className="progress">
            {qIndex + 1} / {questions.length}
          </div>
          <div className="question">{questions[qIndex].text}</div>

          <div className="options">
            {questions[qIndex].options.map((opt) => (
              <div
                key={opt}
                className={`option ${currentAnswer === opt ? 'selected' : ''}`}
                onClick={() => selectOption(opt)}
              >
                <label>{opt}</label>
              </div>
            ))}
          </div>

          <div className="navigation-buttons">
            <button onClick={back} disabled={qIndex === 0}>
              Back
            </button>
            <button onClick={next} disabled={!currentAnswer}>
              {qIndex === questions.length - 1 ? 'See Results' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Questionnaire;
