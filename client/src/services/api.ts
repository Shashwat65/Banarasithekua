import axios from "axios";

const rawApiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_PROXY;
const normalizeApiBase = (value?: string) => {
  if (!value) return "http://localhost:5000/api";
  const trimmed = value.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const API_URL = normalizeApiBase(rawApiBase);

// Create axios instance configured for cookie-based auth
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url: string | undefined = error.config?.url;
    const skip = error.config?.headers?.['x-no-redirect-on-401'];
    if (status === 401 && !skip) {
      // Don't redirect for passive auth probe
      if (url?.includes('/auth/check-auth')) {
        return Promise.reject(error);
      }
      // Support HashRouter: derive route from hash if present
      const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
      const current = hash || window.location.pathname;
      const currentPath = current.replace(/\?.*$/, '');
      const publicPaths = [
        '/',
        '/products',
        '/privacy',
        '/terms',
        '/returns-and-shipping',
        '/refund-policy',
        '/shipping-policy',
        '/cancellation-policy',
        '/cookie-policy',
        '/disclaimer',
        '/faq',
        '/about',
        '/contact'
      ];
      if (publicPaths.includes(current) || current.startsWith('/products/')) {
        // allow staying on public pages
        return Promise.reject(error);
      }
      localStorage.removeItem('user');
      if (!currentPath.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post("/auth/register", userData),
  login: (credentials: any) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  checkAuth: () => api.get("/auth/check-auth"),
};

// Products API
export const productsAPI = {
  getAll: (params?: Record<string, any>) => api.get("/shop/products/get", { params }),
  getById: (idOrSlug: string) => api.get(`/shop/products/get/${idOrSlug}`),
  create: (data: any) => api.post("/admin/products/add", data),
  update: (id: string, data: any) => api.put(`/admin/products/edit/${id}`, data),
  delete: (id: string) => api.delete(`/admin/products/delete/${id}`),
};

// Categories API (placeholder until backend support is available)
export const categoriesAPI = {
  getAll: () => api.get('/admin/categories/get'),
  getById: (id: string) => api.get(`/admin/categories/get/${id}`), // not implemented server-side but reserved
  getBySlug: (slug: string) => api.get(`/admin/categories/slug/${slug}`), // placeholder
  create: (data: any) => api.post('/admin/categories/add', data),
  update: (id: string, data: any) => api.put(`/admin/categories/edit/${id}`, data),
  delete: (id: string) => api.delete(`/admin/categories/delete/${id}`),
};

// Orders API
export const ordersAPI = {
  create: (orderData: any) => api.post("/shop/order/create", orderData),
  capturePayment: (data: any) => api.post("/shop/order/capture", data),
  getById: (id: string) => api.get(`/shop/order/details/${id}`),
  getMyOrders: (userId: string) => api.get(`/shop/order/list/${userId}`),
  getAll: () => api.get("/admin/orders/get"),
  updateStatus: (id: string, data: any) => api.put(`/admin/orders/update/${id}`, data),
};

// Payment API
export const paymentAPI = {
  checkStatus: (transactionId: string) => api.get(`/shop/order/payment-status/${transactionId}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (formData: FormData) => {
    // Backend expects field name 'my_file' in route definition; if user used 'image', duplicate it.
    if (!formData.get('my_file') && formData.get('image')) {
      formData.append('my_file', formData.get('image') as any);
    }
    return api.post('/admin/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteImage: (_publicId: string) => Promise.reject(new Error('Delete image endpoint not implemented')),
};

// Admin API placeholders
export const adminAPI = {
  getDashboard: () => api.get('/admin/metrics/summary', { headers: { 'x-no-redirect-on-401': '1' } }), // placeholder route
  getUsers: (params?: Record<string, any>) => api.get('/admin/users/list', { params }),
  updateUserRole: (id: string, data: any) => api.put(`/admin/users/role/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/delete/${id}`),
  createAdmin: (data: any) => api.post('/admin/users/bootstrap', data),
};

// Combos API (admin + public helpers)
export const combosAPI = {
  getAllPublic: () => api.get('/shop/combos/get'),
  getById: (idOrSlug: string) => api.get(`/shop/combos/get/${idOrSlug}`),
  getAllAdmin: () => api.get('/admin/combos/get'),
  create: (data: any) => api.post('/admin/combos/add', data),
  update: (id: string, data: any) => api.put(`/admin/combos/edit/${id}`, data),
  delete: (id: string) => api.delete(`/admin/combos/delete/${id}`),
};

// Team API
export const teamAPI = {
  getAllAdmin: () => api.get('/admin/team/get'),
  getAllPublic: () => api.get('/common/team/get'),
  getAll: () => api.get('/admin/team/get'),
  create: (data: any) => api.post('/admin/team/add', data),
  update: (id: string, data: any) => api.put(`/admin/team/edit/${id}`, data),
  delete: (id: string) => api.delete(`/admin/team/delete/${id}`),
};

// Slider API
export const sliderAPI = {
  getAllPublic: () => api.get('/common/slider/get'),
  getAllAdmin: () => api.get('/admin/sliders/get'),
  create: (data: any) => api.post('/admin/sliders/add', data),
  update: (id: string, data: any) => api.put(`/admin/sliders/edit/${id}`, data),
  delete: (id: string) => api.delete(`/admin/sliders/delete/${id}`),
};


export default api;