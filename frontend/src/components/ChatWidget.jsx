import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const botMessage = { sender: 'bot', text: '' };
    setMessages(prev => [...prev, botMessage]);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      });

      if (!response.body) return;
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let done = false;
      while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          const chunk = decoder.decode(value, { stream: true });
          
          // Process Server-Sent Events
          const lines = chunk.split('\n');
          for (const line of lines) {
              if (line.startsWith('data:')) {
                  const data = line.substring(5).trim();
                  try {
                      const parsed = JSON.parse(data);
                      if (parsed.token) {
                          setMessages(prev => {
                              const lastMsgIndex = prev.length - 1;
                              const updatedMessages = [...prev];
                              updatedMessages[lastMsgIndex].text += parsed.token;
                              return updatedMessages;
                          });
                      }
                  } catch (error) {
                      // Ignore json parsing errors
                  }
              }
          }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessages(prev => {
        const lastMsgIndex = prev.length - 1;
        const updatedMessages = [...prev];
        updatedMessages[lastMsgIndex].text = "Sorry, I couldn't connect to the server.";
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chatbox">
          <div className="chatbox-header">
            <h3>Hỗ trợ FAQ</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="chatbox-messages" ref={chatMessagesRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.sender === 'bot' && <div className="typing-indicator"><span>.</span><span>.</span><span>.</span></div>}
          </div>
          <form className="chatbox-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi đáp về vé xe..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>Gửi</button>
          </form>
        </div>
      )}
      <button className="chat-open-button" onClick={() => setIsOpen(!isOpen)}>
        💬
      </button>
    </div>
  );
};

export default ChatWidget;