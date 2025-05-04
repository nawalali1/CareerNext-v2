import React from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';

const Home = () => {
  const router = useRouter();

  return (
    <div>
      <Navbar />
      <div className="home-wrapper">
        <section className="intro-section">
          <h1>Find Your Ideal Career Path</h1>
          <p className="intro-subtext">
            Whether you're a student, a recent graduate, or exploring a new direction—CareerNext helps you discover what’s next.
          </p>
        </section>

        <section className="user-pathways">
          <div className="card">
            <h2>🎓 Current Students</h2>
            <p>Discover careers that match your degree or take our personality-based quiz to find your path.</p>
            <button onClick={() => router.push('/questionnaire')}>Explore Pathways</button>
          </div>

          <div className="card">
            <h2>🧑‍🎓 Graduates</h2>
            <p>Use your existing qualifications and skills to explore real job matches and build a winning CV.</p>
            <button onClick={() => router.push('/cv')}>Build My CV</button>
          </div>

          <div className="card">
            <h2>🔄 Career Switchers</h2>
            <p>Leverage your transferable skills and get recommendations tailored to a new career path.</p>
            <button onClick={() => router.push('/questionnaire')}>Switch Careers</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
