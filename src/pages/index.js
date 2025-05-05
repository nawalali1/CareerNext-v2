// src/pages/index.js

import Link from "next/link";

export default function Home() {
  return (
    <div className="home-wrapper">
      <section className="intro-section">
        <h1>Welcome to CareerNext</h1>
        <p className="intro-subtext">
          Answer a few questions to find your ideal career path, then build
          your CV with AI assistance.
        </p>
      </section>
      <section className="user-pathways">
        <div className="card">
          <h2>🤔 Questionnaire</h2>
          <p>Tell us about your interests and strengths.</p>
          <Link href="/questionnaire">
            <button>Start Questionnaire</button>
          </Link>
        </div>
        <div className="card">
          <h2>📄 CV Builder</h2>
          <p>Use our AI coach to craft a standout CV.</p>
          <Link href="/CVBuilder">
            <button>Open CV Builder</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
