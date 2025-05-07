import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds
  withCredentials: true // Enable sending cookies with requests
});

// Request interceptor for adding auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle auth errors
    if (error.response.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    
    // Handle validation errors
    if (error.response.status === 400) {
      return Promise.reject(error.response.data);
    }
    
    // Handle server errors
    if (error.response.status >= 500) {
      console.error('Server error:', error.response);
      return Promise.reject(new Error('Server error. Please try again later.'));
    }
    
    return Promise.reject(error.response.data);
  }
);

export default api; 