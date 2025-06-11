import { useState, useEffect } from 'react';
import PhoneForm from '../components/PhoneForm';
import OtpForm from '../components/OtpForm';

// Add responsive styles
const responsiveStyles = `
  @media (max-width: 640px) {
    .success-icon {
      width: 3rem !important;
      height: 3rem !important;
      margin: 0 auto 1rem !important;
    }
    .success-title {
      font-size: 1.25rem !important;
    }
    .success-subtitle {
      font-size: 0.75rem !important;
    }
    .success-button {
      padding: 0.6rem !important;
      font-size: 0.8rem !important;
    }
  }
`;

const styles = {
  textCenter: {
    textAlign: 'center',
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
  successIcon: {
    width: '4rem',
    height: '4rem',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  icon: {
    width: '2.5rem',
    height: '2.5rem',
    stroke: '#10b981',
  },
  button: {
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
    marginTop: '1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
  },
};

const UserPage = () => {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'success'
  const [phoneNumber, setPhoneNumber] = useState('');

  // Add style tag with responsive styles
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = responsiveStyles;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const handleOtpSent = (phone) => {
    setPhoneNumber(phone);
    setStep('otp');
  };

  const handleVerificationSuccess = () => {
    setStep('success');
  };

  const handleBackToPhone = () => {
    setStep('phone');
  };

  return (
    <div>
      {step === 'phone' && (
        <PhoneForm onOtpSent={handleOtpSent} />
      )}
      
      {step === 'otp' && (
        <OtpForm
          phoneNumber={phoneNumber}
          onVerificationSuccess={handleVerificationSuccess}
          onBackToPhone={handleBackToPhone}
        />
      )}
      
      {step === 'success' && (
        <div style={styles.textCenter}>
          <div style={styles.successIcon} className="success-icon">
            <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 style={styles.title} className="success-title">Verification Successful</h2>
          <p style={styles.subtitle} className="success-subtitle">Your phone number has been verified successfully.</p>
          <button
            onClick={handleBackToPhone}
            style={styles.button}
            className="success-button"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPage; 