import { useState, useEffect } from 'react';
import { getUserAnalytics } from '../services/api';

const UserAnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserAnalytics();
  }, []);

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserAnalytics();
      console.log('User analytics data:', data);
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching user analytics:', err);
      setError('Failed to load your analytics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const styles = {
    container: {
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1.5rem',
    },
    statGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    statCard: {
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#4f46e5',
      marginBottom: '0.5rem',
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
      textAlign: 'center',
    },
    chartContainer: {
      marginTop: '2rem',
      height: '300px',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1rem',
      marginTop: '2rem',
    },
    tableContainer: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '0.75rem',
      textAlign: 'left',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#1f2937',
      borderBottom: '1px solid #e5e7eb',
    },
    td: {
      padding: '0.75rem',
      fontSize: '0.875rem',
      color: '#4b5563',
      borderBottom: '1px solid #e5e7eb',
    },
    noData: {
      textAlign: 'center',
      padding: '2rem',
      color: '#6b7280',
    },
    error: {
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '1.5rem',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px',
    },
    loadingText: {
      fontSize: '1rem',
      color: '#6b7280',
    },
    noAnalytics: {
      textAlign: 'center',
      padding: '2rem',
      color: '#6b7280',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem',
      marginTop: '1rem',
    },
    refreshButton: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#ffffff',
      backgroundColor: '#4f46e5',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h2 style={{...styles.title, marginBottom: 0}}>Your Analytics</h2>
        <button 
          style={styles.refreshButton} 
          onClick={fetchUserAnalytics}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>
      
      {loading && (
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading your analytics data...</p>
        </div>
      )}
      
      {error && <div style={styles.error}>{error}</div>}
      
      {!loading && !error && !analyticsData && (
        <div style={styles.noAnalytics}>
          <p>You don't have any analytics data yet.</p>
          <p>Send some messages to start tracking your SMS activity.</p>
        </div>
      )}
      
      {!loading && !error && analyticsData && (
        <>
          <div style={styles.statGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{analyticsData.totalSMS || 0}</div>
              <div style={styles.statLabel}>Total SMS Sent</div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statValue}>{analyticsData.successfulSMS || 0}</div>
              <div style={styles.statLabel}>Successfully Delivered</div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statValue}>{analyticsData.failedSMS || 0}</div>
              <div style={styles.statLabel}>Failed Deliveries</div>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.statValue}>{analyticsData.deliveryRate || '0%'}</div>
              <div style={styles.statLabel}>Delivery Success Rate</div>
            </div>
          </div>
          
          <h3 style={styles.sectionTitle}>Recent Activity</h3>
          
          <div style={styles.tableContainer}>
            {analyticsData.recentActivity && analyticsData.recentActivity.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Phone Number</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.recentActivity.map((activity, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{activity.date}</td>
                      <td style={styles.td}>{activity.phoneNumber}</td>
                      <td style={styles.td}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          backgroundColor: activity.status === 'Delivered' ? '#d1fae5' : '#fee2e2',
                          color: activity.status === 'Delivered' ? '#065f46' : '#b91c1c',
                        }}>
                          {activity.status}
                        </span>
                      </td>
                      <td style={styles.td}>{activity.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.noData}>No recent activity to display</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserAnalyticsPage;