// components/Home.js
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
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
    // Use 'degree' param (what) and 'location' (where) for Adzuna-backed jobs page
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
              Instantly discover roles that fit your strengths—whether you’re a
              student, a graduate, or switching careers.
            </p>

            {/* Search Form */}
            <form className="hero-search-form" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Job title, skill, or company"
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
                  placeholder="Location (e.g. Remote or City)"
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
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
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
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
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
    </>
  );
}
