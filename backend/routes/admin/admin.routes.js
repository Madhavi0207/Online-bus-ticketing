const express = require("express");
const router = express.Router();

const { auth, adminAuth } = require("../../middleware/auth");
const adminController = require("../../controllers/admin.controller");

/* =====================================================
   DASHBOARD
===================================================== */
router.get("/stats", auth, adminAuth, adminController.getDashboardStats);
router.get(
  "/bookings/recent",
  auth,
  adminAuth,
  adminController.getRecentBookings,
);

/* =====================================================
   USERS MANAGEMENT
===================================================== */
router.get("/users", auth, adminAuth, adminController.getAllUsers);
router.get("/users/search", auth, adminAuth, adminController.searchUsers);
router.get("/users/:id", auth, adminAuth, adminController.getUserById);
router.post("/users", auth, adminAuth, adminController.createUser);
router.put("/users/:id", auth, adminAuth, adminController.updateUser);
router.delete("/users/:id", auth, adminAuth, adminController.deleteUser);
router.put(
  "/users/:id/toggle-admin",
  auth,
  adminAuth,
  adminController.toggleAdminStatus,
);

/* =====================================================
   ROUTES MANAGEMENT
===================================================== */
router.get("/routes", auth, adminAuth, adminController.getAllRoutes);
router.get("/routes/:id", auth, adminAuth, adminController.getRouteById);
router.post("/routes", auth, adminAuth, adminController.createRoute);
router.put("/routes/:id", auth, adminAuth, adminController.updateRoute);
router.delete("/routes/:id", auth, adminAuth, adminController.deleteRoute);

/* =====================================================
   BOOKINGS MANAGEMENT
===================================================== */
router.get("/bookings", auth, adminAuth, adminController.getAllBookings);
router.post(
  "/bookings/:id/cancel",
  auth,
  adminAuth,
  adminController.cancelBooking,
);
router.post(
  "/bookings/:id/send-ticket",
  auth,
  adminAuth,
  adminController.sendTicketEmail,
);
router.post(
  "/bookings/bulk-send-tickets",
  auth,
  adminAuth,
  adminController.bulkSendTickets,
);

/* =====================================================
   ANALYTICS
===================================================== */
router.get(
  "/analytics/bookings",
  auth,
  adminAuth,
  adminController.getBookingAnalytics,
);

/* =====================================================
   REPORTS
===================================================== */
router.get(
  "/reports/bookings",
  auth,
  adminAuth,
  adminController.generateBookingReport,
);
router.get(
  "/reports/revenue",
  auth,
  adminAuth,
  adminController.generateRevenueReport,
);
router.get(
  "/reports/users",
  auth,
  adminAuth,
  adminController.generateUserReport,
);

module.exports = router;
