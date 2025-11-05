import React, { useState, useEffect, useRef } from 'react';
import JournalEntry from './components/JournalEntry';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch previous messages on app load
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => setMessages(data.messages))
      .catch(err => console.error('Error fetching messages:', err));
  }, []);

  useEffect(() => {
    // Auto-scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (entry) => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: entry }]);

    try {
      const res = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry })
      });
      const data = await res.json();
      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error calling reflect API:', error);
    }
  };

  return (
    <div className="App">
      <h1>Journal App</h1>
      <JournalEntry onSubmit={handleSubmit} />
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.type === 'user' ? 'You:' : 'AI:'}</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
