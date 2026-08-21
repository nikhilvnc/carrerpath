/**
 * API Service Layer for CareerPath AI Frontend
 * Centralized Axios instance with JWT auth injection and error normalization
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerpath_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract data or normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    
    // Auto logout on 401 if token is expired
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('careerpath_token');
      localStorage.removeItem('careerpath_user');
      window.location.href = '/login';
    }

    return Promise.reject(new Error(message));
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  demoLogin: () => api.post('/auth/demo-login'),
  getMe: () => api.get('/auth/me'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (profileData) => api.put('/profile', profileData),
  getMasterSkills: () => api.get('/profile/skills/master'),
};

export const assessmentAPI = {
  saveStep: (stepData) => api.post('/assessment/save-step', stepData),
  getCurrentAssessment: () => api.get('/assessment/current'),
};

export const careerAPI = {
  analyzeCareer: (assessmentAnswers) => api.post('/career/analyze', assessmentAnswers),
  getRecommendations: () => api.get('/career/recommendations'),
  getAllPaths: () => api.get('/career/paths'),
  getPathDetail: (idOrSlug) => api.get(`/career/paths/${idOrSlug}`),
  getHistory: () => api.get('/career/history'),
};

export const roadmapAPI = {
  getRoadmap: (recommendationId) => api.get(`/roadmap/${recommendationId}`),
  updateItemStatus: (itemId, status, notes = '') =>
    api.put(`/roadmap/items/${itemId}`, { status, notes }),
};

export const projectAPI = {
  getAllProjects: () => api.get('/projects'),
  getRecommendedProjects: (recommendationId) =>
    api.get(`/projects/recommendation/${recommendationId}`),
};

export const progressAPI = {
  getProgressSummary: () => api.get('/progress/summary'),
  updateProgress: (payload) => api.post('/progress/update', payload),
};

export default api;
