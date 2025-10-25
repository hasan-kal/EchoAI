import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [insights, setInsights] = useState(null);
  const navigate = useNavigate();

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
      } else {
        setMessage('Error fetching entries.');
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      setMessage('Error fetching entries.');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchInsights = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE}/journal/insights`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setMessage('');
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
        setMessage('Entry submitted successfully!');
        fetchEntries();
        fetchInsights();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Error submitting entry.');
      }
    } catch (error) {
      console.error('Error creating entry:', error);
      setMessage('Error submitting entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    fetchEntries();
    fetchInsights();
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>EchoAI</h3>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/insights">Mood Insights</a></li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>
      <main className="main-content">
        <header className="dashboard-header">
          <h2>Dashboard</h2>
          <p>Welcome to EchoAI! Reflect and grow with AI-powered insights.</p>
        </header>

        <div className="dashboard-sections">
          <section className="journal-section">
            <h3>Journal Entry</h3>
            {message && <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}
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
          </section>

          <section className="entries-section">
            <h3>Your Journal Entries</h3>
            {fetchLoading ? (
              <p>Please wait...</p>
            ) : entries.length === 0 ? (
              <p>No entries yet.</p>
            ) : (
              <div className="entries">
                {entries.map((entry) => (
                  <div key={entry._id} className="entry">
                    <p><strong>Your Content:</strong> {entry.content}</p>
                    <p><strong>AI Reflection:</strong> {entry.aiResponse}</p>
                    <p><strong>Mood:</strong> {entry.mood}</p>
                    <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="insights-preview">
            <h3>Mood Insights Preview</h3>
            {insights ? (
              <div>
                <p><strong>Summary:</strong> {insights.summary}</p>
                <p><strong>Mood Counts:</strong> {Object.entries(insights.moodCounts).map(([mood, count]) => `${mood}: ${count}`).join(', ')}</p>
                <a href="/insights">View Full Insights</a>
              </div>
            ) : (
              <p>Loading insights...</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
