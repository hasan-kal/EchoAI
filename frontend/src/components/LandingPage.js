import React from 'react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <h1>EchoAI</h1>
        <div className="auth-buttons">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Signup</button>
        </div>
      </header>
      <main className="main-content">
        <h2>Welcome to EchoAI</h2>
        <p>Your AI-powered assistant for everything.</p>
      </main>
    </div>
  );
};

export default LandingPage;
