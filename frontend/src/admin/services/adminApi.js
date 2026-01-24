import api from "../../services/api";

// ===== Admin Dashboard Statistics =====
export const adminStatsAPI = {
  getDashboardStats: () => api.get("/admin/stats"),
  getRecentBookings: (limit = 5) =>
    api.get("/admin/bookings/recent", { params: { limit } }),
};

// ===== Users Management =====
export const adminUsersAPI = {
  getAllUsers: (page = 1, limit = 10, filters = {}) =>
    api.get("/admin/users", { params: { page, limit, ...filters } }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  createUser: (userData) => api.post("/admin/users", userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleAdminStatus: (id) => api.put(`/admin/users/${id}/toggle-admin`),
  searchUsers: (query) => api.get(`/admin/users/search?q=${query}`),
};

// ===== Routes Management =====
export const adminRoutesAPI = {
  getAllRoutes: (page = 1, limit = 10, filters = {}) =>
    api.get("/admin/routes", { params: { page, limit, ...filters } }),
  getRouteById: (id) => api.get(`/admin/routes/${id}`),
  createRoute: (routeData) => api.post(`/admin/routes`, routeData),
  updateRoute: (id, routeData) => api.put(`/admin/routes/${id}`, routeData),
  deleteRoute: (id) => api.delete(`/admin/routes/${id}`),
  toggleRouteStatus: (id) => api.put(`/admin/routes/${id}/toggle-status`),
};

// ===== Bookings Management =====
export const adminBookingsAPI = {
  getAllBookings: (page = 1, limit = 10, filters = {}) =>
    api.get("/admin/bookings", { params: { page, limit, ...filters } }),
  cancelBooking: (id) => api.post(`/admin/bookings/${id}/cancel`),
  sendTicketEmail: (id) => api.post(`/admin/bookings/${id}/send-ticket`),
  bulkSendTickets: (bookingIds) =>
    api.post("/admin/bookings/bulk-send-tickets", { bookingIds }),
  exportBookings: (filters = {}) =>
    api.get("/admin/bookings/export", {
      params: filters,
      responseType: "blob",
    }),
};

// ===== Analytics =====
export const adminAnalyticsAPI = {
  // Keep only safe endpoint
  getBookingAnalytics: (startDate, endDate) =>
    api.get("/admin/analytics/bookings", { params: { startDate, endDate } }),
};

// ===== Reports =====
export const adminReportsAPI = {
  generateBookingReport: (params) =>
    api.get("/admin/reports/bookings", { params }),
  generateRevenueReport: (params) =>
    api.get("/admin/reports/revenue", { params }),
  generateUserReport: (params) => api.get("/admin/reports/users", { params }),
};

// ===== Services Management =====
export const adminServicesAPI = {
  getAllServices: () => api.get("/admin/services"),
  getServiceById: (id) => api.get(`/admin/services/${id}`),
  createService: (serviceData) => api.post("/admin/services", serviceData),
  updateService: (id, serviceData) =>
    api.put(`/admin/services/${id}`, serviceData),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
  updateServiceOrder: (services) =>
    api.put("/admin/services/order", { services }),
};
