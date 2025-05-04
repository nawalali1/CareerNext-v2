import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <span className="icon">⟶</span>
        <span>CareerNext</span>
      </div>
      <ul className="nav-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === '/jobs' ? 'active' : ''}>
          <Link to="/jobs">Live Jobs</Link>
        </li>
        <li className={location.pathname === '/cvbuilder' ? 'active' : ''}>
          <Link to="/cvbuilder">CV Builder</Link>
        </li>
        {currentUser && (
          <li className={location.pathname === '/settings' ? 'active' : ''}>
            <Link to="/settings">Settings</Link>
          </li>
        )}
        {currentUser ? (
          <li>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        ) : (
          <li className={location.pathname === '/login' ? 'active' : ''}>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
