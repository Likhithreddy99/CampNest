import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Compass, BookOpen, Star, MapPin } from 'lucide-react';

const Home = () => {
  const [data, setData] = useState({ trendingCamps: [], latestStories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api', { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="container" style={styles.loading}>Loading...</div>;

  return (
    <div className="container" style={styles.main}>
      <header style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Find Your Next Getaway</h1>
          <p style={styles.subtitle}>Discover and share the best campsites and camping stories across India.</p>
          <div style={styles.heroBtns}>
            <Link to="/camps" className="btn btn-primary">Find Campsites</Link>
            <Link to="/stories" className="btn btn-outline">Read Stories</Link>
          </div>
        </div>
      </header>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2><Compass size={24} /> Trending Campsites</h2>
          <Link to="/camps" style={styles.viewAll}>View all</Link>
        </div>
        <div style={styles.grid}>
          {data.trendingCamps.map(camp => (
            <Link to={`/camps/${camp._id}`} key={camp._id} className="card" style={styles.card}>
              <div 
                style={{...styles.cardImg, backgroundImage: `url(${camp.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800'})`}} 
              />
              <div style={styles.cardBody}>
                <h3>{camp.title}</h3>
                <p style={styles.location}><MapPin size={14} /> {camp.location}</p>
                <p style={styles.rating}><Star size={14} fill="currentColor" /> {camp.averageRating?.toFixed(1) || 'No ratings'}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2><BookOpen size={24} /> Latest Stories</h2>
          <Link to="/stories" style={styles.viewAll}>View all</Link>
        </div>
        <div style={styles.grid}>
          {data.latestStories.map(story => (
            <Link to={`/stories/${story._id}`} key={story._id} className="card" style={styles.card}>
              <div 
                style={{...styles.cardImg, backgroundImage: `url(${story.coverImageUrl || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800'})`}} 
              />
              <div style={styles.cardBody}>
                <h3>{story.title}</h3>
                <p style={styles.author}>by {story.author.username}</p>
                <div style={styles.tags}>
                  {story.tags.slice(0, 2).map(tag => (
                    <span key={tag} style={styles.tag}>#{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  main: {
    padding: '2rem 1rem'
  },
  loading: {
    padding: '4rem 1rem',
    textAlign: 'center',
    color: 'var(--text-muted)'
  },
  hero: {
    background: 'linear-gradient(135deg, rgba(211, 35, 35, 0.05) 0%, rgba(211, 35, 35, 0) 100%)',
    padding: '4rem 2rem',
    borderRadius: '1.5rem',
    marginBottom: '3rem',
    textAlign: 'center'
  },
  heroContent: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 800,
    marginBottom: '1rem',
    letterSpacing: '-1px'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-muted)',
    marginBottom: '2rem'
  },
  heroBtns: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  section: {
    marginBottom: '4rem'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem'
  },
  viewAll: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--primary)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    display: 'block'
  },
  cardImg: {
    height: '180px',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  cardBody: {
    padding: '1rem'
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: '0.4rem'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--primary)',
    marginTop: '0.4rem'
  },
  author: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    marginTop: '0.4rem'
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.8rem'
  },
  tag: {
    fontSize: '0.75rem',
    color: 'var(--primary)',
    fontWeight: 500
  }
};

export default Home;
