import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.password2) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/auth/register', formData, { withCredentials: true });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={styles.container}>
      <form onSubmit={handleSubmit} className="card" style={styles.form}>
        <div style={styles.header}>
          <div style={styles.icon}><UserPlus size={24} /></div>
          <h2>Create Account</h2>
          <p>Join our camping community</p>
        </div>
        
        {error && <div style={styles.alert}>{error}</div>}
        
        <div style={styles.field}>
          <label style={styles.label}>Username</label>
          <input 
            name="username"
            className="input" 
            value={formData.username} 
            onChange={handleChange} 
            required 
            placeholder="johndoe"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email Address</label>
          <input 
            name="email"
            type="email" 
            className="input" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            placeholder="name@example.com"
          />
        </div>
        
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <input 
            name="password"
            type="password" 
            className="input" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            placeholder="Min 6 characters"
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Confirm Password</label>
          <input 
            name="password2"
            type="password" 
            className="input" 
            value={formData.password2} 
            onChange={handleChange} 
            required 
            placeholder="Repeat password"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" style={styles.btn} disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
        
        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
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
    maxWidth: '440px',
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

export default Register;
