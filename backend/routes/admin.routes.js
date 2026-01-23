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
} = require("../controllers/adminControllers");

// ===== Admin Dashboard APIs =====

// Get all users
router.get("/users", auth, adminAuth, getUsers);

// Delete a user
router.delete("/users/:id", auth, adminAuth, deleteUser);

// Bus Management
router.post("/buses", auth, adminAuth, createBus);
router.put("/buses/:id", auth, adminAuth, updateBus);
router.delete("/buses/:id", auth, adminAuth, deleteBus);

// View all bookings
router.get("/bookings", auth, adminAuth, getBookings);

module.exports = router;
