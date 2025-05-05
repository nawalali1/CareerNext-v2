import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="hero-card">
          <h1>Find Your Path Forward</h1>
          <p>For students, graduates, and professionals seeking clarity in the job market.</p>
          <div className="hero-buttons">
            <Link href="/questionnaire" legacyBehavior>
              <button className="btn-primary">Get Started</button>
            </Link>
            <Link href="/cvbuilder" legacyBehavior>
              <button className="btn-secondary">Build Your CV</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
