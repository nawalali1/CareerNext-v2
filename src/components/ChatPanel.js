// src/components/ChatPanel.js
'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function ChatPanel() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([
    { from: 'bot', text: '👋 Paste your job brief and hit 🔄 to reword.' },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef             = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, open]);

  const send = async (reword = false) => {
    const txt = input.trim();
    if (!txt || loading) return;

    setMsgs((prev) => [...prev, { from: 'user', text: txt }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type':'application/json' },
        body:    JSON.stringify({ message: txt, reword }),
      });
      const { text, error } = await res.json();
      setMsgs((prev) => [
        ...prev,
        { from: 'bot', text: error ? `⚠️ ${error}` : text },
      ]);
    } catch (err) {
      console.error(err);
      setMsgs((prev) => [
        ...prev,
        { from: 'bot', text: '⚠️ Request failed.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chat-panel ${open ? 'open' : 'closed'}`}>
      <div className="chat-header">
        <h3>AI Assistant</h3>
        <button
          className="collapse-btn"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Collapse chat' : 'Expand chat'}
        >
          {open ? '←' : '→'}
        </button>
      </div>

      {open && (
        <>
          <div className="messages" ref={scrollRef}>
            {msgs.map((m, i) => (
              <div key={i} className={`message ${m.from}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="message bot">🤖 thinking…</div>}
          </div>

          <div className="input-area">
            <input
              type="text"
              placeholder="Paste job brief here…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
              disabled={loading}
            />
            <button
              onClick={() => send(false)}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              ➤
            </button>
            <button
              onClick={() => send(true)}
              disabled={loading || !input.trim()}
              aria-label="Reword Brief"
            >
              🔄
            </button>
          </div>
        </>
      )}
    </div>
  );
}
