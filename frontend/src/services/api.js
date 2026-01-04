import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/me", data),
};

// Services API
export const servicesAPI = {
  getAll: () => api.get("/services"),
  getById: (id) => api.get(`/services/${id}`),
  create: (serviceData) => api.post("/services", serviceData),
  update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  delete: (id) => api.delete(`/services/${id}`),
};

// Routes API
export const routesAPI = {
  getAll: () => api.get("/routes"),
  getPopular: () => api.get("/routes/popular"),
  getById: (id) => api.get(`/routes/${id}`),
  search: (from, to) => api.get(`/routes/search/${from}/${to}`),
  getSeatAvailability: (id) => api.get(`/routes/${id}/seats`),
  create: (routeData) => api.post("/routes", routeData),
  update: (id, routeData) => api.put(`/routes/${id}`, routeData),
  delete: (id) => api.delete(`/routes/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create: (bookingData) => api.post("/bookings", bookingData),
  getMyBookings: () => api.get("/bookings/my-bookings"),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) =>
    api.put(`/bookings/${id}/cancel`, { cancellationReason: reason }),
  checkAvailability: (routeId, date, time) =>
    api.get(
      `/bookings/route/${routeId}/availability?date=${date}&time=${time}`
    ),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get("/bookings/stats/dashboard"),
  getAllBookings: (params) => api.get("/bookings", { params }),
  getAllUsers: () => api.get("/auth/users"),
};

export default api;
