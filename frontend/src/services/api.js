import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
};

// Routes endpoints
export const routesAPI = {
  getAll: () => api.get("/routes"),
  getById: (id) => api.get(`/routes/${id}`),
  create: (routeData) => api.post("/routes", routeData),
  update: (id, routeData) => api.put(`/routes/${id}`, routeData),
  delete: (id) => api.delete(`/routes/${id}`),
};

// Services endpoints
export const servicesAPI = {
  getAll: () => api.get("/services"),
  create: (serviceData) => api.post("/services", serviceData),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  delete: (id) => api.delete(`/services/${id}`),
};

// Bookings endpoints
export const bookingsAPI = {
  create: (bookingData) => api.post("/bookings", bookingData),
  getUserBookings: () => api.get("/bookings/my-bookings"),
  getAllBookings: () => api.get("/bookings/all"),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  sendTicket: (id) => api.post(`/bookings/${id}/send-ticket`),
};

// Admin endpoints
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getUsers: () => api.get("/users"),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  toggleAdmin: (id) => api.put(`/users/${id}/toggle-admin`),
};

export default api;
