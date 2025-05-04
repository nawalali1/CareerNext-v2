// src/pages/_app.js
import '@/styles/Results.css';
import '@/styles/Home.css';
import '@/styles/Login.css';
import '@/styles/Signup.css';
import '@/styles/Questionnaire.css';
import '@/styles/CVBuilder.css';
import '@/styles/Navbar.css';
import '@/styles/LoadingScreen.css';

import React from 'react';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
