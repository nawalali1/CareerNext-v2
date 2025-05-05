// src/pages/api/chat.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { message } = req.body;
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Invalid message payload' });
  }

  // Load your keys & project
  const apiKey    = process.env.GOOGLE_API_KEY;
  const project   = process.env.GCP_PROJECT;
  const location  = process.env.GENAI_LOCATION || 'us-central1';

  if (!apiKey || !project) {
    console.error('Missing GOOGLE_API_KEY or GCP_PROJECT');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  // Project‐scoped endpoint
  const url = `https://generativelanguage.googleapis.com/v1beta2/projects/${project}/locations/${location}/models/chat-bison-001:generateMessage?key=${apiKey}`;

  const payload = {
    prompt: {
      messages: [
        { author: 'system', content: 'You are a helpful AI assistant.' },
        { author: 'user',   content: message },
      ],
    },
    temperature:     0.7,
    top_k:           40,
    top_p:           0.9,
    candidate_count: 1,
  };

  try {
    const apiRes = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    const raw = await apiRes.text();
    if (!apiRes.ok) {
      console.error('Gemini API error:', apiRes.status, raw);
      return res.status(502).json({ error: 'Upstream AI error', detail: raw });
    }

    const { candidates } = JSON.parse(raw);
    const reply =
      candidates?.[0]?.content?.trim() ||
      'Sorry, I didn’t get a response from Gemini.';

    return res.status(200).json({ text: reply });
  } catch (err) {
    console.error('❌ /api/chat exception:', err);
    return res.status(500).json({ error: 'AI backend request failed.' });
  }
}
