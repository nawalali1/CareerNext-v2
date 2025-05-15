// components/Jobs.js
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiCopy, FiFilter } from "react-icons/fi";
import { FaBriefcase } from "react-icons/fa";

const CITY_SUGGESTIONS = [
  "London","Birmingham","Leeds","Glasgow","Sheffield","Manchester",
  "Liverpool","Bristol","Newcastle","Sunderland","Brighton","Cardiff",
  "Leicester","Hull","Plymouth","Stoke-on-Trent","Nottingham",
  "Southampton","Reading","Derby","Wolverhampton","Portsmouth","York",
  "Preston","Aberdeen","Dundee","Oxford","Cambridge","Edinburgh","Belfast"
];
const JOB_TYPES      = ["Full-time","Part-time","Contract","Internship"];
const POSTED_OPTIONS = [
  { label: "Any time",  value: "" },
  { label: "Last 24h",  value: "1" },
  { label: "Last 3d",   value: "3" },
  { label: "Last 7d",   value: "7" },
  { label: "Last 14d",  value: "14" },
  { label: "Last 30d",  value: "30" }
];
const SALARY_OPTIONS  = [0,10_000,20_000,30_000,40_000,50_000,60_000,70_000,80_000,90_000,100_000];

export default function Jobs({ degree = "", jobs = [], filters = {} }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // filter inputs
  const [location,   setLocation]   = useState(filters.location   || "");
  const [jobType,    setJobType]    = useState(filters.job_type   || "");
  const [salaryMin,  setSalaryMin]  = useState(Number(filters.salary_min) || 0);
  const [salaryMax,  setSalaryMax]  = useState(Number(filters.salary_max) || 0);
  const [postedDays, setPostedDays] = useState(filters.posted_days || "");

  // expand & copy state
  const [expanded,    setExpanded]    = useState({});
  const [copySuccess, setCopySuccess] = useState({});

  useEffect(() => {
    setMounted(true);
    // reset on HMR/props change
    setLocation(filters.location   || "");
    setJobType(filters.job_type    || "");
    setSalaryMin(Number(filters.salary_min) || 0);
    setSalaryMax(Number(filters.salary_max) || 0);
    setPostedDays(filters.posted_days || "");
  }, [filters]);

  const toggleExpand = id => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const applyFilter = e => {
    e.preventDefault();
    const q = { degree };
    if (location)   q.location     = location;
    if (jobType)    q.job_type     = jobType;
    if (salaryMin)  q.salary_min   = salaryMin;
    if (salaryMax)  q.salary_max   = salaryMax;
    if (postedDays) q.posted_days  = postedDays;
    router.push({ pathname: "/jobs", query: q });
  };

  const clearFilters = () =>
    router.push({ pathname: "/jobs", query: { degree } });

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(p => ({ ...p, [id]: true }));
      setTimeout(() => setCopySuccess(p => ({ ...p, [id]: false })), 2000);
    });
  };

  return (
    <div className="jobs-page">
      <aside className="filters-sidebar">
        <h2 className="filters-heading"><FiFilter /> Filters</h2>
        <form className="jobs-filters" onSubmit={applyFilter}>
          <label>
            Location
            <select value={location} onChange={e => setLocation(e.target.value)}>
              <option value="">Any city</option>
              {CITY_SUGGESTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label>
            Job Type
            <select value={jobType} onChange={e => setJobType(e.target.value)}>
              <option value="">Any type</option>
              {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>

          <label>
            Min Salary
            <select value={salaryMin} onChange={e => setSalaryMin(Number(e.target.value))}>
              <option value={0}>Any</option>
              {SALARY_OPTIONS.map(n =>
                <option key={n} value={n}>£{n/1000}k</option>
              )}
            </select>
          </label>

          <label>
            Max Salary
            <select value={salaryMax} onChange={e => setSalaryMax(Number(e.target.value))}>
              <option value={0}>Any</option>
              {SALARY_OPTIONS.map(n =>
                <option key={n} value={n}>£{n/1000}k</option>
              )}
            </select>
          </label>

          <label>
            Posted Within
            <select value={postedDays} onChange={e => setPostedDays(e.target.value)}>
              {POSTED_OPTIONS.map(o =>
                <option key={o.value} value={o.value}>{o.label}</option>
              )}
            </select>
          </label>

          <div className="filter-buttons">
            <button type="submit" className="btn-apply">Apply</button>
            <button type="button" className="btn-clear" onClick={clearFilters}>Reset</button>
          </div>
        </form>
      </aside>

      <main className="jobs-content">
        <h1 className="jobs-heading">
          Jobs for <span className="accent">{degree || "All Roles"}</span>
        </h1>
        <p className="jobs-results-count">
          {jobs.length.toLocaleString()} {jobs.length===1?"role":"roles"} found
        </p>

        {!jobs.length ? (
          <p className="no-results">No jobs found. Try different filters.</p>
        ) : (
          <ul className="jobs-list">
            {jobs.map(job => (
              <li key={job.id} className="job-card">
                <header className="job-card-header">
                  <FaBriefcase className="job-icon" />
                  <h2 className="job-title">{job.title}</h2>
                </header>

                <p className="job-meta">
                  {job.company?.display_name} — {job.location?.display_name}
                </p>

                <button
                  className="toggle-details"
                  onClick={() => toggleExpand(job.id)}
                >
                  {expanded[job.id] ? "Hide Details" : "View Details"}
                </button>

                {expanded[job.id] && (
                  <div className="job-description-wrapper">
                    <div
                      className="job-description"
                      dangerouslySetInnerHTML={{
                        __html:
                          ((job.full_description ?? job.description) || "")
                            .slice(0, 500) + "…"
                      }}
                    />
                    <button
                      className="copy-btn"
                      onClick={() =>
                        handleCopy(
                          job.id,
                          ((job.full_description ?? job.description)||"")
                            .replace(/<[^>]+>/g, "")
                            .slice(0, 500)
                        )
                      }
                    >
                      <FiCopy /> {copySuccess[job.id] ? "Copied!" : "Copy Brief"}
                    </button>
                  </div>
                )}

                <div className="job-actions">
                  <a
                    className="apply-link"
                    href={job.redirect_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply on Adzuna
                  </a>
                  <Link
                    href={{
                      pathname: "/cvbuilder",
                      query: {
                        job: JSON.stringify({
                          title: job.title,
                          company: job.company?.display_name,
                        }),
                      },
                    }}
                  >
                    <button className="btn-cv">Create CV</button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
