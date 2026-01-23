const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../middleware/auth");
const {
  getUsers,
  deleteUser,
  createBus,
  updateBus,
  deleteBus,
  getBookings,
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} = require("../controllers/admin.controller");

// ===== User Management =====
router.get("/users", auth, adminAuth, getUsers);
router.delete("/users/:id", auth, adminAuth, deleteUser);

// ===== Bus Management =====
router.post("/buses", auth, adminAuth, createBus);
router.put("/buses/:id", auth, adminAuth, updateBus);
router.delete("/buses/:id", auth, adminAuth, deleteBus);

// ===== Booking Management =====
router.get("/bookings", auth, adminAuth, getBookings);

// ===== Routes Management =====
router.get("/routes", auth, adminAuth, getRoutes);
router.post("/routes", auth, adminAuth, createRoute);
router.put("/routes/:id", auth, adminAuth, updateRoute);
router.delete("/routes/:id", auth, adminAuth, deleteRoute);

module.exports = router;
