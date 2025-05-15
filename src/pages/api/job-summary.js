// pages/api/job-summary.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { title = "" } = req.query;
  const appId  = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  const url =
    `https://api.adzuna.com/v1/api/jobs/gb/search/1` +
    `?app_id=${appId}&app_key=${appKey}` +
    `&what=${encodeURIComponent(title)}` +
    `&results_per_page=3`;

  try {
    const apiRes = await fetch(url);
    const data   = await apiRes.json();
    const count   = data.count || 0;
    const samples = (data.results || []).map((j) => ({
      title:    j.title,
      company:  j.company?.display_name || "",
      location: j.location?.display_name || "",
    }));
    res.status(200).json({ count, samples });
  } catch (err) {
    console.error("Adzuna proxy error:", err);
    res.status(500).json({ count: 0, samples: [] });
  }
}
