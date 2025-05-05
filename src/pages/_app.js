// src/pages/_app.js

import "../styles/App.css";
import "../styles/Home.css";
import "../styles/Questionnaire.css";
import "../styles/CVBuilder.css";
import "../styles/Results.css";
import "../styles/Signup.css";
import "../styles/LoadingScreen.css";
import "../styles/Login.css";
import "../styles/Navbar.css";
import "../styles/ChatPanel.css";

import Navbar from "../components/Navbar";
import PrivateRoute from "../components/PrivateRoute";

export default function App({ Component, pageProps, router }) {
  // Define which routes should be protected
  const protectedRoutes = ["/cvbuilder", "/results"];
  const isProtected = protectedRoutes.includes(router.pathname.toLowerCase());

  return (
    <>
      <Navbar />
      {isProtected ? (
        <PrivateRoute>
          <Component {...pageProps} />
        </PrivateRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
