import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { useAuth } from '../AuthContext';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/stories/${id}`, { withCredentials: true });
        setStory(res.data);
      } catch (err) {
        console.error('Error fetching story:', err);
        navigate('/stories');
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  if (loading) return <div className="container" style={styles.loading}>Loading story...</div>;
  if (!story) return null;

  return (
    <div className="container" style={styles.main}>
      <Link to="/stories" style={styles.backLink}><ArrowLeft size={16} /> Back to stories</Link>
      
      <article style={styles.article}>
        {story.coverImageUrl && (
          <img src={story.coverImageUrl} alt={story.title} style={styles.coverImg} />
        )}
        
        <header style={styles.header}>
          <h1 style={styles.title}>{story.title}</h1>
          <div style={styles.meta}>
            <div style={styles.metaItem}>
              <div style={styles.avatar}>{story.author.username[0].toUpperCase()}</div>
              <span>{story.author.username}</span>
            </div>
            <div style={styles.metaItem}><Calendar size={16} /> {new Date(story.createdAt).toLocaleDateString()}</div>
          </div>
        </header>

        <div style={styles.content}>
          {story.content.split('\n').map((para, i) => (
            <p key={i} style={styles.paragraph}>{para}</p>
          ))}
        </div>

        <footer style={styles.footer}>
          <div style={styles.tags}>
            {story.tags.map(tag => (
              <span key={tag} style={styles.tag}><Tag size={12} /> {tag}</span>
            ))}
          </div>
          <button className="btn btn-outline" onClick={() => alert('Link copied to clipboard!')}><Share2 size={16} /> Share Story</button>
        </footer>
      </article>

      {user && user._id === story.author._id && (
        <div style={styles.actions}>
          <Link to={`/stories/${story._id}/edit`} className="btn btn-outline">Edit Story</Link>
        </div>
      )}
    </div>
  );
};

const styles = {
  main: {
    padding: '3rem 1rem',
    maxWidth: '800px'
  },
  loading: {
    padding: '4rem 1rem',
    textAlign: 'center'
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginBottom: '2rem'
  },
  article: {
    background: 'var(--surface)',
    borderRadius: '1.5rem',
    overflow: 'hidden',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)'
  },
  coverImg: {
    width: '100%',
    height: '400px',
    objectFit: 'cover'
  },
  header: {
    padding: '2.5rem 2.5rem 1.5rem'
  },
  title: {
    fontSize: '2.5rem',
    lineHeight: 1.1,
    marginBottom: '1.5rem',
    letterSpacing: '-1px'
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    color: 'var(--text-muted)',
    fontSize: '0.9rem'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.8rem'
  },
  content: {
    padding: '0 2.5rem 2.5rem',
    lineHeight: 1.8,
    color: '#333',
    fontSize: '1.1rem'
  },
  paragraph: {
    marginBottom: '1.5rem'
  },
  footer: {
    padding: '1.5rem 2.5rem',
    borderTop: '1px solid var(--border)',
    background: '#fafafa',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tags: {
    display: 'flex',
    gap: '0.6rem',
    flexWrap: 'wrap'
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    background: '#fff',
    padding: '0.3rem 0.6rem',
    borderRadius: '6px',
    border: '1px solid var(--border)'
  },
  actions: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'center'
  }
};

export default StoryDetail;
