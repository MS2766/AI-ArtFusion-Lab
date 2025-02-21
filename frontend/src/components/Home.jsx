import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <div className="logo-container">
          <Link to="/">
            <img src="/logo.png" alt="Logo" className="logo" />
          </Link>
          <h1 className="site-title">Creative Canvas</h1>
        </div>
        <nav className="home-nav">
          <Link to="/art-generator">Art Generation</Link>
          <Link to="/style-transfer">Style Transfer</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>
      <main className="home-main">
        <p>Transform your imagination into reality with Creative Canvas.</p>
      </main>
    </div>
  );
}

export default Home;