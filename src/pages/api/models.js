// src/pages/api/models.js

export default async function handler(req, res) {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const apiKey   = process.env.GOOGLE_API_KEY;
    const project  = process.env.GCP_PROJECT;
    const location = process.env.GENAI_LOCATION || 'us-central1';
  
    if (!apiKey || !project) {
      console.error('❌ Missing GOOGLE_API_KEY or GCP_PROJECT');
      return res.status(500).json({ error: 'Missing env vars' });
    }
  
    const url =
      `https://generativelanguage.googleapis.com/v1beta2/projects/` +
      `${project}/locations/${location}/models?key=${apiKey}`;
  
    console.log('🔗 ListModels →', url);
  
    try {
      const apiRes = await fetch(url);
      const text   = await apiRes.text();
      console.log('📥 ListModels status', apiRes.status, text);
  
      if (!apiRes.ok) {
        return res
          .status(apiRes.status)
          .json({ error: 'Upstream error', detail: text });
      }
      return res.status(200).json(JSON.parse(text));
    } catch (err) {
      console.error('❌ Exception listing models:', err);
      return res
        .status(500)
        .json({ error: 'Internal error', detail: err.message });
    }
  }
  