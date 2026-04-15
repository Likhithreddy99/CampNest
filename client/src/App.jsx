import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Camps from './pages/Camps';
import Stories from './pages/Stories';
import CampDetail from './pages/CampDetail';
import StoryDetail from './pages/StoryDetail';
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot';

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div style={styles.loading}>Initializing CampNest...</div>;
  }

  return (
    <Router>
      <Navbar />
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/camps" element={<Camps />} />
          <Route path="/camps/:id" element={<CampDetail />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:id" element={<StoryDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Chatbot />
      <footer style={styles.footer}>
        <div className="container">
          <p>© {new Date().getFullYear()} CampNest Community. Explore responsibly.</p>
        </div>
      </footer>
    </Router>
  );
};

const styles = {
  loading: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: 'var(--primary)'
  },
  main: {
    minHeight: 'calc(100vh - 64px - 80px)'
  },
  footer: {
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid var(--border)',
    background: '#fff',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    textAlign: 'center'
  }
};

export default App;
