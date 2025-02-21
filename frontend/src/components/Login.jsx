import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import '../styles/auth.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.access_token);
        setMessage('Login successful!');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 2000);
      } else {
        setMessage('Login failed: ' + data.detail);
      }
    } catch (error) {
      setMessage('Login failed: ' + error.message);
    }
  };

  return (
    <>
      <Link to="/" className="logo">
        <img src="/logo.png" alt="Logo" />
      </Link>
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          {message && <p>{message}</p>}
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <i className='bx bxs-user'></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className='bx bxs-lock'></i>
          </div>
          <div className="remember-forgot">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              /> Remember Me
            </label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <button type="submit" className="btn">Login</button>
          <div className="register-link">
            <p>Don't have an account? <Link to="/signup">Register</Link></p>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;