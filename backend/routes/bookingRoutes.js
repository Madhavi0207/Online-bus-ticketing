const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const { auth, adminAuth } = require("../middleware/auth");

router.post("/", auth, createBooking);
router.get("/my-bookings", auth, getUserBookings);
router.get("/all", auth, adminAuth, getAllBookings);
router.put("/:id/cancel", auth, cancelBooking);

module.exports = router;
