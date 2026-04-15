import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Compass, BookOpen, User as UserIcon, LogOut, PlusCircle, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.container}>
        <Link to="/" style={styles.logo}>
          <Compass size={28} color="var(--primary)" />
          <span>CampNest</span>
        </Link>
        <div style={styles.links}>
          <Link to="/camps" style={styles.link}><Compass size={18} /> Camps</Link>
          <Link to="/stories" style={styles.link}><BookOpen size={18} /> Stories</Link>
          <form action="/search" method="GET" style={styles.search}>
            <input name="q" placeholder="Search..." className="input" style={styles.searchInput} />
          </form>
          {user ? (
            <div style={styles.userSection}>
              <Link to="/profile" style={styles.link}><UserIcon size={18} /> {user.username}</Link>
              <button onClick={handleLogout} className="btn btn-outline" style={styles.logoutBtn}><LogOut size={16} /></button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#fff',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    height: '64px',
    display: 'flex',
    alignItems: 'center'
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--text)'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-muted)'
  },
  search: {
    display: 'flex',
    alignItems: 'center'
  },
  searchInput: {
    height: '34px',
    padding: '0 0.75rem',
    width: '180px'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  logoutBtn: {
    padding: '0.3rem 0.6rem'
  }
};

export default Navbar;
