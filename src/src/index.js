// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './Responsive.css'; // Full responsive overrides
import App from './App';

// Initialize Firebase (auth, analytics, etc.)
import './firebase';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
