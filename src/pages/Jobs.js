import React, { useState, useEffect } from 'react';
import './Jobs.css';

const salaryRanges = [
  { label: 'Any', min: null, max: null },
  { label: 'Under £30K', min: 0, max: 30000 },
  { label: '£30K–£50K', min: 30000, max: 50000 },
  { label: '£50K–£70K', min: 50000, max: 70000 },
  { label: '£70K–£100K', min: 70000, max: 100000 },
  { label: 'Over £100K', min: 100000, max: null },
];

const industryOptions = [
  'All',
  'Artificial Intelligence',
  'Healthcare',
  'FinTech',
  'Creative Media',
  'Renewable Energy',
  'Software Engineering',
  'Data Science',
  'Project Management',
];

export default function Jobs() {
  const [keyword, setKeyword] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [industry, setIndustry] = useState('All');
  const [company, setCompany] = useState('');
  const [contractType, setContractType] = useState('Any');
  const [salaryMin, setSalaryMin] = useState('Any');
  const [salaryMax, setSalaryMax] = useState('Any');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const appId = process.env.REACT_APP_ADZUNA_APP_ID;
      const appKey = process.env.REACT_APP_ADZUNA_APP_KEY;
      const base = 'https://api.adzuna.com/v1/api/jobs/gb/search/1';
      const params = new URLSearchParams({
        app_id: appId,
        app_key: appKey,
        results_per_page: '20',
      });

      if (keyword.trim()) params.set('what', keyword.trim());
      if (locationFilter.trim()) params.set('where', locationFilter.trim());
      if (industry !== 'All') params.set('category', industry);
      if (company.trim()) params.set('company', company.trim());
      if (contractType !== 'Any') params.set('contract_type', contractType.toLowerCase());

      const minObj = salaryRanges.find(s => s.label === salaryMin);
      const maxObj = salaryRanges.find(s => s.label === salaryMax);
      if (minObj && minObj.min != null) params.set('salary_min', String(minObj.min));
      if (maxObj && maxObj.max != null) params.set('salary_max', String(maxObj.max));

      const originalUrl = `${base}?${params.toString()}`;
      const fetchUrl = 'https://thingproxy.freeboard.io/fetch/' + originalUrl;

      const res = await fetch(fetchUrl);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API ${res.status}: ${txt}`);
      }
      const data = await res.json();
      setJobs(data.results || []);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="jobs-page">
      <aside className="jobs-sidebar">
        <form className="filter-form" onSubmit={e => { e.preventDefault(); fetchJobs(); }}>
          <h3>Filters</h3>

          <label>Keyword</label>
          <input
            type="text"
            placeholder="e.g. engineer, designer..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />

          <label>Location</label>
          <input
            type="text"
            placeholder="City or postcode"
            value={locationFilter}
            onChange={e => setLocationFilter(e.target.value)}
          />

          <label>Industry</label>
          <select value={industry} onChange={e => setIndustry(e.target.value)}>
            {industryOptions.map(opt => <option key={opt}>{opt}</option>)}
          </select>

          <label>Company</label>
          <input
            type="text"
            placeholder="Company name"
            value={company}
            onChange={e => setCompany(e.target.value)}
          />

          <label>Contract Type</label>
          <select value={contractType} onChange={e => setContractType(e.target.value)}>
            {['Any', 'Full-time', 'Part-time'].map(opt => <option key={opt}>{opt}</option>)}
          </select>

          <label>Salary Min</label>
          <select value={salaryMin} onChange={e => setSalaryMin(e.target.value)}>
            {salaryRanges.map(s => <option key={s.label}>{s.label}</option>)}
          </select>

          <label>Salary Max</label>
          <select value={salaryMax} onChange={e => setSalaryMax(e.target.value)}>
            {salaryRanges.map(s => <option key={s.label}>{s.label}</option>)}
          </select>

          <button type="submit" className="apply-filters">
            Apply Filters
          </button>
        </form>
      </aside>

      <main className="jobs-content">
        <h2>Job Listings</h2>

        {loading && <p className="jobs-loading">Loading jobs…</p>}
        {error && (
          <div className="jobs-error">
            <p><strong>Error:</strong> {error}</p>
            <button onClick={fetchJobs}>Retry</button>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <p className="jobs-none">No jobs match your filters.</p>
        )}

        <div className="job-list">
          {jobs.map(job => {
            const link = job.redirect_url || job.redirectUrl;
            return (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <p><strong>Company:</strong> {job.company.display_name}</p>
                <p><strong>Location:</strong> {job.location.display_name}</p>
                {job.salary_min != null && job.salary_max != null && (
                  <p>
                    <strong>Salary:</strong>
                    £{job.salary_min.toLocaleString()}–£{job.salary_max.toLocaleString()}
                  </p>
                )}
                {job.contract_type && (
                  <p><strong>Contract:</strong> {job.contract_type}</p>
                )}
                <a
                  className="apply-link"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply on Adzuna →
                </a>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
