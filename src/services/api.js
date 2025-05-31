import axios from 'axios';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        // This will be updated after backend deployment
        return process.env.REACT_APP_API_URL || 'https://vit-student-showcase-backend.vercel.app/api';
    }
    return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
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
