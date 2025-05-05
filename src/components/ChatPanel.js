// src/components/ChatPanel.js

import { useState } from "react";

export default function ChatPanel() {
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
        {
          sender: "ai",
          text: error ? `Error: ${JSON.stringify(error)}` : text,
        },
      ]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { sender: "ai", text: "Request failed: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-panel">
      <h2>AI CV Coach</h2>
      <div className="chat-window">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`chat-message ${m.sender === "user" ? "user" : "ai"}`}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask your CV coach…"
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !chatInput.trim()}>
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
);
}
