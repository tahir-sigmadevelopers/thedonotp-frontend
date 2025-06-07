import { NavLink } from 'react-router-dom';

const styles = {
  navbar: {
    backgroundColor: '#ffffff',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    marginBottom: '2rem',
    borderRadius: '0.5rem',
    marginRight: '6rem',
    width: '880px',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '1200px',
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
  }
};

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <NavLink to="/" style={styles.logo}>
         Don OTP System <span style={{fontSize: '0.8rem', color: '#4b5563'}}>Shiddat se bheja gaya, Don ka code.</span>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 