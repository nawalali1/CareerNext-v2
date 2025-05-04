// src/pages/api/recommend.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { answers } = req.body;
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "'answers' must be a non-empty array" });
  }

  // Build a clear JSON-return prompt
  const prompt = `
You are a seasoned career counselor AI. A user answered these questions:

${answers.map((ans, i) => `${i + 1}. ${ans}`).join("\n")}

Please recommend exactly 3 career paths. Return your response as valid JSON in this exact format:

[
  { "title": "Career Name", "reason": "One-sentence explanation why this fits" },
  { "title": "Career Name", "reason": "One-sentence explanation why this fits" },
  { "title": "Career Name", "reason": "One-sentence explanation why this fits" }
]
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful career advisor AI." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const text = completion.choices[0].message.content.trim();
    let recommendations;

    // Attempt to parse JSON directly
    try {
      recommendations = JSON.parse(text);
    } catch (parseError) {
      console.error("AI returned non-JSON:", text);
      return res.status(500).json({ error: "AI did not return valid JSON." });
    }

    return res.status(200).json({ recommendations });
  } catch (err) {
    console.error("OpenAI request failed:", err);
    return res.status(500).json({ error: "AI recommendation failed." });
  }
}
