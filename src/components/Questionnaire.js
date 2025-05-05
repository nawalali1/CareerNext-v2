// wherever your Questionnaire component lives (e.g. src/pages/Questionnaire.js)

import { useState } from "react";

export default function Questionnaire() {
  // --- adjust these questions to match your own ---
  const questions = [
    "What subjects do you enjoy most?",
    "Do you prefer working with people or data?",
    "How much do you value creativity?",
    "Do you like leading teams or following instructions?",
    "Would you rather work indoors or outdoors?",
  ];

  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (idx) => (e) => {
    const copy = [...answers];
    copy[idx] = e.target.value;
    setAnswers(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answers.some((a) => !a.trim())) return;
    setLoading(true);
    setFeedback("");
    try {
      const res = await fetch("/api/questionnaireFeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const { text, error } = await res.json();
      setFeedback(error ? `Error: ${JSON.stringify(error)}` : text);
    } catch (err) {
      setFeedback("Request failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Career Questionnaire</h1>
      <form onSubmit={handleSubmit}>
        {questions.map((q, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <label>
              <strong>{q}</strong>
              <input
                type="text"
                value={answers[i]}
                onChange={handleChange(i)}
                style={{ display: "block", width: "100%", marginTop: 4 }}
              />
            </label>
          </div>
        ))}
        <button
          type="submit"
          disabled={loading || answers.some((a) => !a.trim())}
        >
          {loading ? "Thinking…" : "Get AI Feedback"}
        </button>
      </form>

      {feedback && (
        <section style={{ marginTop: 24 }}>
          <h2>AI Recommendation</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{feedback}</p>
        </section>
      )}
    </main>
  );
}
