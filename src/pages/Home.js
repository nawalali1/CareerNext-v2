import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStart = (userType) => {
    navigate('/questionnaire', { state: { userType } });
  };

  return (
    <div className="hero-wrapper">
      <div className="hero-overlay">
        <div className="hero-center">
          <h1 className="hero-title">Find Your Path Forward</h1>
          <p className="hero-subtext">
            For students, graduates, and professionals seeking clarity in the job market.
          </p>

          <div className="hero-buttons">
            <button onClick={() => handleStart('student')}>I'm a Student</button>
            <button onClick={() => handleStart('graduate')}>I'm a Graduate</button>
            <button onClick={() => handleStart('jobseeker')}>
              Job Seeker / Career Changer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
