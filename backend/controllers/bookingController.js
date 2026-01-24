const Booking = require("../models/Booking");
const Bus = require("../models/bus.model");
const Ticket = require("../models/ticket.model");
const sendEmail = require("../utils/email");

// ===== Create Booking =====
const createBooking = async (req, res) => {
  try {
    const {
      userId,
      busId,
      route,
      selectedSeats,
      travelDate,
      bookerName,
      bookerEmail,
      bookerPhone,
    } = req.body;

    if (!busId || !selectedSeats || selectedSeats.length === 0)
      return res.status(400).json({ error: "Invalid booking data" });

    if (selectedSeats.length > 6)
      return res
        .status(400)
        .json({ error: "Maximum 6 seats allowed per booking" });

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ error: "Bus not found" });

    // Check if seats are already booked
    const alreadyBooked = bus.seats.filter(
      (s) => selectedSeats.includes(s.seatNumber) && s.isBooked,
    );
    if (alreadyBooked.length > 0)
      return res
        .status(400)
        .json({ error: "One or more seats are already booked" });

    // Create booking
    const booking = await Booking.create({
      user: userId,
      bus: busId,
      route,
      selectedSeats,
      bookerName,
      bookerEmail,
      bookerPhone,
      totalAmount: bus.price * selectedSeats.length,
      travelDate,
      paymentStatus: "completed",
    });

    // Mark seats as booked in bus
    await Bus.updateOne(
      { _id: busId },
      {
        $set: {
          "seats.$[elem].isBooked": true,
          "seats.$[elem].bookedBy": userId,
          "seats.$[elem].bookingId": booking._id,
        },
      },
      { arrayFilters: [{ "elem.seatNumber": { $in: selectedSeats } }] },
    );

    // Generate ticket
    const ticketNumber =
      "TIX-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    await Ticket.create({
      booking: booking._id,
      ticketNumber,
      qrCode: `QR_${ticketNumber}`,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ===== Get All Bookings (Admin) =====
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("route")
      .populate("bus")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ===== Get User Bookings =====
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("route")
      .populate("bus")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Get User Bookings Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ===== Cancel Booking =====
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.isCancelled = true;
    await booking.save();

    // Release seats in Bus
    await Bus.updateOne(
      { _id: booking.bus },
      {
        $set: {
          "seats.$[elem].isBooked": false,
          "seats.$[elem].bookedBy": null,
          "seats.$[elem].bookingId": null,
        },
      },
      { arrayFilters: [{ "elem.seatNumber": { $in: booking.selectedSeats } }] },
    );

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ===== Send Ticket (Manual / Placeholder) =====
const sendTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user")
      .populate("route")
      .populate("bus");

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // TODO: implement actual email sending
    // await sendEmail({ to: booking.bookerEmail, subject: "Your Ticket", html: "<p>Ticket</p>" });

    res.json({ message: "Ticket sent successfully (placeholder)" });
  } catch (error) {
    console.error("Send Ticket Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ===== Export all functions =====
module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  cancelBooking,
  sendTicket,
};
