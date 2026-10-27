import axios from 'axios';
import { handleMockFallback } from './mockFallbackService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('agrione_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor to handle session expiration and seamless Vercel fallback
api.interceptors.response.use(
  response => {
    // If Vercel rewrote an API call to index.html, it returns 200 with HTML string
    if (typeof response.data === 'string' && (response.data.includes('<!DOCTYPE html') || response.data.includes('<!doctype html') || response.data.includes('<html'))) {
      const fallback = handleMockFallback(response.config);
      if (fallback) return fallback;
    }
    return response;
  },
  error => {
    // If no backend is reachable or Vercel static returns 404/405/502/Network Error
    if (!error.response || error.response.status === 404 || error.response.status === 405 || error.response.status === 502 || error.response.status === 0) {
      const fallback = handleMockFallback(error.config);
      if (fallback) {
        return Promise.resolve(fallback);
      }
    }

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

