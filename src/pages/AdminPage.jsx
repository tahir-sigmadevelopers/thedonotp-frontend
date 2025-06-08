import { useState } from 'react';
import BulkSmsForm from '../components/BulkSmsForm';
import UserManagement from '../components/UserManagement';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Styles
  const styles = {
    container: {
      padding: '1rem',
    },
    tabContainer: {
      display: 'flex',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '1.5rem',
    },
    tab: {
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4b5563',
      borderBottom: '2px solid transparent',
    },
    activeTab: {
      color: '#4f46e5',
      borderBottom: '2px solid #4f46e5',
    }
  };

  return (
    <div style={styles.container}>      
      <div style={styles.tabContainer}>
        <div 
          style={{ 
            ...styles.tab, 
            ...(activeTab === 'users' ? styles.activeTab : {}) 
          }}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </div>
        <div 
          style={{ 
            ...styles.tab, 
            ...(activeTab === 'bulk-sms' ? styles.activeTab : {}) 
          }}
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