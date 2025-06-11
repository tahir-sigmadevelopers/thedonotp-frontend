import { useState, useEffect } from 'react';
import { sendOTP } from '../services/api';

// Add responsive styles
const responsiveStyles = `
  @media (max-width: 640px) {
    .phone-card {
      padding: 1.5rem 1rem !important;
      border-radius: 0.5rem !important;
    }
    .phone-title {
      font-size: 1.25rem !important;
      margin-bottom: 1rem !important;
    }
    .phone-input {
      width: 100% !important;
      padding: 0.6rem 1rem 0.6rem 2.5rem !important;
      font-size: 0.9rem !important;
    }
    .phone-btn-group {
      flex-direction: column !important;
      gap: 0.5rem !important;
    }
    .phone-btn {
      padding: 0.6rem !important;
      font-size: 0.8rem !important;
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
    paddingBottom: '3rem',
    width: '100%',
    animation: 'fadeIn 0.5s ease-out',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '1.5rem',
    textAlign: 'center',
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
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.5rem',
    fontSize: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  inputIcon: {
    position: 'absolute',
    top: '50%',
    left: '0.75rem',
    transform: 'translateY(-50%)',
    color: '#6b7280',
  },
  helperText: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '0.5rem',
  },
  btnGroup: {
    display: 'flex',
    gap: '0.75rem',
    width: '100%',
  },
  btn: {
    flex: 1,
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
  btnSecondary: {
    backgroundColor: '#f9fafb',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
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
  providerIcon: {
    width: '1.5rem',
    height: '1.5rem',
  },
  providerText: {
    fontSize: '0.875rem',
    fontWeight: '500',
  }
};

const PhoneForm = ({ onOtpSent }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await sendOTP(phoneNumber, provider);
      setLoading(false);
      
      // Call the parent component callback to switch to OTP verification screen
      onOtpSent(phoneNumber);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await sendOTP(phoneNumber, provider);
      setLoading(false);
      // Show success message for resend
      setError('OTP resent successfully!');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div style={styles.card} className="phone-card">
      <h2 style={styles.title} className="phone-title">Phone Verification</h2>
      
      {error && (
        <div style={{
          ...styles.alert,
          ...(error.includes('success') ? styles.alertSuccess : styles.alertError)
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="provider">
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
                id="twilio" 
                name="provider" 
                value="twilio"
                checked={provider === 'twilio'}
                onChange={() => setProvider('twilio')}
              />
              <label htmlFor="twilio" style={styles.providerText}>Twilio</label>
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
                id="vonage" 
                name="provider" 
                value="vonage"
                checked={provider === 'vonage'}
                onChange={() => setProvider('vonage')}
              />
              <label htmlFor="vonage" style={styles.providerText}>Vonage</label>
            </div>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="phoneNumber">
            Phone Number
          </label>
          <div style={styles.inputWrapper}>
            <input
              type="tel"
              id="phoneNumber"
              style={styles.input}
              className="phone-input"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <span style={styles.inputIcon}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
          </div>
          <p style={styles.helperText}>
            Enter your phone number with country code
          </p>
        </div>
        
        <div style={styles.btnGroup} className="phone-btn-group">
          <button
            type="submit"
            style={{
              ...styles.btn,
              ...styles.btnPrimary,
              ...(loading ? styles.disabled : {})
            }}
            className="phone-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Sending...
              </>
            ) : 'Send OTP'}
          </button>
          
          <button
            type="button"
            style={{
              ...styles.btn,
              ...styles.btnSecondary,
              ...(loading ? styles.disabled : {})
            }}
            className="phone-btn"
            onClick={handleResend}
            disabled={loading}
          >
            Resend OTP
          </button>
        </div>
      </form>
    </div>
  );
};

export default PhoneForm; 