import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <form onSubmit={handleSubmit} className="card" style={styles.form}>
        <div style={styles.header}>
          <div style={styles.icon}><LogIn size={24} /></div>
          <h2>Welcome Back</h2>
          <p>Login to your CampNest account</p>
        </div>
        
        {error && <div style={styles.alert}>{error}</div>}
        
        <div style={styles.field}>
          <label style={styles.label}>Email Address</label>
          <input 
            type="email" 
            className="input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="name@example.com"
          />
        </div>
        
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input 
            type="password" 
            className="input" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="••••••••"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={styles.btn} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem 1rem'
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '2.5rem'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  icon: {
    width: '48px',
    height: '48px',
    background: 'rgba(211, 35, 35, 0.1)',
    color: 'var(--primary)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem'
  },
  alert: {
    padding: '0.75rem',
    background: '#fceeee',
    color: '#a50e0e',
    borderRadius: '6px',
    fontSize: '0.85rem',
    marginBottom: '1.5rem',
    border: '1px solid #f9d6d6'
  },
  field: {
    marginBottom: '1.25rem'
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: 'var(--text-muted)'
  },
  btn: {
    width: '100%',
    justifyContent: 'center',
    height: '44px',
    marginTop: '1rem'
  },
  footer: {
    textAlign: 'center',
    marginTop: '2rem',
    fontSize: '0.9rem',
    color: 'var(--text-muted)'
  },
  link: {
    color: 'var(--primary)',
    fontWeight: 600
  }
};

export default Login;
