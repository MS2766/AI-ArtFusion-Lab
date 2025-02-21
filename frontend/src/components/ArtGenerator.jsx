import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/ArtGenerator.css';

function ArtGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imagePath, setImagePath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateArt = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/art-generation/', { prompt });
      setImagePath(response.data.image_path);
    } catch (error) {
      setError('Error generating art');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home art-generator">
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
        <div className="main-content art-generator-content">
          <h2>Art Generation</h2>
          <input
            type="text"
            placeholder="Enter a prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button onClick={generateArt} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Art'}
          </button>
          {error && <p className="error">{error}</p>}
          {imagePath && (
            <div className="image-container">
              <img src={`http://127.0.0.1:8000/${imagePath}`} alt="Generated Art" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ArtGenerator;