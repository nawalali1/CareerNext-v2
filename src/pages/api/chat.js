// src/pages/api/chat.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { message } = req.body;
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Invalid message payload' });
  }

  try {
    // Use the Google Generative Language API endpoint for Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage?key=${apiKey}`;

    const apiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: {
          messages: [
            { author: 'system', content: 'You are a helpful AI assistant.' },
            { author: 'user', content: message }
          ]
        },
        temperature: 0.7,
        top_k: 40,
        top_p: 0.9,
        candidate_count: 1
      })
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error('Gemini API error:', errText);
      throw new Error(errText);
    }

    const payload = await apiRes.json();
    // Extract the assistant reply
    const reply =
      payload.candidates?.[0]?.content?.trim() ||
      'Sorry, I didn’t get that.';

    return res.status(200).json({ text: reply });
  } catch (err) {
    console.error('❌ /api/chat error:', err);
    return res.status(500).json({ error: 'AI backend request failed.' });
  }
}
