import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_PREFIX = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post(`${API_PREFIX}/auth/signup`, userData),
  login: (credentials) => api.post(`${API_PREFIX}/auth/login`, credentials),
  getProfile: () => api.get(`${API_PREFIX}/auth/profile`),
};

// Courses API
export const coursesAPI = {
  getAll: () => api.get(`${API_PREFIX}/courses`),
  getById: (id) => api.get(`${API_PREFIX}/courses/${id}`),
  create: (courseData) => api.post(`${API_PREFIX}/courses`, courseData),
  update: (id, courseData) => api.put(`${API_PREFIX}/courses/${id}`, courseData),
  delete: (id) => api.delete(`${API_PREFIX}/courses/${id}`),
  getByInstructor: (instructorId) => api.get(`${API_PREFIX}/courses/instructor/${instructorId}`),
};

// Lessons API
export const lessonsAPI = {
  getByCourse: (courseId) => api.get(`${API_PREFIX}/lessons/${courseId}`),
  getById: (id) => api.get(`${API_PREFIX}/lessons/single/${id}`),
  create: (lessonData) => api.post(`${API_PREFIX}/lessons`, lessonData),
  update: (id, lessonData) => api.put(`${API_PREFIX}/lessons/${id}`, lessonData),
  delete: (id) => api.delete(`${API_PREFIX}/lessons/${id}`),
};

// Progress API
export const progressAPI = {
  get: (userId, courseId) => api.get(`${API_PREFIX}/progress/${userId}/${courseId}`),
  update: (progressData) => api.post(`${API_PREFIX}/progress/update`, progressData),
  getStats: (userId) => api.get(`${API_PREFIX}/progress/stats/${userId}`),
};

// Enrollment API
export const enrollmentAPI = {
  enroll: (courseId) => api.post(`${API_PREFIX}/enrollment`, { course_id: courseId }),
  getMyCourses: () => api.get(`${API_PREFIX}/enrollment/my-courses`),
  checkEnrollment: (courseId) => api.get(`${API_PREFIX}/enrollment/check/${courseId}`),
};

export default api;