// src/pages/_app.js

// Import your global & page-specific styles
import "../styles/App.css";
import "../styles/Home.css";
import "../styles/Questionnaire.css";
import "../styles/CVBuilder.css";
import "../styles/Results.css";
import "../styles/Signup.css";
import "../styles/LoadingScreen.css";
import "../styles/Login.css";
import "../styles/Navbar.css";

import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}
