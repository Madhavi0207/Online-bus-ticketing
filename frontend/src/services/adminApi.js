// src/services/adminAPI.js
import api from "./api";

const adminAPI = {
  // Admin auth
  login: (credentials) => api.post("/admin/auth/login", credentials),
  registerAdmin: (adminData) => api.post("/admin/auth/register", adminData),

  // Users
  getUsers: () => api.get("/admin/users"),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleAdmin: (id) => api.put(`/admin/users/${id}/toggle-admin`),

  // Buses
  getBuses: () => api.get("/admin/buses"),
  createBus: (data) => api.post("/admin/buses", data),
  updateBus: (id, data) => api.put(`/admin/buses/${id}`, data),
  deleteBus: (id) => api.delete(`/admin/buses/${id}`),

  // Routes
  getRoutes: () => api.get("/admin/routes"),
  createRoute: (data) => api.post("/admin/routes", data),
  updateRoute: (id, data) => api.put(`/admin/routes/${id}`, data),
  deleteRoute: (id) => api.delete(`/admin/routes/${id}`),

  // Dashboard stats
  getStats: () => api.get("/admin/stats"),
};

export default adminAPI;
