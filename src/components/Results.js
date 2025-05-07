import React, { useEffect, useState } from "react";
import Modal from "react-modal";


Modal.setAppElement("#__next");

export default function Results() {
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
      <div className="recommendations-grid">
        {recs.map((r, i) => (
          <div key={i} className="recommendation-item">
            <h3 className="recommendation-title">{r.title}</h3>
            <button
              className="learn-more-btn"
              onClick={() => setSelected(r)}
            >
              Learn More
            </button>
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
            <button className="modal-close-btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
