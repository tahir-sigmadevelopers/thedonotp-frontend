import { useState, useEffect, useRef } from 'react';
import { verifyOTP, sendOTP } from '../services/api';

// Define styles object for inline styling
const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    padding: '2rem',
    width: '100%',
    animation: 'fadeIn 0.5s ease-out',
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
  },
  btnGroupVertical: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
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
    <div style={styles.card}>
      <h2 style={styles.title}>Enter Verification Code</h2>
      
      <p style={styles.subtitle}>
        We've sent a 6-digit code to <span style={styles.strong}>{phoneNumber}</span>
      </p>
      
      <p style={styles.subtitle}>
        {timeLeft > 0 ? (
          <>Code expires in <span style={styles.strong}>{formatTime(timeLeft)}</span></>
        ) : (
          <>Code expired. Please request a new one.</>
        )}
      </p>
      
      {error && (
        <div style={{
          ...styles.alert,
          ...(error.includes('success') ? styles.alertSuccess : styles.alertError)
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div style={{...styles.alert, ...styles.alertSuccess}}>
          Phone number verified successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} onPaste={handlePaste}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Verification Code
          </label>
          <div style={styles.otpContainer}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength="1"
                style={styles.otpInput}
                value={digit}
                onChange={(e) => handleChange(idx, e)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={loading || success}
              />
            ))}
          </div>
        </div>
        
        <div style={styles.btnGroupVertical}>
          <button
            type="submit"
            style={{
              ...styles.btn,
              ...styles.btnPrimary,
              ...(loading || success || otp.join('').length !== 6 ? styles.disabled : {})
            }}
            disabled={loading || success || otp.join('').length !== 6}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Verifying...
              </>
            ) : 'Verify OTP'}
          </button>
          
          <button
            type="button"
            style={{
              ...styles.btn,
              ...styles.btnSecondary,
              ...(loading || timeLeft > 0 ? styles.disabled : {})
            }}
            onClick={handleResend}
            disabled={loading || timeLeft > 0}
          >
            {timeLeft > 0 ? `Resend OTP in ${formatTime(timeLeft)}` : 'Resend OTP'}
          </button>
          
          <button
            type="button"
            style={{
              ...styles.btn,
              ...styles.btnLink,
              ...(loading ? styles.disabled : {})
            }}
            onClick={onBackToPhone}
            disabled={loading}
          >
            Change Phone Number
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtpForm;
