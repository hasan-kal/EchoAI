import React from 'react';
import './DashboardPage.css';

const DashboardPage = () => {
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
        <p>Main content area placeholder.</p>
      </main>
    </div>
  );
};

export default DashboardPage;
