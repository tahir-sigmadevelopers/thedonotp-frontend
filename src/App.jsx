import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UserAnalyticsPage from './pages/UserAnalyticsPage';
import LoginForm from './components/LoginForm';

// Add keyframes animations
const keyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Define styles object for inline styling
const styles = {
  appContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
  },
  cardContainer: {
    width: '100%',
    maxWidth: '800px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '2rem',
    width: '100%',
    animation: 'fadeIn 0.5s ease-out',
  },
  textCenter: {
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  successIcon: {
    width: '4rem',
    height: '4rem',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  icon: {
    width: '2.5rem',
    height: '2.5rem',
    stroke: '#10b981',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    textAlign: 'center',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  navButton: {
    padding: '0.5rem 1rem',
    margin: '0 0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    border: 'none',
    transition: 'all 0.2s ease',
  },
  navButtonActive: {
    backgroundColor: '#4f46e5',
    color: 'white',
  },
};

// Protected route component
const ProtectedRoute = ({ element, isAdmin, isAuthenticated }) => {
  // If admin route and user is not admin, redirect to home
  if (isAdmin) {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData.role || userData.role !== 'admin') {
      return <Navigate to="/" />;
    }
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return element;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const token = localStorage.getItem('userToken');
    
    if (storedUserData && token) {
      setUserData(JSON.parse(storedUserData));
      setIsAuthenticated(true);
    }
  }, []);
  
  // Handle login success
  const handleLoginSuccess = (data) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  // Add style tag with keyframes to the document head on component mount
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = keyframes;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <BrowserRouter>
      <div style={styles.appContainer}>
        <div style={styles.cardContainer}>
          {isAuthenticated && <Navbar isAdmin={userData?.role === 'admin'} />}
          
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <LoginForm onLoginSuccess={handleLoginSuccess} />
            } />
            <Route path="/" element={
              <ProtectedRoute 
                element={<UserPage />} 
                isAuthenticated={isAuthenticated} 
                isAdmin={false} 
              />
            } />
            <Route path="/user-analytics" element={
              <ProtectedRoute 
                element={<UserAnalyticsPage />} 
                isAuthenticated={isAuthenticated} 
                isAdmin={false} 
              />
            } />
            <Route path="/admin" element={
              <ProtectedRoute 
                element={<AdminPage />} 
                isAuthenticated={isAuthenticated} 
                isAdmin={true} 
              />
            } />
            <Route path="/analytics" element={
              <ProtectedRoute 
                element={<AnalyticsPage />} 
                isAuthenticated={isAuthenticated} 
                isAdmin={true} 
              />
            } />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
