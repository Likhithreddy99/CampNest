import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapPin, Star, Plus } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Camps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/camps', { withCredentials: true });
        setCamps(res.data);
      } catch (err) {
        console.error('Error fetching camps:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCamps();
  }, []);

  if (loading) return <div className="container" style={styles.loading}>Loading campsites...</div>;

  return (
    <div className="container" style={styles.main}>
      <header style={styles.header}>
        <div>
          <h1>Explore Campsites</h1>
          <p>Find your next adventure from our community-curated list</p>
        </div>
        {user && (
          <Link to="/camps/new" className="btn btn-primary">
            <Plus size={18} /> Add Campsite
          </Link>
        )}
      </header>

      <div style={styles.grid}>
        {camps.map(camp => (
          <Link to={`/camps/${camp._id}`} key={camp._id} className="card" style={styles.card}>
            <div 
              style={{...styles.cardImg, backgroundImage: `url(${camp.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'})`}} 
            />
            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>{camp.title}</h3>
              <p style={styles.location}><MapPin size={14} /> {camp.location}</p>
              <p style={styles.description}>{camp.description.substring(0, 100)}...</p>
              <div style={styles.footer}>
                <p style={styles.rating}><Star size={14} fill="currentColor" /> {camp.averageRating?.toFixed(1) || '0.0'}</p>
                <p style={styles.author}>by {camp.author.username}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles = {
  main: {
    padding: '3rem 1rem'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '3rem'
  },
  loading: {
    padding: '4rem 1rem',
    textAlign: 'center'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '2rem'
  },
  card: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardImg: {
    height: '200px',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  cardBody: {
    padding: '1.25rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  cardTitle: {
    fontSize: '1.1rem',
    marginBottom: '0.4rem'
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginBottom: '0.75rem'
  },
  description: {
    fontSize: '0.9rem',
    color: '#555',
    lineHeight: 1.4,
    marginBottom: '1.25rem'
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid var(--border)'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--primary)'
  },
  author: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  }
};

export default Camps;
