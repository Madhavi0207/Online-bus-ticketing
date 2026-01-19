const Booking = require("../models/Booking");
const Route = require("../models/route.model.js");
const Bus = require("../models/bus.model");
const sendEmail = require("../utils/email");

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
// Send ticket via email
const sendTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("route")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const emailContent = `
      <h1>Ticket for ${booking.route.from} to ${booking.route.to}</h1>
      <p>Passenger: ${booking.user.name}</p>
      <p>Travel Date: ${new Date(booking.travelDate).toLocaleDateString()}</p>
      <p>Seats: ${booking.seats.map((seat) => seat.seatNumber).join(", ")}</p>
      <p>Total Amount: NPR ${booking.totalAmount}</p>
      <p>Booking Reference: ${booking._id}</p>
    `;

    await sendEmail({
      to: booking.user.email,
      subject: `Your Ticket for ${booking.route.from} to ${booking.route.to}`,
      html: emailContent,
    });

    res.json({ message: "Ticket sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Example: Book a seat for a user
const bookSeat = async (req, res) => {
  try {
    const { busId, seatNumber, userId } = req.body;

    // Find the bus
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ error: "Bus not found" });

    // Find the seat
    const seat = bus.seats.find((s) => s.seatNumber === seatNumber);
    if (!seat) return res.status(404).json({ error: "Seat not found" });
    if (seat.isBooked)
      return res.status(400).json({ error: "Seat already booked" });

    // Create a booking record (optional, but recommended)
    const booking = new Booking({
      user: userId,
      bus: busId,
      seatNumber,
      // Add other fields like price, date
    });
    await booking.save();

    // Update the seat
    seat.isBooked = true;
    seat.bookedBy = userId;
    seat.bookingId = booking._id;

    // Save the bus
    await bus.save();

    res.status(200).json({ message: "Seat booked successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
  sendTicket,
  bookSeat,
};
