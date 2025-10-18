import React, { useState, useEffect } from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:8000/api';

  const fetchEntries = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/journal/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/journal/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        setContent('');
        fetchEntries();
      }
    } catch (error) {
      console.error('Error creating entry:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>Sidebar</h3>
        <ul>
          <li>Menu Item 1</li>
          <li>Menu Item 2</li>
          <li>Menu Item 3</li>
        </ul>
      </aside>
      <main className="main-content">
        <h2>Dashboard</h2>
        <p>Welcome to EchoAI!</p>

        <div className="journal-section">
          <h3>Journal Entry</h3>
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts here..."
              rows="4"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Entry'}
            </button>
          </form>

          <h3>Your Journal Entries</h3>
          <div className="entries">
            {entries.length === 0 ? (
              <p>No entries yet.</p>
            ) : (
              entries.map((entry) => (
                <div key={entry._id} className="entry">
                  <p><strong>Your Content:</strong> {entry.content}</p>
                  <p><strong>AI Reflection:</strong> {entry.aiResponse}</p>
                  <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
