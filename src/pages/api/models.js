// src/pages/api/models.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const apiKey   = process.env.GOOGLE_API_KEY;
  const project  = process.env.GCP_PROJECT;
  const location = process.env.GENAI_LOCATION || 'us-central1';

  if (!apiKey || !project) {
    console.error('Missing env vars');
    return res.status(500).json({ error: 'Missing env vars' });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta2/projects/${project}/locations/${location}/models?key=${apiKey}`;

  try {
    const r = await fetch(url);
    const text = await r.text();
    if (!r.ok) {
      console.error('List models error', r.status, text);
      return res.status(502).json({ error: 'Upstream error', detail: text });
    }
    const json = JSON.parse(text);
    return res.status(200).json(json);
  } catch (e) {
    console.error('Exception listing models', e);
    return res.status(500).json({ error: 'Internal error' });
  }
}
