import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Star, Calendar, User, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../AuthContext';

const CampDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCamp();
  }, [id]);

  const fetchCamp = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/camps/${id}`, { withCredentials: true });
      setData(res.data);
    } catch (err) {
      console.error('Error fetching camp:', err);
      navigate('/camps');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`http://localhost:3000/api/camps/${id}/reviews`, review, { withCredentials: true });
      setReview({ rating: 5, comment: '' });
      fetchCamp();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container" style={styles.loading}>Loading campsite details...</div>;
  if (!data) return null;

  const { camp, reviews } = data;

  return (
    <div className="container" style={styles.main}>
      <div style={styles.content}>
        <div style={{...styles.hero, backgroundImage: `url(${camp.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200'})`}}>
          <div style={styles.heroOverlay}>
            <h1>{camp.title}</h1>
            <p><MapPin size={18} /> {camp.location}</p>
          </div>
        </div>

        <div style={styles.layout}>
          <div style={styles.info}>
            <section style={styles.section}>
              <h2>About this campsite</h2>
              <p style={styles.description}>{camp.description}</p>
              <div style={styles.meta}>
                <div style={styles.metaItem}><User size={16} /> Hosted by {camp.author.username}</div>
                <div style={styles.metaItem}><Calendar size={16} /> listed on {new Date(camp.createdAt).toLocaleDateString()}</div>
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2>Reviews ({reviews.length})</h2>
                <div style={styles.avgRating}><Star size={18} fill="currentColor" /> {camp.averageRating?.toFixed(1) || '0.0'}</div>
              </div>

              {user ? (
                <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
                  <h3>Add a Review</h3>
                  <div style={styles.ratingSelect}>
                    {[1, 2, 3, 4, 5].map(num => (
                      <button 
                        key={num} 
                        type="button" 
                        onClick={() => setReview({...review, rating: num})}
                        style={{...styles.starBtn, color: num <= review.rating ? 'var(--primary)' : '#ccc'}}
                      >
                        <Star size={24} fill={num <= review.rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    className="input" 
                    placeholder="Share your experience..." 
                    style={styles.textarea}
                    value={review.comment}
                    onChange={(e) => setReview({...review, comment: e.target.value})}
                    required
                  />
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    <Send size={16} /> {submitting ? 'Posting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div style={styles.loginCard}>
                  <p>Want to leave a review? <Link to="/login" style={{color: 'var(--primary)', fontWeight: 600}}>Login here</Link></p>
                </div>
              )}

              <div style={styles.reviewsList}>
                {reviews.map(rev => (
                  <div key={rev._id} style={styles.reviewItem}>
                    <div style={styles.reviewHeader}>
                      <span style={styles.reviewer}>{rev.author.username}</span>
                      <div style={styles.reviewerRating}>
                        {Array.from({length: 5}).map((_, i) => (
                          <Star key={i} size={12} fill={i < rev.rating ? 'var(--primary)' : 'none'} color={i < rev.rating ? 'var(--primary)' : '#ccc'} />
                        ))}
                      </div>
                    </div>
                    <p style={styles.reviewText}>{rev.comment}</p>
                    <span style={styles.reviewDate}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside style={styles.sidebar}>
            <div className="card" style={styles.sidebarCard}>
              <h3>Location</h3>
              <p style={{marginTop: '0.5rem', color: 'var(--text-muted)'}}><MapPin size={14} /> {camp.location}</p>
              <div style={styles.tags}>
                {camp.tags.map(tag => (
                  <span key={tag} style={styles.tag}>#{tag}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const styles = {
  main: {
    padding: '2rem 1rem'
  },
  loading: {
    padding: '4rem 1rem',
    textAlign: 'center'
  },
  hero: {
    height: '400px',
    borderRadius: '1rem',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'flex-end',
    overflow: 'hidden',
    marginBottom: '2rem'
  },
  heroOverlay: {
    width: '100%',
    padding: '3rem 2rem',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    color: '#fff'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 300px',
    gap: '2.5rem'
  },
  section: {
    marginBottom: '3.5rem'
  },
  description: {
    fontSize: '1.05rem',
    lineHeight: 1.6,
    color: '#333',
    marginBottom: '1.5rem',
    whiteSpace: 'pre-wrap'
  },
  meta: {
    display: 'flex',
    gap: '1.5rem',
    padding: '1rem 0',
    borderTop: '1px solid var(--border)',
    color: 'var(--text-muted)',
    fontSize: '0.9rem'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem'
  },
  avgRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--primary)'
  },
  reviewForm: {
    background: '#fcfcfc',
    padding: '1.5rem',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    marginBottom: '2rem'
  },
  ratingSelect: {
    display: 'flex',
    gap: '0.5rem',
    margin: '1rem 0'
  },
  starBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0
  },
  textarea: {
    minHeight: '100px',
    marginBottom: '1rem',
    resize: 'vertical'
  },
  loginCard: {
    padding: '1.5rem',
    background: '#fcfcfc',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  reviewItem: {
    paddingBottom: '1.5rem',
    borderBottom: '1px solid var(--border)'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem'
  },
  reviewer: {
    fontWeight: 600,
    fontSize: '0.95rem'
  },
  reviewerRating: {
    display: 'flex',
    gap: '0.1rem'
  },
  reviewText: {
    fontSize: '0.95rem',
    color: '#444',
    marginBottom: '0.4rem'
  },
  reviewDate: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  sidebarCard: {
    padding: '1.5rem',
    position: 'sticky',
    top: '100px'
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: '1.5rem'
  },
  tag: {
    fontSize: '0.75rem',
    color: 'var(--primary)',
    background: 'rgba(211, 35, 35, 0.05)',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontWeight: 500
  }
};

export default CampDetail;
