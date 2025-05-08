// src/pages/api/chat.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.setHeader('Allow','POST');
      return res.status(405).json({ error: 'Only POST allowed' });
    }
  
    const { message, reword } = req.body;
    if (!message || typeof message !== 'string') {
      return res
        .status(400)
        .json({ error: 'Please send a `message` string in the JSON body.' });
    }
  
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      console.error('❌ Missing OPENAI_API_KEY');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }
  
    const userPrompt = reword
      ? `Rewrite this job description as a concise first-person pitch highlighting exactly how my skills match the role:\n\n${message}`
      : message;
  
    try {
      const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
          Authorization:`Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role:'system', content:'You’re an AI copywriter.' },
            { role:'user',   content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });
  
      const payload = await chatRes.json();
      if (payload.error) {
        console.error('❗ OpenAI error:', payload.error);
        return res.status(500).json({ error: payload.error.message });
      }
  
      const reply = payload.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error('No response from OpenAI');
  
      return res.status(200).json({ text: reply });
    } catch (err) {
      console.error('❌ /api/chat error', err);
      return res.status(500).json({ error: err.message || 'Request failed.' });
    }
  }
  