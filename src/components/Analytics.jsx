import { useState, useEffect } from 'react';
import { getSMSAnalytics, getDailySMSCount } from '../services/api';

// Add responsive styles
const responsiveStyles = `
  @media (max-width: 640px) {
    .analytics-card {
      padding: 1rem !important;
      padding-right: 1rem !important;
      border-radius: 0.5rem !important;
      margin-bottom: 1rem !important;
    }
    .analytics-title {
      font-size: 1.25rem !important;
      margin-bottom: 1rem !important;
    }
    .analytics-grid {
      grid-template-columns: 1fr !important;
      gap: 0.75rem !important;
    }
    .stat-card {
      padding: 1rem !important;
    }
    .stat-title {
      font-size: 0.8rem !important;
    }
    .stat-value {
      font-size: 1.25rem !important;
    }
    .stat-subvalue {
      font-size: 0.75rem !important;
    }
    .table-container {
      margin-top: 1rem !important;
    }
    .table-header, .table-cell {
      padding: 0.5rem !important;
      font-size: 0.75rem !important;
    }
  }
`;

// Define styles object for inline styling
const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '1.5rem',
    width: '100%',
    marginBottom: '2rem',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
    width: '100%',
  },
  statCard: {
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    padding: '1.25rem',
    textAlign: 'center',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  },
  statTitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
  },
  statSubValue: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '2rem',
  },
  errorText: {
    textAlign: 'center',
    color: '#ef4444',
    padding: '1rem',
  },
  refreshButton: {
    display: 'block',
    margin: '1rem auto',
    padding: '0.5rem 1rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  tableContainer: {
    marginTop: '2rem',
    overflowX: 'auto',
    width: '100%',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    textAlign: 'left',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
  },
  tableCell: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.875rem',
    color: '#1f2937',
  },
  tableCellSuccess: {
    color: '#10b981',
  },
  tableCellError: {
    color: '#ef4444',
  }
};

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add style tag with responsive styles
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = responsiveStyles;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch analytics data
      const analyticsResponse = await getSMSAnalytics();
      setAnalytics(analyticsResponse.data);
      
      // Fetch daily data
      const dailyResponse = await getDailySMSCount();
      setDailyData(dailyResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch analytics data');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // Format daily data for chart display
  const formatDailyData = () => {
    if (!dailyData) return [];
    
    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        sent: data.sent || 0,
        failed: data.failed || 0,
        total: data.total || 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14); // Last 14 days
  };
  
  const chartData = formatDailyData();
  
  return (
    <div>
      <div style={styles.card} className="analytics-card">
        <h2 style={styles.title} className="analytics-title">SMS Analytics Dashboard</h2>
        
        {loading && <p style={styles.loadingText}>Loading analytics data...</p>}
        
        {error && (
          <div style={styles.errorText}>
            {error}
            <button style={styles.refreshButton} onClick={fetchData}>
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && analytics && (
          <>
            <div style={styles.statsGrid} className="analytics-grid">
              {/* Today's Stats */}
              <div style={styles.statCard} className="stat-card">
                <h3 style={styles.statTitle} className="stat-title">Today</h3>
                <div style={styles.statValue} className="stat-value">{analytics.today.total}</div>
                <div style={styles.statSubValue} className="stat-subvalue">
                  {analytics.today.sent} sent, {analytics.today.failed} failed
                </div>
                <div style={styles.statSubValue} className="stat-subvalue">
                  Success Rate: {analytics.today.successRate}
                </div>
              </div>
              
              {/* Last 7 Days Stats */}
              <div style={styles.statCard} className="stat-card">
                <h3 style={styles.statTitle} className="stat-title">Last 7 Days</h3>
                <div style={styles.statValue} className="stat-value">{analytics.last7Days.total}</div>
                <div style={styles.statSubValue} className="stat-subvalue">
                  {analytics.last7Days.sent} sent, {analytics.last7Days.failed} failed
                </div>
                <div style={styles.statSubValue} className="stat-subvalue">
                  Success Rate: {analytics.last7Days.successRate}
                </div>
              </div>
              
              {/* This Month Stats */}
              <div style={styles.statCard} className="stat-card">
                <h3 style={styles.statTitle} className="stat-title">This Month</h3>
                <div style={styles.statValue} className="stat-value">{analytics.thisMonth.total}</div>
                <div style={styles.statSubValue} className="stat-subvalue">
                  {analytics.thisMonth.sent} sent, {analytics.thisMonth.failed} failed
                </div>
                <div style={styles.statSubValue} className="stat-subvalue">
                  Success Rate: {analytics.thisMonth.successRate}
                </div>
              </div>
              
              {/* All Time Stats */}
              <div style={styles.statCard} className="stat-card">
                <h3 style={styles.statTitle} className="stat-title">All Time</h3>
                <div style={styles.statValue} className="stat-value">{analytics.allTime.total}</div>
                <div style={styles.statSubValue} className="stat-subvalue">
                  {analytics.allTime.sent} sent, {analytics.allTime.failed} failed
                </div>
                <div style={styles.statSubValue} className="stat-subvalue">
                  Success Rate: {analytics.allTime.successRate}
                </div>
              </div>
            </div>
            
            {/* Daily Data Table */}
            <div style={styles.tableContainer} className="table-container">
              <h3 style={styles.title} className="analytics-title">Daily SMS Data</h3>
              
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader} className="table-header">Date</th>
                    <th style={styles.tableHeader} className="table-header">Total</th>
                    <th style={styles.tableHeader} className="table-header">Sent</th>
                    <th style={styles.tableHeader} className="table-header">Failed</th>
                    <th style={styles.tableHeader} className="table-header">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item) => {
                    const successRate = item.total > 0 
                      ? ((item.sent / item.total) * 100).toFixed(2) 
                      : '0.00';
                    
                    return (
                      <tr key={item.date}>
                        <td style={styles.tableCell} className="table-cell">
                          {new Date(item.date).toLocaleDateString()}
                        </td>
                        <td style={styles.tableCell} className="table-cell">{item.total}</td>
                        <td style={{...styles.tableCell, ...styles.tableCellSuccess}} className="table-cell">{item.sent}</td>
                        <td style={{...styles.tableCell, ...styles.tableCellError}} className="table-cell">{item.failed}</td>
                        <td style={styles.tableCell} className="table-cell">{successRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
