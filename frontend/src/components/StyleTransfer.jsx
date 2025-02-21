import React, { useState } from 'react';
import axios from 'axios';
import '../styles/StyleTransfer.css';

function StyleTransfer() {
  const [contentImage, setContentImage] = useState(null);
  const [styleImage, setStyleImage] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const transferStyle = async () => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('content_image', contentImage);
    formData.append('style_image', styleImage);
    try {
      const response = await axios.post('http://127.0.0.1:8000/style-transfer/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImagePath(response.data.image_path);
    } catch (error) {
      setError('Error transferring style');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home style-transfer">
      <header className="home-header">
        <div className="logo-container">
          <div 
            onClick={() => navigateTo('/')} 
            style={{cursor: 'pointer'}}
          >
            <img src="/logo.png" alt="Logo" className="logo" />
          </div>
          <h1 className="site-title">Creative Canvas</h1>
        </div>
        <nav className="home-nav">
          <div onClick={() => navigateTo('/art-generator')}>Art Generation</div>
          <div onClick={() => navigateTo('/style-transfer')}>Style Transfer</div>
          <div onClick={() => navigateTo('/login')}>Login</div>
        </nav>
      </header>
      <main className="home-main">
        <div className="main-content style-transfer-content">
          <h2>Style Transfer</h2>
          <input type="file" onChange={(e) => setContentImage(e.target.files[0])} />
          <input type="file" onChange={(e) => setStyleImage(e.target.files[0])} />
          <button onClick={transferStyle} disabled={loading}>
            {loading ? 'Transferring...' : 'Transfer Style'}
          </button>
          {error && <p className="error">{error}</p>}
          {imagePath && (
            <div className="image-container">
              <img src={`http://127.0.0.1:8000${imagePath}`} alt="Styled Image" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StyleTransfer;