import axios from 'axios';

// Get API base URL - production vs development
const getApiBaseUrl = () => {
    // In production, use environment variable or fallback to your deployed backend
    if (process.env.NODE_ENV === 'production') {
        return process.env.REACT_APP_API_URL || 'https://backendvgit.vercel.app/api';
    }
    // In development, use localhost
    return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🚀 API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 seconds timeout
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Handle responses and errors
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.status, error.response?.data);
        
        if (error.response?.status === 401) {
            // Token expired - redirect to login
            localStorage.removeItem('token');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile'),
};

// Projects API calls
export const projectsAPI = {
    getAllProjects: (params) => api.get('/projects', { params }),
    getProject: (id) => api.get(`/projects/${id}`),
    createProject: (projectData) => api.post('/projects', projectData),
    updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
    deleteProject: (id) => api.delete(`/projects/${id}`),
    likeProject: (id) => api.post(`/projects/${id}/like`),
    addComment: (id, commentData) => api.post(`/projects/${id}/comment`, commentData),
};

// Admin API calls
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    deleteProject: (id) => api.delete(`/admin/projects/${id}`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    featureProject: (id) => api.put(`/admin/projects/${id}/feature`),
};

export default api;
