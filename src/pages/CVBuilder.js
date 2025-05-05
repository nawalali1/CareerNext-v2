// src/pages/CVBuilder.js

import { useState } from "react";

export default function CVBuilder() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! I can help you polish your CV. What would you like to improve?" },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setMessages((m) => [...m, { sender: "user", text: userText }]);
    setChatInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const { text, error } = await res.json();
      setMessages((m) => [
        ...m,
        { sender: "ai", text: error ? `Error: ${JSON.stringify(error)}` : text },
      ]);
    } catch (err) {
      setMessages((m) => [...m, { sender: "ai", text: "Request failed: " + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>CV Builder</h1>
      {/* your existing CV form fields above… */}
      <section style={{ marginTop: 40 }}>
        <h2>AI CV Coach</h2>
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: 4,
            padding: 12,
            height: 300,
            overflowY: "auto",
            background: "#fafafa",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                textAlign: m.sender === "user" ? "right" : "left",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: 16,
                  background: m.sender === "user" ? "#0070f3" : "#e1e1e1",
                  color: m.sender === "user" ? "#fff" : "#000",
                  maxWidth: "80%",
                }}
              >
                {m.text}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask your CV coach…"
            style={{ flexGrow: 1, padding: "8px 12px" }}
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading || !chatInput.trim()}>
            {loading ? "…" : "Send"}
          </button>
        </div>
      </section>
    </main>
  );
}
