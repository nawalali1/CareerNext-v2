// src/components/ChatPanel.js
import React, { useState, useRef, useEffect } from 'react';

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hello! I’m your AI assistant. How can I help today?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const togglePanel = () => {
    setIsOpen((open) => !open);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Add user message locally
    setMessages((msgs) => [...msgs, { from: 'user', text }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Status ${res.status}`);
      }

      setMessages((msgs) => [...msgs, { from: 'bot', text: data.text }]);
    } catch (err) {
      console.error('ChatPanel error:', err);
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: 'Sorry, I couldn’t process that right now.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`chat-panel ${isOpen ? 'open' : 'closed'}`}>
      <div className="chat-header">
        <h3>AI Assistant</h3>
        <button
          className="collapse-btn"
          onClick={togglePanel}
          aria-label={isOpen ? 'Collapse chat' : 'Expand chat'}
        >
          {isOpen ? '←' : '→'}
        </button>
      </div>

      {isOpen && (
        <>
          <div className="messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.from}`}>
                {m.text}
              </div>
            ))}
            {isLoading && <div className="message bot">Thinking… 🤖</div>}
          </div>

          <div className="input-area">
            <input
              type="text"
              placeholder="Type your message…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>
        </>
      )}
    </div>
  );
}
