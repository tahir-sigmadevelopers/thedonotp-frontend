import { useState } from 'react';
import { loginUser } from '../services/api';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const userData = await loginUser(email, password);
      
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const styles = {
    container: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      maxWidth: '400px',
      margin: '0 auto',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    form: {
      marginBottom: '1rem',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#4b5563',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      fontSize: '0.875rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      backgroundColor: '#f9fafb',
    },
    button: {
      width: '100%',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#ffffff',
      backgroundColor: '#4f46e5',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
    },
    error: {
      padding: '0.75rem',
      marginBottom: '1rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login to Access System</h2>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            style={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label} htmlFor="password">Password</label>
          <input
            style={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button 
          style={styles.button} 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm; 