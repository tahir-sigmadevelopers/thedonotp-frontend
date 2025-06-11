import { useState, useEffect } from 'react';
import { sendBulkOTP } from '../services/api';

// Add responsive styles
const responsiveStyles = `
  @media (max-width: 640px) {
    .bulk-card {
      padding: 1rem !important;
      padding-right: 1rem !important;
      border-radius: 0.5rem !important;
    }
    .bulk-title {
      font-size: 1.25rem !important;
      margin-bottom: 0.5rem !important;
    }
    .bulk-subtitle {
      font-size: 0.75rem !important;
      margin-bottom: 1rem !important;
    }
    .bulk-input {
      padding: 0.5rem 0.75rem !important;
      font-size: 0.8rem !important;
    }
    .bulk-label {
      font-size: 0.8rem !important;
      margin-bottom: 0.25rem !important;
    }
    .bulk-btn {
      padding: 0.6rem !important;
      font-size: 0.8rem !important;
    }
    .bulk-input-group {
      margin-bottom: 1rem !important;
    }
    .provider-options {
      flex-direction: column !important;
      gap: 0.5rem !important;
    }
    .provider-option {
      padding: 0.5rem !important;
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
    animation: 'fadeIn 0.5s ease-out',
    boxSizing: 'border-box',
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
    width: '100%',
    boxSizing: 'border-box',
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
    boxSizing: 'border-box',
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
    boxSizing: 'border-box',
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
    width: '100%',
    boxSizing: 'border-box',
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
    width: '100%',
  },
  progressBar: {
    height: '0.5rem',
    backgroundColor: '#e5e7eb',
    borderRadius: '0.25rem',
    overflow: 'hidden',
    width: '100%',
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
  },
  providerOptions: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    width: '100%',
  },
  providerOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    flex: 1,
  },
  providerOptionSelected: {
    borderColor: '#4f46e5',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
  },
  providerText: {
    fontSize: '0.875rem',
    fontWeight: '500',
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
  const [provider, setProvider] = useState('twilio'); // Default to Twilio
  
  // Add style tag with responsive styles
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = responsiveStyles;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

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

    setLoading(true);
    setError('');
    setSuccess('');
    setProgress(0);
    
    try {
      const response = await sendBulkOTP({
        phoneNumbers: numbers,
        totalSMS,
        pauseAfter,
        pauseSeconds,
        provider, // Add the selected provider
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
    <div style={styles.card} className="bulk-card">
      <h2 style={styles.title} className="bulk-title">Bulk OTP Sender</h2>
      
      <p style={styles.subtitle} className="bulk-subtitle">
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
        <div style={styles.inputGroup} className="bulk-input-group">
          <label style={styles.label} className="bulk-label">
            Select SMS Provider
          </label>
          <div 
            style={styles.providerOptions} 
            className="provider-options"
          >
            <div 
              style={{
                ...styles.providerOption,
                ...(provider === 'twilio' ? styles.providerOptionSelected : {})
              }}
              className="provider-option"
              onClick={() => setProvider('twilio')}
            >
              <input 
                type="radio" 
                id="bulk-twilio" 
                name="bulk-provider" 
                value="twilio"
                checked={provider === 'twilio'}
                onChange={() => setProvider('twilio')}
              />
              <label htmlFor="bulk-twilio" style={styles.providerText}>Twilio</label>
            </div>
            <div 
              style={{
                ...styles.providerOption,
                ...(provider === 'vonage' ? styles.providerOptionSelected : {})
              }}
              className="provider-option"
              onClick={() => setProvider('vonage')}
            >
              <input 
                type="radio" 
                id="bulk-vonage" 
                name="bulk-provider" 
                value="vonage"
                checked={provider === 'vonage'}
                onChange={() => setProvider('vonage')}
              />
              <label htmlFor="bulk-vonage" style={styles.providerText}>Vonage</label>
            </div>
          </div>
        </div>

        <div style={styles.inputGroup} className="bulk-input-group">
          <label style={styles.label} className="bulk-label">
            Total SMS to Send
          </label>
          <input
            type="number"
            min="1"
            style={styles.input}
            className="bulk-input"
            value={totalSMS}
            onChange={(e) => setTotalSMS(parseInt(e.target.value) || 0)}
            disabled={loading}
            required
          />
        </div>
        
        <div style={styles.inputGroup} className="bulk-input-group">
          <label style={styles.label} className="bulk-label">
            Pause After (messages)
          </label>
          <input
            type="number"
            min="1"
            style={styles.input}
            className="bulk-input"
            value={pauseAfter}
            onChange={(e) => setPauseAfter(parseInt(e.target.value) || 0)}
            disabled={loading}
            required
          />
        </div>
        
        <div style={styles.inputGroup} className="bulk-input-group">
          <label style={styles.label} className="bulk-label">
            Pause Duration (seconds)
          </label>
          <input
            type="number"
            min="1"
            style={styles.input}
            className="bulk-input"
            value={pauseSeconds}
            onChange={(e) => setPauseSeconds(parseInt(e.target.value) || 0)}
            disabled={loading}
            required
          />
        </div>
        
        <div style={styles.inputGroup} className="bulk-input-group">
          <label style={styles.label} className="bulk-label">
            Phone Numbers (one per line)
          </label>
          <textarea
            style={{...styles.input, minHeight: '100px'}}
            className="bulk-input"
            value={phoneNumbers}
            onChange={(e) => setPhoneNumbers(e.target.value)}
            disabled={loading}
            placeholder="+12345678901&#10;+10987654321&#10;+11122334455"
            required
          />
        </div>
        
        {loading && (
          <div style={styles.progressContainer}>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${progress}%`}}></div>
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
          className="bulk-btn"
          disabled={loading}
        >
          {loading ? (
            <>
              <span style={styles.spinner}></span>
              Start Sending
            </>
          ) : 'Start Sending'}
        </button>
      </form>
    </div>
  );
};

export default BulkSmsForm; 