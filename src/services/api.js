import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
};

// Courses API
export const coursesAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
  getByInstructor: (instructorId) => api.get(`/courses/instructor/${instructorId}`),
};

// Lessons API
export const lessonsAPI = {
  getByCourse: (courseId) => api.get(`/lessons/${courseId}`),
  getById: (id) => api.get(`/lessons/single/${id}`),
};

// Progress API
export const progressAPI = {
  get: (userId, courseId) => api.get(`/progress/${userId}/${courseId}`),
  update: (progressData) => api.post('/progress/update', progressData),
  getStats: (userId) => api.get(`/progress/stats/${userId}`),
};

// Enrollment API
export const enrollmentAPI = {
  enroll: (courseId) => api.post('/enrollment', { course_id: courseId }),
  getMyCourses: () => api.get('/enrollment/my-courses'),
  checkEnrollment: (courseId) => api.get(`/enrollment/check/${courseId}`),
};

export default api;