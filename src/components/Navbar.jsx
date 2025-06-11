import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';
import { useState, useEffect } from 'react';

// Add responsive styles
const responsiveStyles = `
  @media (max-width: 768px) {
    .navbar {
      padding: 0.5rem !important;
      width: 100% !important;
      margin-right: 0 !important;
      margin-bottom: 0.5rem !important;
    }
    .nav-container {
      flex-direction: column !important;
      padding-right: 0 !important;
      width: 100% !important;
    }
    .nav-links {
      flex-direction: column !important;
      width: 100% !important;
      margin-top: 0.5rem !important;
      gap: 0.25rem !important;
    }
    .nav-link {
      width: 100% !important;
      margin: 0 !important;
      text-align: center !important;
      box-sizing: border-box !important;
      padding: 0.35rem 0.5rem !important;
    }
    .logout-button {
      width: 100% !important;
      margin-left: 0 !important;
      margin-top: 0.25rem !important;
      padding: 0.35rem 0.5rem !important;
    }
    .logo-container {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 100% !important;
    }
  }
`;

const styles = {
  navbar: {
    backgroundColor: 'black',
    padding: '0.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    marginBottom: '1rem',
    borderRadius: '0.5rem',
    marginRight: '0rem',
    width: '100%',
    maxWidth: '866px',
    boxSizing: 'border-box',
    className: 'navbar',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    className: 'nav-container',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 'auto',
    className: 'logo-container',
  },
  logo: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#4f46e5',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '0.5rem',
    className: 'nav-links',
  },
  navLink: {
    padding: '0.35rem 0.75rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    borderRadius: '0.35rem',
    cursor: 'pointer',
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: 'none',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    textAlign: 'center',
    className: 'nav-link',
  },
  activeLink: {
    backgroundColor: '#4f46e5',
    color: 'white',
  },
  donImage: {
    width: '30px',
    height: '30px',
    marginLeft: '0.25rem',
    borderRadius: '50%',
    marginRight: '0.25rem',
  },
  donText: {
    fontSize: '0.7rem',
    color: 'white',
    marginLeft: '0.3rem',
    fontWeight: 'italic',
    fontFamily: 'Roboto',
  },
  changaText: {
    fontSize: '0.7rem',
    color: 'red',
    fontWeight: 'italic',
    fontFamily: 'Roboto',
  },
  pangaText: {
    fontSize: '0.7rem',
    color: 'red',
    fontWeight: 'italic',
    fontFamily: 'Roboto',
  },
  logoutButton: {
    padding: '0.35rem 0.75rem',
    fontSize: '0.8rem',
    fontWeight: '500',
    borderRadius: '0.35rem',
    cursor: 'pointer',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    marginLeft: '0.5rem',
    className: 'logout-button',
  }
};

const Navbar = ({ isAdmin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    window.location.reload(); // Force reload to clear state
  };

  // Add style tag with responsive styles
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = responsiveStyles;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <nav style={styles.navbar} className="navbar">
      <div style={styles.navContainer} className="nav-container">
        <div style={styles.logoContainer} className="logo-container">
          <img src="/don.png" alt="Don OTP" style={styles.donImage} />
          <NavLink to="/" style={styles.logo}>
            OTP System
          </NavLink>
        </div>
        <div style={styles.navLinks} className="nav-links">
          <NavLink 
            to="/" 
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.activeLink : {})
            })}
            className="nav-link"
            end
          >
            User
          </NavLink>
          
          <NavLink 
            to="/user-analytics" 
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.activeLink : {})
            })}
            className="nav-link"
          >
            My Analytics
          </NavLink>
          
          {isAdmin && (
            <>
              <NavLink 
                to="/admin" 
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.activeLink : {})
                })}
                className="nav-link"
              >
                Admin
              </NavLink>
              <NavLink 
                to="/analytics" 
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.activeLink : {})
                })}
                className="nav-link"
              >
                Analytics
              </NavLink>
            </>
          )}
          
          <button 
            style={styles.logoutButton}
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 