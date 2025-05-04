import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

import './firebase';
import './App.css';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Questionnaire from './pages/Questionnaire';
import LoadingScreen from './pages/LoadingScreen';
import Results from './pages/Results';
import Jobs from './pages/Jobs';
import CVBuilder from './pages/CVBuilder';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import DegreeToCareer from './pages/DegreeToCareer';
import Students from './pages/Students';

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar user={user} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/degree-to-career" element={<DegreeToCareer />} />
          <Route path="/students" element={<Students />} />

          {/* Private Routes */}
          <Route
            path="/questionnaire"
            element={<PrivateRoute user={user} element={<Questionnaire />} />}
          />
          <Route
            path="/results"
            element={<PrivateRoute user={user} element={<Results />} />}
          />
          <Route
            path="/cvbuilder"
            element={<PrivateRoute user={user} element={<CVBuilder />} />}
          />

          {/* Settings (public for now) */}
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
