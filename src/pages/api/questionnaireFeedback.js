// src/pages/api/questionnaireFeedback.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }
  const { answers } = req.body;
  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: "Missing or invalid answers" });
  }

  const prompt = [
    "You are a friendly career advisor. You speak in clear, simple language.",
    "A user has completed this questionnaire:",
    ...answers.map((a, i) => `Q${i + 1}: ${a}`),
    "",
    "Based on their answers, return ONLY valid JSON with one key 'recommendations', whose value is an array of exactly 5 objects. Each object should have:",
    "- 'title': the short career name (1–3 words).",
    "- 'explanation': 1–2 short sentences explaining why this career fits the user's profile.",
    "Make sure all 5 careers are within the same broad field and closely related.",
    "Do not include any extra text or markdown—just the JSON."
  ].join("\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });
    return res.status(200).json({ text: response.text });
  } catch (e) {
    console.error("Gemini error:", e);
    return res.status(500).json({ error: "Internal error", detail: e.toString() });
  }
}
