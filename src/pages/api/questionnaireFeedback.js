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
    "You are a career advisor.",
    "A user has just completed this questionnaire:",
    ...answers.map((a,i) => `Q${i+1}: ${a}`),
    "",
    "Based on their answers, recommend the ONE career category they should pursue and explain why in 3–4 sentences."
  ].join("\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });
    return res.status(200).json({ text: response.text });
  } catch (e) {
    console.error("Questionnaire feedback error:", e);
    return res.status(500).json({ error: "Internal error", detail: e.toString() });
  }
}
