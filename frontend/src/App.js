import React, { useState } from 'react';
import JournalEntry from './components/JournalEntry';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (entry) => {
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: entry }]);
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai', text: 'Thank you for sharing your thoughts!' }]);
    }, 1000);
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
