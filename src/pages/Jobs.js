// src/pages/jobs.js
import React from "react";
import Jobs from "../components/Jobs";
import fetch from "node-fetch";

export default function JobsPage({ degree, jobs, filters }) {
  // ensure filters is at least an empty object
  const safeFilters = filters || {};
  return <Jobs degree={degree} jobs={jobs} filters={safeFilters} />;
}

export async function getServerSideProps({ query }) {
  const {
    degree = "",
    location = "",
    job_type = "",
    work_mode = "",
    salary_min = "",
    salary_max = "",
    posted_days = "",
  } = query;

  // Build your Adzuna URL here—example:
  const appId  = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1` +
    `?app_id=${appId}&app_key=${appKey}` +
    `&what=${encodeURIComponent(degree)}` +
    `&where=${encodeURIComponent(location)}` +
    (job_type    ? `&full_time=${job_type === "Full-time"}` : ``) +
    (work_mode   ? `&${work_mode.toLowerCase()}=1` : ``) +
    (salary_min  ? `&salary_min=${salary_min}` : ``) +
    (salary_max  ? `&salary_max=${salary_max}` : ``) +
    (posted_days ? `&max_days_old=${posted_days}` : ``);

  let jobs = [];
  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    jobs = data.results || [];
  } catch (err) {
    console.error("Adzuna fetch error:", err);
  }

  // Pass the query values back as `filters`
  const filters = {
    location,
    job_type,
    work_mode,
    salary_min,
    salary_max,
    posted_days,
  };

  return {
    props: {
      degree,
      jobs,
      filters,
    },
  };
}
