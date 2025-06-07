import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Send OTP to phone number
export const sendOTP = async (phoneNumber) => {
  try {
    const response = await api.post('/otp/send', { phoneNumber });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Verify OTP
export const verifyOTP = async (phoneNumber, otp) => {
  try {
    const response = await api.post('/otp/verify', { phoneNumber, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Send bulk OTPs
export const sendBulkOTP = async (bulkData, progressCallback) => {
  try {
    console.log('Sending bulk OTP request with data:', bulkData);
    
    // Ensure phoneNumbers is correctly formatted as an array
    if (bulkData.phoneNumbers && !Array.isArray(bulkData.phoneNumbers)) {
      console.error('Phone numbers is not an array:', bulkData.phoneNumbers);
      throw new Error('Phone numbers must be an array');
    }
    
    const response = await api.post('/otp/bulk-send', bulkData, {
      onUploadProgress: (progressEvent) => {
        // This won't actually track the SMS sending progress, just the upload
        // The actual progress will be tracked via server-sent events or polling
        if (progressCallback) {
          progressCallback(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      }
    });
    
    console.log('Bulk OTP response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending bulk OTP:', error);
    throw error.response?.data || error.message;
  }
};

// Get SMS analytics
export const getSMSAnalytics = async () => {
  try {
    const response = await api.get('/analytics/sms');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get daily SMS count
export const getDailySMSCount = async () => {
  try {
    const response = await api.get('/analytics/sms/daily');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api; 