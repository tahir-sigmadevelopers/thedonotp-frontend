import { useState, useEffect } from 'react';
import BulkSmsForm from '../components/BulkSmsForm';
import UserManagement from '../components/UserManagement';

// Add responsive styles
const responsiveStyles = `
  @media (max-width: 640px) {
    .admin-container {
      padding: 0.5rem !important;
    }
    .admin-tab {
      padding: 0.4rem 0.5rem !important;
      font-size: 0.8rem !important;
    }
  }
`;

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Add style tag with responsive styles
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = responsiveStyles;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Styles
  const styles = {
    container: {
      padding: '1rem',
      boxSizing: 'border-box',
      width: '100%',
    },
    tabContainer: {
      display: 'flex',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '1rem',
      width: '100%',
    },
    tab: {
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4b5563',
      borderBottom: '2px solid transparent',
      textAlign: 'center',
      flex: 1,
    },
    activeTab: {
      color: '#4f46e5',
      borderBottom: '2px solid #4f46e5',
    }
  };

  return (
    <div style={styles.container} className="admin-container">      
      <div style={styles.tabContainer}>
        <div 
          style={{ 
            ...styles.tab, 
            ...(activeTab === 'users' ? styles.activeTab : {}) 
          }}
          className="admin-tab"
          onClick={() => setActiveTab('users')}
        >
          User Management
        </div>
        <div 
          style={{ 
            ...styles.tab, 
            ...(activeTab === 'bulk-sms' ? styles.activeTab : {}) 
          }}
          className="admin-tab"
          onClick={() => setActiveTab('bulk-sms')}
        >
          Bulk SMS
        </div>
      </div>
      
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'bulk-sms' && <BulkSmsForm />}
    </div>
  );
};

export default AdminPage; 