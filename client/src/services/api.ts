import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
      const publicPaths = ['/', '/products', '/privacy', '/terms', '/returns-and-shipping'];
      const current = window.location.pathname;
      if (publicPaths.includes(current) || current.startsWith('/products/')) {
        // allow staying on public pages
        return Promise.reject(error);
      }
      localStorage.removeItem('user');
      if (!current.startsWith('/login')) {
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
  getById: (id: string) => api.get(`/shop/products/get/${id}`),
  create: (data: any) => api.post("/admin/products/add", data),
  update: (id: string, data: any) => api.put(`/admin/products/edit/${id}`, data),
  delete: (id: string) => api.delete(`/admin/products/delete/${id}`),
};

// Categories API (placeholder until backend support is available)
export const categoriesAPI = {
  getAll: () => Promise.resolve({ data: { data: [] } }),
  getById: (_id: string) => Promise.resolve({ data: { data: null } }),
  getBySlug: (_slug: string) => Promise.resolve({ data: { data: null } }),
  create: (_data: any) => Promise.reject(new Error("Categories API not yet configured")),
  update: (_id: string, _data: any) => Promise.reject(new Error("Categories API not yet configured")),
  delete: (_id: string) => Promise.reject(new Error("Categories API not yet configured")),
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
  uploadImage: (formData: FormData) =>
    api.post("/admin/products/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

// Admin API placeholders
export const adminAPI = {
  getDashboard: () => Promise.reject(new Error("Admin dashboard API not yet configured")),
  getUsers: (_params?: Record<string, any>) => Promise.reject(new Error("Admin users API not yet configured")),
  updateUserRole: (_id: string, _data: any) => Promise.reject(new Error("Admin users API not yet configured")),
  deleteUser: (_id: string) => Promise.reject(new Error("Admin users API not yet configured")),
  createAdmin: (_data: any) => Promise.reject(new Error("Admin users API not yet configured")),
};

export default api;