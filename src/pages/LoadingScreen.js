import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/results', {
        state: {
          answers: location.state?.answers,
          userType: location.state?.userType,
        },
      });
    }, 3000); // 3 seconds loading

    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    <>
      <Navbar />
      <div className="loading-container">
        <div className="loading-card">
          <div className="spinner"></div>
          <h2>Preparing your results...</h2>
          <p>We are analyzing your answers to match you with the best career paths!</p>
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
