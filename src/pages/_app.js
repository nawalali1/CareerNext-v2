// pages/_app.js

import React, { useEffect } from "react";
import Head from "next/head";

import "../styles/globals.css";
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
import "../styles/ForgotPassword.css";
import "../styles/Settings.css";
import "../styles/Degree.css";
import "../styles/Jobs.css";
import "../styles/Sidebar.css";
import "../styles/degreeToCareer.css";

import "react-quill/dist/quill.snow.css";

import Navbar from "../components/Navbar";
import ChatPanel from "../components/ChatPanel";
import PrivateRoute from "../components/PrivateRoute";
import ErrorBoundary from "../components/ErrorBoundary";

const protectedRoutes = ["/cvbuilder", "/results"];
const chatRoutes      = ["/cvbuilder"];

export default function App({ Component, pageProps, router }) {
  const path = router.pathname.toLowerCase();
  const isProtected   = protectedRoutes.includes(path);
  const showChatPanel = chatRoutes.includes(path);

  //theme on first render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("theme") || "light";
      document.documentElement.setAttribute("data-theme", t);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Head>
        <title>CareerNext</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="AI-powered career discovery and CV builder for students, graduates, and career switchers."
        />
        <meta charSet="UTF-8" />
      </Head>

      <Navbar />
      {showChatPanel && <ChatPanel />}

      {isProtected ? (
        <PrivateRoute>
          <Component {...pageProps} />
        </PrivateRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </ErrorBoundary>
  );
}
