// src/components/Results.js
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useRouter } from "next/router";

Modal.setAppElement("#__next");

export default function Results() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/questionnaireFeedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: JSON.parse(localStorage.getItem("cn_answers") || "[]"),
          }),
        });
        const { text } = await res.json();
        const match = text.match(/\{[\s\S]*\}/);
        const parsed = match ? JSON.parse(match[0]) : {};
        setRecs(parsed.recommendations || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="results-container">
        <p className="loading-text">Generating career suggestions…</p>
      </div>
    );
  }

  return (
    <div className="results-container">
      <header className="results-header">
        <h1>Your Top 5 Career Matches</h1>
        <p>Based on your quiz answers, here are the roles you’re most aligned with:</p>
      </header>

      <div className="recommendations-grid">
        {recs.map((r, i) => (
          <div key={i} className="recommendation-item">
            <h3 className="recommendation-title">{r.title}</h3>
            {/* explanation removed from card */}

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                className="learn-more-btn"
                onClick={() => setSelected(r)}
              >
                Learn More <span className="chevron">›</span>
              </button>
              <button
                className="learn-more-btn"
                onClick={() =>
                  router.push({
                    pathname: "/jobs",
                    query: {
                      degree: r.title,
                      location: "",
                    },
                  })
                }
              >
                View Jobs <span className="chevron">›</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selected}
        onRequestClose={() => setSelected(null)}
        overlayClassName="modal-overlay"
        className="modal-content"
      >
        {selected && (
          <>
            <h2 className="modal-title">{selected.title}</h2>
            <div className="modal-body">
              <p>{selected.explanation}</p>
            </div>
            <button
              className="modal-close-btn"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
