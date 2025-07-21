import { useState } from 'react';
import './Chatbox.css';

function Chatbox({ onClose }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Bạn cần hỏi gì về vé xe?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    setInput('');
    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'bot', text: data.answer }]);
    } catch {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Lỗi kết nối server.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="chatbox-modal">
      <div className="chatbox-window">
        <button className="chatbox-close" onClick={onClose}>×</button>
        <div className="chatbox-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chatbox-msg chatbox-msg-${msg.sender}`}>{msg.text}</div>
          ))}
          {loading && <div className="chatbox-msg chatbox-msg-bot">Đang trả lời...</div>}
        </div>
        <form className="chatbox-input-row" onSubmit={sendMessage}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Nhập câu hỏi..."
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !input.trim()}>Gửi</button>
        </form>
      </div>
    </div>
  );
}

export default Chatbox; 