import React from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';

const Home = () => {
  const router = useRouter();

  return (
    <div className="home-wrapper">
      <Navbar />

      <section className="intro-section">
        <h1>Welcome to CareerNext</h1>
        <p className="intro-subtext">
          Build a standout CV and discover your ideal career path with AI-powered guidance.
        </p>
      </section>

      <div className="cta-buttons">
        <button onClick={() => router.push('/signup')}>Get Started</button>
        <button onClick={() => router.push('/login')}>Login</button>
      </div>

      <section className="employers">
        <h2>Trusted by Top Employers</h2>
        <p>
          Thousands of professionals and leading companies trust CareerNext to build
          professional CVs and find the best talent.
        </p>
        <button onClick={() => router.push('/contact')}>Contact Sales</button>
      </section>
    </div>
  );
};

export default Home;
