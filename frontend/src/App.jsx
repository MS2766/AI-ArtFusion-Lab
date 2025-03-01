import React, { createContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import ArtGenerator from './components/ArtGenerator';
import StyleTransfer from './components/StyleTransfer';
import Login from './components/Login';
import SignUp from './components/SignUp';
import './styles/App.css';

export const AuthContext = createContext();

function App() {
  const [auth, setAuth] = useState({ token: null, isAuthenticated: false });
  const login = (token) => {
    setAuth({ token, isAuthenticated: true });
  };

  const logout = () => {
    setAuth({ token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/art-generator"
            element={auth.isAuthenticated ? <ArtGenerator /> : <Navigate to="/login" />}
          />
          <Route
            path="/style-transfer"
            element={auth.isAuthenticated ? <StyleTransfer /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;