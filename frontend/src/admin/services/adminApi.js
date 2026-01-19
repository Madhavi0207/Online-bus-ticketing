import api from "../../services/api";

// Admin Dashboard Statistics
export const adminStatsAPI = {
  getDashboardStats: () => api.get("/admin/stats"),
  getRecentBookings: () => api.get("/admin/recent-bookings"),
  getRevenueAnalytics: (period = "monthly") =>
    api.get(`/admin/revenue?period=${period}`),
  getPopularRoutes: () => api.get("/admin/popular-routes"),
};

// Users Management
export const adminUsersAPI = {
  getAllUsers: (page = 1, limit = 10) =>
    api.get(`/users?page=${page}&limit=${limit}`),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post("/users", userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  toggleAdminStatus: (id) => api.put(`/users/${id}/toggle-admin`),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
};

// Routes Management
export const adminRoutesAPI = {
  getAllRoutes: (page = 1, limit = 10) =>
    api.get(`/routes?page=${page}&limit=${limit}`),
  createRoute: (routeData) => api.post("/routes", routeData),
  updateRoute: (id, routeData) => api.put(`/routes/${id}`, routeData),
  deleteRoute: (id) => api.delete(`/routes/${id}`),
  bulkUpdateRoutes: (routeIds, data) =>
    api.put("/routes/bulk-update", { routeIds, data }),
};

// Bookings Management
export const adminBookingsAPI = {
  getAllBookings: (page = 1, limit = 10, filters = {}) =>
    api.get(`/bookings/all?page=${page}&limit=${limit}`, { params: filters }),
  getBookingDetails: (id) => api.get(`/bookings/${id}`),
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  sendTicketEmail: (bookingId) =>
    api.post(`/bookings/${bookingId}/send-ticket`),
  bulkSendTickets: (bookingIds) =>
    api.post("/bookings/bulk-send-tickets", { bookingIds }),
  exportBookings: (filters) =>
    api.get("/bookings/export", { params: filters, responseType: "blob" }),
};

// Services Management
export const adminServicesAPI = {
  getAllServices: () => api.get("/services"),
  createService: (serviceData) => api.post("/services", serviceData),
  updateService: (id, serviceData) => api.put(`/services/${id}`, serviceData),
  deleteService: (id) => api.delete(`/services/${id}`),
  updateServiceOrder: (services) =>
    api.put("/services/update-order", { services }),
};

// Buses Management
export const adminBusesAPI = {
  getAllBuses: () => api.get("/buses"),
  getBusById: (id) => api.get(`/buses/${id}`),
  createBus: (busData) => api.post("/buses", busData),
  updateBus: (id, busData) => api.put(`/buses/${id}`, busData),
  deleteBus: (id) => api.delete(`/buses/${id}`),
  updateSeatStatus: (busId, seatNumber, status) =>
    api.put(`/buses/${busId}/seats/${seatNumber}`, { status }),
};

// Email Management
export const adminEmailAPI = {
  sendBulkEmails: (data) => api.post("/email/bulk", data),
  getEmailTemplates: () => api.get("/email/templates"),
  createEmailTemplate: (template) => api.post("/email/templates", template),
  updateEmailTemplate: (id, template) =>
    api.put(`/email/templates/${id}`, template),
  sendCustomEmail: (emailData) => api.post("/email/send-custom", emailData),
};

// Analytics
export const adminAnalyticsAPI = {
  getBookingAnalytics: (startDate, endDate) =>
    api.get(`/analytics/bookings?start=${startDate}&end=${endDate}`),
  getRevenueAnalytics: (startDate, endDate) =>
    api.get(`/analytics/revenue?start=${startDate}&end=${endDate}`),
  getUserAnalytics: () => api.get("/analytics/users"),
  getRouteAnalytics: () => api.get("/analytics/routes"),
  getDashboardWidgets: () => api.get("/analytics/widgets"),
};

// System Settings
export const adminSettingsAPI = {
  getSettings: () => api.get("/admin/settings"),
  updateSettings: (settings) => api.put("/admin/settings", settings),
  backupDatabase: () => api.post("/admin/backup"),
  clearCache: () => api.post("/admin/clear-cache"),
};

// Report Generation
export const adminReportsAPI = {
  generateReport: (type, params) =>
    api.post(`/reports/generate/${type}`, params),
  getReportHistory: () => api.get("/reports/history"),
  downloadReport: (id) =>
    api.get(`/reports/download/${id}`, { responseType: "blob" }),
};
