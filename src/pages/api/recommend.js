// src/pages/api/recommend.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY");
    return res.status(500).json({ error: "Server misconfigured: missing API key" });
  }

  const { answers } = req.body;
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "'answers' must be a non-empty array" });
  }

  const prompt = `
You are a career advisor AI. The user answered:
${answers.map((a,i) => `${i+1}. ${a}`).join("\n")}

Recommend exactly 3 career paths. Return valid JSON:
[
  { "title": "Career Name", "reason": "Why it fits" },
  { "title": "Career Name", "reason": "Why it fits" },
  { "title": "Career Name", "reason": "Why it fits" }
]
`;

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful career counselor AI." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const text = completion.choices[0].message.content.trim();
    const recommendations = JSON.parse(text);
    return res.status(200).json({ recommendations });
  } catch (err) {
    console.error("OpenAI call error:", err);

    // Detect quota errors either by status or message text
    const status = err.status || err.statusCode;
    const message = err.message || "";

    if (status === 429 || message.toLowerCase().includes("quota")) {
      console.warn("Quota exceeded – returning fallback list");
      const fallback = [
        { title: "Software Engineer", reason: "You enjoy solving technical challenges." },
        { title: "UX Designer",      reason: "You have an eye for user-centric design." },
        { title: "Data Analyst",     reason: "You like interpreting and leveraging data." },
      ];
      return res.status(200).json({ recommendations: fallback, fallback: true });
    }

    // Otherwise, real error
    const errorMsg = err.response?.data?.error?.message || message;
    return res.status(500).json({ error: `AI request failed: ${errorMsg}` });
  }
}
