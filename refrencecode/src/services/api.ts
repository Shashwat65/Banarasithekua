import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
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

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  verifyOTP: (data: any) => api.post('/auth/verify-otp', data),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  resendOTP: (data: any) => api.post('/auth/resend-otp', data),
};

// Products API
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getBySlug: (slug: string) => api.get(`/products/slug/${slug}`),
  getFeatured: () => api.get('/products/featured/list'),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  getBySlug: (slug: string) => api.get(`/categories/slug/${slug}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  create: (orderData: any) => api.post('/orders', orderData),
  getById: (id: string) => api.get(`/orders/${id}`),
  getMyOrders: (params?: any) => api.get('/orders/user/myorders', { params }),
  getAll: (params?: any) => api.get('/orders', { params }),
  updateStatus: (id: string, data: any) => api.put(`/orders/${id}/status`, data),
  markAsPaid: (id: string, data: any) => api.put(`/orders/${id}/pay`, data),
};

// Payment API
export const paymentAPI = {
  initiatePhonePe: (data: any) => api.post('/payment/phonepe/initiate', data),
  checkStatus: (transactionId: string) => api.get(`/payment/status/${transactionId}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData: FormData) => api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  uploadImages: (formData: FormData) => api.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteImage: (publicId: string) => api.delete(`/upload/image/${encodeURIComponent(publicId)}`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  updateUserRole: (id: string, data: any) => api.put(`/admin/users/${id}/role`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  createAdmin: (data: any) => api.post('/admin/create-admin', data),
};

export default api;