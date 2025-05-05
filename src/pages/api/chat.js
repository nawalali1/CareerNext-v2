// src/pages/api/chat.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { message } = req.body;
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Invalid message payload' });
  }

  // Read your key
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error('Missing GOOGLE_API_KEY');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  // Use the v1 endpoint
  const url = `https://generativelanguage.googleapis.com/v1/models/chat-bison-001:generateMessage?key=${apiKey}`;

  // Build the payload with the correct field names
  const body = {
    prompt: {
      messages: [
        { author: 'system', content: 'You are a helpful AI assistant.' },
        { author: 'user', content: message },
      ],
    },
    temperature: 0.7,
    // maxOutputTokens replaces candidate_count in v1
    maxOutputTokens: 512,
    topP: 0.9,
    topK: 40,
  };

  try {
    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const raw = await apiRes.text();
    if (!apiRes.ok) {
      console.error('Gemini API error:', apiRes.status, raw);
      return res.status(502).json({ error: 'Upstream AI error', detail: raw });
    }

    const json = JSON.parse(raw);
    const reply =
      json.candidates?.[0]?.content?.trim() ||
      'Sorry, I didn’t get a response from Gemini.';

    return res.status(200).json({ text: reply });
  } catch (err) {
    console.error('❌ /api/chat exception:', err);
    return res.status(500).json({ error: 'AI backend request failed.' });
  }
}
