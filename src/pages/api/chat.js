// src/pages/api/chat.js

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,  // make sure this is set in .env.local
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing or invalid message" });
  }

  // Build a simple prompt
  const prompt = [
    "You are an expert resume and CV coach.",
    "Help the user craft better bullet points for their resume.",
    `User: ${message}`,
    "Coach:"
  ].join("\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });
    return res.status(200).json({ text: response.text });
  } catch (e) {
    console.error("Chat API error:", e);
    return res
      .status(500)
      .json({ error: "Internal error", detail: e.toString() });
  }
}
