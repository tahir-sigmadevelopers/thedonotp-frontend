import { useState, useEffect, useRef } from 'react';
import { verifyOTP, sendOTP } from '../services/api';

// Add responsive styles
const responsiveStyles = `
  @media (max-width: 640px) {
    .otp-card {
      padding: 1.5rem 1rem !important;
      border-radius: 0.5rem !important;
    }
    .otp-title {
      font-size: 1.25rem !important;
      margin-bottom: 0.5rem !important;
    }
    .otp-subtitle {
      font-size: 0.75rem !important;
    }
    .otp-container {
      gap: 0.3rem !important;
    }
    .otp-input {
      width: 2.5rem !important;
      height: 2.5rem !important;
      font-size: 1rem !important;
    }
    .otp-btn {
      padding: 0.6rem !important;
      font-size: 0.8rem !important;
    }
    .otp-btn-link {
      padding: 0.4rem !important;
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
    padding: '2rem',
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
    marginBottom: '1rem',
    textAlign: 'center',
  },
  strong: {
    fontWeight: '600',
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
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  otpContainer: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    width: '100%',
  },
  otpInput: {
    width: '3rem',
    height: '3rem',
    textAlign: 'center',
    fontSize: '1.25rem',
    fontWeight: '600',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
  },
  btnGroupVertical: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '100%',
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
  btnSecondary: {
    backgroundColor: '#f9fafb',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
  },
  btnLink: {
    background: 'none',
    color: '#4f46e5',
    padding: '0.5rem',
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
};

const OtpForm = ({ phoneNumber, onVerificationSuccess, onBackToPhone }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds countdown
  const inputRefs = useRef([]);

  // Add style tag with responsive styles
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = responsiveStyles;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  useEffect(() => {
    // Focus the first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    
    // Basic validation
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await verifyOTP(phoneNumber, otpValue);
      setLoading(false);
      setSuccess(true);
      
      // Call the parent component callback for successful verification
      setTimeout(() => {
        onVerificationSuccess();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    
    try {
      await sendOTP(phoneNumber);
      setLoading(false);
      setTimeLeft(10); // Reset timer to 10 seconds
      setError('OTP resent successfully!');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div style={styles.card} className="otp-card">
      <h2 style={styles.title} className="otp-title">Enter Verification Code</h2>
      
      <p style={styles.subtitle} className="otp-subtitle">
        We've sent a 6-digit code to <span style={styles.strong}>{phoneNumber}</span>
      </p>
      
      <p style={styles.subtitle} className="otp-subtitle">
        Time remaining: {formatTime(timeLeft)}
      </p>
      
      {(error || success) && (
        <div style={{
          ...styles.alert,
          ...(success || error.includes('success') ? styles.alertSuccess : styles.alertError)
        }}>
          {success ? 'Verification successful!' : error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={styles.otpContainer} className="otp-container">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              style={styles.otpInput}
              className="otp-input"
              value={otp[index]}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={loading || success}
            />
          ))}
        </div>
        
        <div style={styles.btnGroupVertical}>
          <button
            type="submit"
            style={{
              ...styles.btn,
              ...styles.btnPrimary,
              ...(loading || success ? styles.disabled : {})
            }}
            className="otp-btn"
            disabled={loading || success}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Verifying...
              </>
            ) : 'Verify Code'}
          </button>
          
          <button
            type="button"
            style={{
              ...styles.btn,
              ...styles.btnSecondary,
              ...(loading || success || timeLeft > 0 ? styles.disabled : {})
            }}
            className="otp-btn"
            onClick={handleResend}
            disabled={loading || success || timeLeft > 0}
          >
            {timeLeft > 0 ? `Resend Code (${timeLeft}s)` : 'Resend Code'}
          </button>
          
          <button
            type="button"
            style={{
              ...styles.btn,
              ...styles.btnLink,
              ...(loading || success ? styles.disabled : {})
            }}
            className="otp-btn-link"
            onClick={onBackToPhone}
            disabled={loading || success}
          >
            Change Phone Number
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtpForm;
