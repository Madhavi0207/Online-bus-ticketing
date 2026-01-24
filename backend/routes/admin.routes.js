const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../middleware/auth");
const bookingController = require("../controllers/bookingController");
const {
  getUsers,
  deleteUser,
  createBus,
  updateBus,
  deleteBus,
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} = require("../controllers/admin.controller");
const Booking = require("../models/Booking");

// ===== Users =====
router.get("/users", auth, adminAuth, getUsers);
router.delete("/users/:id", auth, adminAuth, deleteUser);

// ===== Buses =====
router.post("/buses", auth, adminAuth, createBus);
router.put("/buses/:id", auth, adminAuth, updateBus);
router.delete("/buses/:id", auth, adminAuth, deleteBus);

// ===== Routes =====
router.get("/routes", auth, adminAuth, getRoutes);
router.post("/routes", auth, adminAuth, createRoute);
router.put("/routes/:id", auth, adminAuth, updateRoute);
router.delete("/routes/:id", auth, adminAuth, deleteRoute);

// ===== Bookings =====
router.get("/bookings", auth, adminAuth, bookingController.getAllBookings);
router.post(
  "/bookings/:id/cancel",
  auth,
  adminAuth,
  bookingController.cancelBooking,
);
router.post(
  "/bookings/:id/send-ticket",
  auth,
  adminAuth,
  bookingController.sendTicket,
);

// ===== Dashboard Stats =====
router.get("/stats", auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await require("../models/User").countDocuments();
    const totalRoutes = await require("../models/route.model").countDocuments();
    const totalBookings = await Booking.countDocuments();
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce(
      (acc, b) => acc + (b.totalAmount || 0),
      0,
    );

    res.json({
      users: totalUsers,
      routes: totalRoutes,
      bookings: totalBookings,
      revenue: totalRevenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// ===== Recent Bookings =====
router.get("/bookings/recent", auth, adminAuth, async (req, res) => {
  try {
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user route");
    res.json(recentBookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch recent bookings" });
  }
});

module.exports = router;
