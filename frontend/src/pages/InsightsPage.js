import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const InsightsPage = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8000/api';

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const data = insights ? Object.entries(insights.moodCounts).map(([mood, count]) => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1),
    value: count,
  })) : [];

  return (
    <div className="insights">
      <h2>Mood Insights</h2>
      {loading ? (
        <p>Loading insights...</p>
      ) : insights ? (
        <>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="summary">
            <h3>AI Summary</h3>
            <p>{insights.summary}</p>
          </div>
        </>
      ) : (
        <p>No insights available. Start journaling to see your mood analysis!</p>
      )}
    </div>
  );
};

export default InsightsPage;
