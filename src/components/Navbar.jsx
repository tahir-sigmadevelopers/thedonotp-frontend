import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

const styles = {
  navbar: {
    backgroundColor: 'black',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    marginBottom: '2rem',
    borderRadius: '0.5rem',
    marginRight: '0rem',
    width: '866px',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '900px',
    margin: '0 auto',
    paddingRight: '6rem',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#4f46e5',
    marginRight: 'auto',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
  },
  navLink: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: 'none',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  activeLink: {
    backgroundColor: '#4f46e5',
    color: 'white',
  },
  donImage: {
    width: '50px',
    height: '50px',
    marginLeft: '1rem',
    borderRadius: '50%',
    marginRight: '1rem',
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
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    marginLeft: '1rem',
  }
};

const Navbar = ({ isAdmin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    window.location.reload(); // Force reload to clear state
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <img src="/don.png" alt="Don OTP" style={styles.donImage} />
        <NavLink to="/" style={styles.logo}>
         Don OTP  <span style={styles.donText}>Don se <span style={styles.pangaText}>Panga</span> ❌ = <span style={styles.changaText}>Maut ko Seti </span> <span style={{fontSize: '1rem'}}> ✅</span> . <span style={{fontSize: '2rem'}}>😮‍💨⚰️</span></span>
        </NavLink>
        <div style={styles.navLinks}>
          <NavLink 
            to="/" 
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.activeLink : {})
            })}
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
              >
                Admin
              </NavLink>
              <NavLink 
                to="/analytics" 
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.activeLink : {})
                })}
              >
                Analytics
              </NavLink>
            </>
          )}
          
          <button 
            style={styles.logoutButton}
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