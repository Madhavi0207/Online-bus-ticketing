const Booking = require("../models/Booking");
const Route = require("../models/Route");

// Create booking
const createBooking = async (req, res) => {
  try {
    const { user, routeId, seats, travelDate } = req.body;
    const userId = req.user.id;

    // Get route
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    // Check seat availability
    if (route.availableSeats < seats.length) {
      return res.status(400).json({ error: "Not enough seats available" });
    }

    // Calculate total amount
    const totalAmount = route.price * seats.length;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      route: routeId,
      seats,
      totalAmount,
      travelDate,
      paymentStatus: "completed", // For demo, auto-complete payment
    });

    // Update available seats
    route.availableSeats -= seats.length;
    await route.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("route")
      .sort("-bookingDate");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("route")
      .populate("user", "name email")
      .sort("-bookingDate");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    booking.isCancelled = true;
    await booking.save();

    // Return seats to route
    const route = await Route.findById(booking.route);
    if (route) {
      route.availableSeats += booking.seats.length;
      await route.save();
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
};
