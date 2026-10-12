import axios from 'axios';

// Access API URL from environment variable, fallback to local backend standard
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach Authorization Bearer token to outgoing requests if logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusfind_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 Unauthorized to clear token if session expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('campusfind_token');
      localStorage.removeItem('campusfind_user');
    }
    return Promise.reject(error);
  }
);

export default api;
