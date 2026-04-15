import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BookOpen, Plus, Tag } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/stories', { withCredentials: true });
        setStories(res.data);
      } catch (err) {
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) return <div className="container" style={styles.loading}>Loading stories...</div>;

  return (
    <div className="container" style={styles.main}>
      <header style={styles.header}>
        <div>
          <h1>Camping Stories</h1>
          <p>Read about adventures, tips, and experiences from fellow campers</p>
        </div>
        {user && (
          <Link to="/stories/new" className="btn btn-primary">
            <Plus size={18} /> share Story
          </Link>
        )}
      </header>

      <div style={styles.grid}>
        {stories.map(story => (
          <Link to={`/stories/${story._id}`} key={story._id} className="card" style={styles.card}>
            <div 
              style={{...styles.cardImg, backgroundImage: `url(${story.coverImageUrl || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800'})`}} 
            />
            <div style={styles.cardBody}>
              <h3 style={styles.cardTitle}>{story.title}</h3>
              <p style={styles.author}>By {story.author.username} • {new Date(story.createdAt).toLocaleDateString()}</p>
              <p style={styles.content}>{story.content.substring(0, 120)}...</p>
              <div style={styles.footer}>
                <div style={styles.tags}>
                  {story.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={styles.tag}><Tag size={12} /> {tag}</span>
                  ))}
                </div>
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem'
  },
  card: {
    display: 'flex',
    flexDirection: 'column'
  },
  cardImg: {
    height: '180px',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  cardBody: {
    padding: '1.5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  cardTitle: {
    fontSize: '1.2rem',
    marginBottom: '0.4rem'
  },
  author: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '1rem'
  },
  content: {
    fontSize: '0.9rem',
    color: '#444',
    lineHeight: 1.5,
    marginBottom: '1.5rem'
  },
  footer: {
    marginTop: 'auto'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    fontSize: '0.7rem',
    background: '#f0f0f0',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    color: 'var(--text-muted)'
  }
};

export default Stories;
