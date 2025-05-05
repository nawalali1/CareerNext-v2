// src/pages/api/generate.js

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,  // your .env.local key
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing or invalid prompt" });
  }

  try {
    // ← Use the Developer API's flash model
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
      // optional: temperature, maxOutputTokens, etc.
    });

    return res.status(200).json({ text: response.text });
  } catch (e) {
    console.error("Gen AI SDK error:", e);
    return res
      .status(500)
      .json({ error: "Internal error", detail: e.toString() });
  }
}
