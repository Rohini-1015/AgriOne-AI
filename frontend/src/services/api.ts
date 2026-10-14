import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('agrione_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to handle session expiration cleanly
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        // Only redirect if on protected route
        localStorage.removeItem('agrione_token');
        localStorage.removeItem('agrione_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
