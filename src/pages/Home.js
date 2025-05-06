import React from "react";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();

  return (
    <div className="home-background">
      <div className="home-overlay" />

      <div className="home-centered-card">
        <div className="home-card animate-fade-in">
          <h1 className="home-heading">CareerNext</h1>
          <p className="home-subtext">
            Discover personalized career paths based on your strengths.
            <br />
            Built for Students, Recent Graduates, and Career Switchers.
          </p>

          <div className="home-buttons">
            <button onClick={() => router.push("/questionnaire")}>Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
