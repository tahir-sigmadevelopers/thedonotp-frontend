import { useState } from 'react';
import { sendBulkOTP } from '../services/api';

// Define styles object for inline styling
const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '2rem',
    width: '100%',
    animation: 'fadeIn 0.5s ease-out',
    paddingRight: '4rem',
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
  inputGroup: {
    marginBottom: '1.5rem',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    backgroundColor: '#ffffff',
  },
  btn: {
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
  },
  btnPrimary: {
    backgroundColor: '#4f46e5',
    color: 'white',
  },
  spinner: {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 0.8s linear infinite',
    marginRight: '0.5rem',
  },
  disabled: {
    opacity: '0.6',
    cursor: 'not-allowed',
  },
  alert: {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
  },
  alertSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    color: '#10b981',
  },
  alertError: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
  },
  progressContainer: {
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  progressBar: {
    height: '0.5rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '0.25rem',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4f46e5',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.25rem',
    textAlign: 'right',
  }
};

const BulkSmsForm = () => {
  const [totalSMS, setTotalSMS] = useState(100);
  const [pauseAfter, setPauseAfter] = useState(10);
  const [pauseSeconds, setPauseSeconds] = useState(5);
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [progress, setProgress] = useState(0);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (totalSMS <= 0 || pauseAfter <= 0 || pauseSeconds <= 0) {
      setError('Please enter valid positive numbers');
      return;
    }
    
    if (!phoneNumbers.trim()) {
      setError('Please enter at least one phone number');
      return;
    }
    
    // Parse phone numbers from textarea
    const numbers = phoneNumbers
      .split('\n')
      .map(num => num.trim())
      .filter(num => num);
    
    if (numbers.length === 0) {
      setError('Please enter at least one valid phone number');
      return;
    }
    
    console.log('Parsed phone numbers:', numbers);

    setLoading(true);
    setError('');
    setSuccess('');
    setProgress(0);
    
    try {
      const response = await sendBulkOTP({
        phoneNumbers: numbers,
        totalSMS,
        pauseAfter,
        pauseSeconds
      }, (currentProgress) => {
        setProgress(currentProgress);
      });
      
      setLoading(false);
      setSuccess('Bulk SMS sending completed successfully!');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to send bulk SMS. Please try again.');
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Bulk OTP Sender</h2>
      
      <p style={styles.subtitle}>
        Configure and send OTP messages to multiple phone numbers
      </p>
      
      {error && (
        <div style={{...styles.alert, ...styles.alertError}}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{...styles.alert, ...styles.alertSuccess}}>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Total SMS to Send
          </label>
          <input
            type="number"
            min="1"
            style={styles.input}
            value={totalSMS}
            onChange={(e) => setTotalSMS(parseInt(e.target.value) || 0)}
            disabled={loading}
            required
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Pause After (messages)
          </label>
          <input
            type="number"
            min="1"
            style={styles.input}
            value={pauseAfter}
            onChange={(e) => setPauseAfter(parseInt(e.target.value) || 0)}
            disabled={loading}
            required
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Pause Duration (seconds)
          </label>
          <input
            type="number"
            min="1"
            style={styles.input}
            value={pauseSeconds}
            onChange={(e) => setPauseSeconds(parseInt(e.target.value) || 0)}
            disabled={loading}
            required
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Phone Numbers (one per line)
          </label>
          <textarea
            style={{...styles.input, minHeight: '100px'}}
            value={phoneNumbers}
            onChange={(e) => setPhoneNumbers(e.target.value)}
            disabled={loading}
            placeholder="+1234567890&#10;+9876543210&#10;+1122334455"
            required
          />
        </div>
        
        {loading && (
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div 
                style={{
                  ...styles.progressFill,
                  width: `${progress}%`
                }}
              />
            </div>
            <div style={styles.progressText}>
              {progress}% Complete
            </div>
          </div>
        )}
        
        <button
          type="submit"
          style={{
            ...styles.btn,
            ...styles.btnPrimary,
            ...(loading ? styles.disabled : {})
          }}
          disabled={loading}
        >
          {loading ? (
            <>
              <span style={styles.spinner}></span>
              Sending...
            </>
          ) : 'Start Sending'}
        </button>
      </form>
    </div>
  );
};

export default BulkSmsForm; 