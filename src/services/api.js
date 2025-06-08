import axios from 'axios';

const API_URL = 'https://otpbackend-eta.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    console.log('API Request to:', config.url);
    console.log('Token available:', token ? `${token.substring(0, 10)}...` : 'No token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response from:', response.config.url, 'Status:', response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url || 'Unknown URL', 
      'Status:', error.response?.status || 'No status',
      'Message:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

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

// Get user analytics (for regular users to see their own analytics)
export const getUserAnalytics = async () => {
  try {
    const response = await api.get('/analytics/user');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// User API functions
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    // Save token to local storage
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
};

export default api; 