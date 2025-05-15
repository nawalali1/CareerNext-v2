// components/Home.js
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { AiOutlineSearch, AiOutlineDown } from "react-icons/ai";
import { FiBarChart2 } from "react-icons/fi";
import {
  FaRegFileAlt,
  FaUserGraduate,
  FaBriefcase,
  FaCheckCircle,
} from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  // Testimonials state
  const testimonials = [
    {
      name: "Alice Johnson",
      role: "Recent Graduate",
      quote: "CareerNext helped me land my first role in under a month!",
    },
    {
      name: "Mark Thompson",
      role: "Career Switcher",
      quote: "The quiz matched me to UX design perfectly.",
    },
    {
      name: "Sara Lee",
      role: "Student",
      quote: "I loved the instant CV builder—it’s a game changer.",
    },
  ];
  const [testiIndex, setTestiIndex] = useState(0);
  const nextTestimonial = () =>
    setTestiIndex((testiIndex + 1) % testimonials.length);
  const prevTestimonial = () =>
    setTestiIndex((testiIndex - 1 + testimonials.length) % testimonials.length);

  // Search form state
  const [jobQuery, setJobQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [isCountLoading, setIsCountLoading] = useState(false);

  const suggestionTimer = useRef(null);
  const countTimer = useRef(null);

  // Modal state for footer links
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  // Autocomplete suggestions (debounced)
  useEffect(() => {
    clearTimeout(suggestionTimer.current);
    if (jobQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setIsSuggestionsLoading(true);
    suggestionTimer.current = setTimeout(() => {
      fetch(`/api/jobs/suggestions?query=${encodeURIComponent(jobQuery)}`)
        .then((r) => r.json())
        .then((data) => setSuggestions(data.suggestions || []))
        .catch(() => setSuggestions([]))
        .finally(() => setIsSuggestionsLoading(false));
    }, 300);
    return () => clearTimeout(suggestionTimer.current);
  }, [jobQuery]);

  // Live job count (debounced)
  useEffect(() => {
    clearTimeout(countTimer.current);
    if (jobQuery.trim().length < 2) {
      setCount(0);
      return;
    }
    setIsCountLoading(true);
    countTimer.current = setTimeout(() => {
      fetch(
        `/api/jobs/count?title=${encodeURIComponent(
          jobQuery
        )}&location=${encodeURIComponent(locationQuery)}`
      )
        .then((r) => r.json())
        .then((data) => setCount(data.count || 0))
        .catch(() => setCount(0))
        .finally(() => setIsCountLoading(false));
    }, 500);
    return () => clearTimeout(countTimer.current);
  }, [jobQuery, locationQuery]);

  const handleSuggestionClick = (s) => {
    setJobQuery(s);
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!jobQuery.trim()) return;
    router.push({
      pathname: "/jobs",
      query: {
        degree: jobQuery.trim(),
        location: locationQuery.trim(),
      },
    });
  };

  return (
    <>
      {/* HERO */}
      <div className="hero-background">
        <div className="hero-overlay" />
        <div className="hero-wrapper">
          <div className="hero-card">
            <h1 className="hero-heading">Find Your Career Path</h1>
            <p className="hero-subtext">
              Discover roles that fit your strengths
            </p>

            {/* Search Form */}
            <form className="hero-search-form" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search a job.."
                  value={jobQuery}
                  onChange={(e) => setJobQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        className="suggestion-item"
                        onMouseDown={() => handleSuggestionClick(s)}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search a location..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                />
              </div>
              <button type="submit" className="search-btn">
                Search jobs
              </button>
            </form>

            {!isCountLoading && count > 0 && (
              <p className="job-count">
                We’ve found {count.toLocaleString()} roles matching “
                {jobQuery.trim()}” in “
                {locationQuery.trim() || "anywhere"}”.
              </p>
            )}
            {isCountLoading && (
              <p className="job-count">Loading job count…</p>
            )}

            {/* Original CTAs */}
            <div className="hero-ctas">
              <button
                className="primary-btn"
                onClick={() => router.push("/questionnaire")}
              >
                Explore Careers
              </button>
              <button
                className="secondary-btn"
                onClick={() => router.push("/degree")}
              >
                Map Your Degree
              </button>
            </div>
          </div>

          {/* ↓ Scroll indicator */}
          <div
            className="scroll-indicator"
            onClick={() =>
              document
                .getElementById("how-it-works")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            <AiOutlineDown />
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="how-it-works">
        <div className="how-step">
          <AiOutlineSearch size={32} className="how-icon" />
          <h3>Quick Quiz</h3>
          <p>Answer 5 simple questions</p>
        </div>
        <div className="how-step">
          <FiBarChart2 size={32} className="how-icon" />
          <h3>Get Matches</h3>
          <p>AI-driven career suggestions</p>
        </div>
        <div className="how-step">
          <FaRegFileAlt size={32} className="how-icon" />
          <h3>Build Your CV</h3>
          <p>Download as PDF or DOCX</p>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="feature-highlights">
        <div className="feature-card">
          <FaCheckCircle size={32} className="feature-icon" />
          <h4>Personalized Paths</h4>
          <p>Get career paths tailored to you.</p>
        </div>
        <div className="feature-card">
          <FaRegFileAlt size={32} className="feature-icon" />
          <h4>Live Job Board</h4>
          <p>Browse up-to-date job listings.</p>
        </div>
        <div className="feature-card">
          <FaUserGraduate size={32} className="feature-icon" />
          <h4>One-click CV</h4>
          <p>Easily generate and download your CV.</p>
        </div>
        <div className="feature-card">
          <FaBriefcase size={32} className="feature-icon" />
          <h4>Employer Dashboard</h4>
          <p>Employers can review and contact you.</p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-card">
          <p className="quote">“{testimonials[testiIndex].quote}”</p>
          <p className="user">
            <strong>{testimonials[testiIndex].name}</strong>,{" "}
            {testimonials[testiIndex].role}
          </p>
        </div>
        <div className="testimonial-controls">
          <button onClick={prevTestimonial} aria-label="Previous">
            ‹
          </button>
          <button onClick={nextTestimonial} aria-label="Next">
            ›
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-links">
          <button className="footer-link" onClick={() => setShowAbout(true)}>
            About
          </button>
          <button className="footer-link" onClick={() => setShowContact(true)}>
            Contact
          </button>
          <button className="footer-link" onClick={() => setShowPolicy(true)}>
            Privacy & Terms
          </button>
        </div>
        <div className="social-icons">
          <a href="https://linkedin.com" aria-label="LinkedIn">
            LinkedIn
          </a>
          <a href="https://twitter.com" aria-label="Twitter">
            Twitter
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} CareerNext. All rights reserved.</p>
      </footer>

      {/* ─── MODALS ─── */}
      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>About CareerNext</h2>
              <button className="modal-close" onClick={() => setShowAbout(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>
                <strong>CareerNext</strong> is a platform dedicated to helping
                students, graduates, and career switchers find their ideal job
                paths. Founded in 2021, our mission is to combine AI-driven
                quizzes, a live job board, and one-click CV generation to
                streamline your job search.
              </p>
            </div>
          </div>
        </div>
      )}

      {showContact && (
        <div className="modal-overlay" onClick={() => setShowContact(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Us</h2>
              <button className="modal-close" onClick={() => setShowContact(false)}>×</button>
            </div>
            <div className="modal-body">
              <form className="contact-form">
                <label>Name</label>
                <input type="text" placeholder="Your Name" />
                <label>Email</label>
                <input type="email" placeholder="you@example.com" />
                <label>Message</label>
                <textarea rows="4" placeholder="How can we help you?" />
                <button type="submit">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {showPolicy && (
        <div className="modal-overlay" onClick={() => setShowPolicy(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Privacy Policy & Terms of Service</h2>
              <button className="modal-close" onClick={() => setShowPolicy(false)}>×</button>
            </div>
            <div className="modal-body">
              <h3>Privacy Policy</h3>
              <p>
                At CareerNext, we are committed to protecting your privacy. We collect personal
                information you provide—such as your name, email, resume details, and quiz responses—
                to deliver and personalize job recommendations. We also automatically collect
                technical data (e.g., browser type, IP address, pages visited) via cookies and
                similar tracking technologies to improve site performance and security.
              </p>
              <p>
                We use your data to match you with relevant opportunities, optimize our AI
                algorithms, and communicate important updates. We do not sell your information
                to third parties. Where required by law, we may share data with service providers
                under strict confidentiality agreements or to comply with legal obligations.
              </p>
              <p>
                You may review, update, or delete your personal data at any time by contacting
                our support team. We retain data only as long as necessary for our services
                unless a longer retention period is required by law.
              </p>
              <h3>Terms of Service</h3>
              <p>
                By accessing or using CareerNext, you agree to these Terms of Service and our
                Privacy Policy. You represent that all information you provide is accurate and
                that you will keep it updated. You agree not to misuse the platform, including
                by uploading harmful content, attempting unauthorized access, or infringing
                on any intellectual property.
              </p>
              <p>
                CareerNext grants you a limited, non-exclusive, revocable license to use our
                services strictly in accordance with these terms. We reserve the right to
                suspend or terminate accounts that violate these terms or disrupt our services.
              </p>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CAREERNEXT DISCLAIMS ALL WARRANTIES,
                EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR
                PURPOSE. IN NO EVENT SHALL CAREERNEXT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE PLATFORM.
              </p>
              <p>
                These terms are governed by the laws of your jurisdiction, and any disputes
                shall be resolved in your local courts. We may update these terms periodically;
                continued use of the service after changes constitutes acceptance.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="modal-button accept"
                onClick={() => setShowPolicy(false)}
              >
                Accept
              </button>
              <button
                className="modal-button decline"
                onClick={() => setShowPolicy(false)}
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
