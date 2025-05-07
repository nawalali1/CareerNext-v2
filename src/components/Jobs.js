"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiCopy } from "react-icons/fi";

const CITY_SUGGESTIONS = [
  "London","Birmingham","Leeds","Glasgow","Sheffield","Manchester",
  "Liverpool","Bristol","Newcastle","Sunderland","Brighton","Cardiff",
  "Leicester","Hull","Plymouth","Stoke-on-Trent","Nottingham",
  "Southampton","Reading","Derby","Wolverhampton","Portsmouth","York",
  "Preston","Aberdeen","Dundee","Oxford","Cambridge","Edinburgh","Belfast"
];
const JOB_TYPES  = ["Full-time","Part-time","Contract","Internship"];
const WORK_MODES = ["On-site","Remote","Hybrid"];
const POSTED_OPTIONS = [
  { label:"Any time", value:"" },
  { label:"Last 24 h", value:"1" },
  { label:"Last 3 d",  value:"3" },
  { label:"Last 7 d",  value:"7" },
  { label:"Last 14 d", value:"14" },
  { label:"Last 30 d", value:"30" }
];
const SALARY_OPTIONS = [0,10000,20000,30000,40000,50000,60000,70000,80000,90000,100000];

export default function Jobs({ degree = "", jobs = [], filters = {} }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // form state
  const [location,   setLocation]    = useState(filters.location   || "");
  const [jobType,    setJobType]     = useState(filters.job_type   || "");
  const [workMode,   setWorkMode]    = useState(filters.work_mode  || "");
  const [salaryMin,  setSalaryMin]   = useState(Number(filters.salary_min) || 0);
  const [salaryMax,  setSalaryMax]   = useState(Number(filters.salary_max) || 0);
  const [postedDays, setPostedDays]  = useState(filters.posted_days || "");
  const [expanded,   setExpanded]    = useState({});
  const [copySuccess, setCopySuccess] = useState({});

  useEffect(() => {
    setMounted(true);
    setLocation(filters.location   || "");
    setJobType(filters.job_type    || "");
    setWorkMode(filters.work_mode  || "");
    setSalaryMin(Number(filters.salary_min) || 0);
    setSalaryMax(Number(filters.salary_max) || 0);
    setPostedDays(filters.posted_days || "");
  }, [filters]);

  const toggleExpand = id => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const applyFilter = e => {
    e.preventDefault();
    const q = { degree };
    if (location)   q.location    = location;
    if (jobType)    q.job_type    = jobType;
    if (workMode)   q.work_mode   = workMode;
    if (salaryMin)  q.salary_min  = salaryMin;
    if (salaryMax)  q.salary_max  = salaryMax;
    if (postedDays) q.posted_days = postedDays;
    router.push({ pathname: "/jobs", query: q });
  };

  const clearFilters = () => {
    router.push({ pathname: "/jobs", query: { degree } });
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopySuccess(prev => ({ ...prev, [id]: false }));
      }, 2000);
    });
  };

  return (
    <div className="jobs-container">
      <h1>Jobs Matching: {degree || "All Roles"}</h1>

      <form className="jobs-filters" onSubmit={applyFilter}>
        {/* Location */}
        <div className="filter-group">
          <label htmlFor="loc">Location</label>
          <select id="loc" value={location} onChange={e => setLocation(e.target.value)}>
            <option value="">Any city</option>
            {CITY_SUGGESTIONS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Job Type */}
        <div className="filter-group">
          <label htmlFor="job-type">Job Type</label>
          <select id="job-type" value={jobType} onChange={e => setJobType(e.target.value)}>
            <option value="">Any type</option>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Work Mode */}
        <div className="filter-group">
          <label htmlFor="work-mode">Work Mode</label>
          <select id="work-mode" value={workMode} onChange={e => setWorkMode(e.target.value)}>
            <option value="">Any mode</option>
            {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Min Salary */}
        <div className="filter-group">
          <label htmlFor="salary-min">Min Salary</label>
          <select id="salary-min" value={salaryMin} onChange={e => setSalaryMin(Number(e.target.value))}>
            <option value={0}>Any</option>
            {SALARY_OPTIONS.filter(n => n>0).map(n => (
              <option key={n} value={n}>£{n/1000}k</option>
            ))}
          </select>
        </div>

        {/* Max Salary */}
        <div className="filter-group">
          <label htmlFor="salary-max">Max Salary</label>
          <select id="salary-max" value={salaryMax} onChange={e => setSalaryMax(Number(e.target.value))}>
            <option value={0}>Any</option>
            {SALARY_OPTIONS.filter(n => n>0).map(n => (
              <option key={n} value={n}>£{n/1000}k</option>
            ))}
          </select>
        </div>

        {/* Posted Within */}
        <div className="filter-group">
          <label htmlFor="posted">Posted Within</label>
          <select id="posted" value={postedDays} onChange={e => setPostedDays(e.target.value)}>
            {POSTED_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Buttons */}
        <div className="filter-buttons">
          <button type="submit">Apply Filters</button>
          <button type="button" className="clear-filters" onClick={clearFilters}>
            Clear All
          </button>
        </div>
      </form>

      {jobs.length === 0 ? (
        <p className="no-results">No jobs found. Try adjusting filters.</p>
      ) : (
        <ul className="jobs-list">
          {jobs.map(job => (
            <li key={job.id} className="job-card">
              <h2>{job.title}</h2>
              <p className="job-meta">
                {job.company?.display_name} — {job.location?.display_name}
              </p>

              {mounted && (
                <button
                  className="toggle-details"
                  onClick={() => toggleExpand(job.id)}
                >
                  {expanded[job.id] ? "Hide Details" : "View Details"}
                </button>
              )}

              {expanded[job.id] && (
                <div className="job-description-wrapper">
                  <div
                    className="job-description"
                    dangerouslySetInnerHTML={{
                      __html: job.full_description ?? job.description
                    }}
                  />
                  <button
                    className="copy-btn"
                    onClick={() =>
                      handleCopy(
                        job.id,
                        (job.full_description ?? job.description).replace(/<[^>]+>/g, "")
                      )
                    }
                  >
                    <FiCopy />
                    {copySuccess[job.id] ? "Copied!" : "Copy Brief"}
                  </button>
                </div>
              )}

              <div className="job-actions">
                <a
                  href={job.redirect_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-link"
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
                  <button>Create CV</button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
