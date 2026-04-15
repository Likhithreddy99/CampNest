import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { User, Compass, BookOpen, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ camps: [], stories: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/profile', { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) return <div className="container" style={styles.loading}>Loading profile...</div>;

  return (
    <div className="container" style={styles.main}>
      <header style={styles.header}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user.username[0].toUpperCase()}</div>
          <div>
            <h1>{user.username}</h1>
            <p style={styles.email}>{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline"><LogOut size={16} /> Logout</button>
      </header>

      <div style={styles.tabs}>
        <div style={styles.tabActive}>Contributions</div>
      </div>

      <div style={styles.grid}>
        <section>
          <div style={styles.sectionTitle}><Compass size={20} /> My Campsites ({data.camps.length})</div>
          <div style={styles.list}>
            {data.camps.map(camp => (
              <Link to={`/camps/${camp._id}`} key={camp._id} className="card" style={styles.item}>
                <img src={camp.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200'} style={styles.itemThumb} />
                <div style={styles.itemInfo}>
                  <h4>{camp.title}</h4>
                  <p>{camp.location}</p>
                </div>
              </Link>
            ))}
            {data.camps.length === 0 && <p style={styles.empty}>No campsites added yet.</p>}
          </div>
        </section>

        <section>
          <div style={styles.sectionTitle}><BookOpen size={20} /> My Stories ({data.stories.length})</div>
          <div style={styles.list}>
            {data.stories.map(story => (
              <Link to={`/stories/${story._id}`} key={story._id} className="card" style={styles.item}>
                <img src={story.coverImageUrl || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=200'} style={styles.itemThumb} />
                <div style={styles.itemInfo}>
                  <h4>{story.title}</h4>
                  <p>{new Date(story.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
            {data.stories.length === 0 && <p style={styles.empty}>No stories shared yet.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

const styles = {
  main: {
    padding: '3rem 1rem'
  },
  loading: {
    padding: '4rem 1rem',
    textAlign: 'center'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'var(--primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 800
  },
  email: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem'
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid var(--border)',
    marginBottom: '2rem'
  },
  tabActive: {
    padding: '1rem 2rem',
    borderBottom: '2px solid var(--primary)',
    color: 'var(--primary)',
    fontWeight: 600
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    fontSize: '1.1rem'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem',
    textDecoration: 'none',
    color: 'inherit'
  },
  itemThumb: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  itemInfo: {
    flex: 1
  },
  empty: {
    padding: '2rem',
    textAlign: 'center',
    color: 'var(--text-muted)',
    background: '#f9f9f9',
    borderRadius: '10px',
    fontSize: '0.9rem'
  }
};

export default Profile;
