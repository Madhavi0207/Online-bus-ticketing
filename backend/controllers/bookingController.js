const Booking = require("../models/Booking");
const Route = require("../models/route.model.js");
const Bus = require("../models/bus.model");
const Ticket = require("../models/ticket.model.js");
const sendEmail = require("../utils/email");

const createBooking = async (req, res) => {
  try {
    const {
      userId,
      route,
      selectedSeats,
      travelDate,
      bookerName,
      bookerEmail,
      bookerPhone,
    } = req.body;
    // const userId = req.user.id;

    // 1. Validation
    if (selectedSeats.length > 6) {
      return res
        .status(400)
        .json({ error: "Maximum 6 seats allowed per booking" });
    }

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ error: "Bus not found" });

    // 2. Check if seats are already taken
    const alreadyBooked = bus.seats.filter(
      (s) => selectedSeats.includes(s.seatNumber) && s.isBooked,
    );
    if (alreadyBooked.length > 0) {
      return res
        .status(400)
        .json({ error: "One or more seats are already booked" });
    }

    // 3. Create Booking
    const booking = await Booking.create({
      user: userId,
      route,
      selectedSeats,
      bookerName,
      bookerEmail,
      bookerPhone,
      totalAmount: bus.price * selectedSeats.length,
      travelDate,
      paymentStatus: "completed",
    });

    // 4. Update Bus Model (Mark seats as booked)
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

    // 5. Generate Ticket
    const ticketNumber =
      "TIX-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    await Ticket.create({
      booking: booking._id,
      ticketNumber,
      qrCode: `QR_${ticketNumber}`,
    });

    // 6. Send Email
    // const emailHtml = `<h1>Booking Confirmed</h1><p>Ticket No: ${ticketNumber}</p><p>Seats: ${selectedSeats.join(", ")}</p>`;
    // await sendEmail({
    //   to: bookerEmail,
    //   subject: "Your Bus Ticket",
    //   html: emailHtml,
    // });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("route")
      .populate("user", "name email");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.isCancelled = true;
    await booking.save();

    // Release seats in Bus model
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

    res.json({ message: "Cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Placeholder for manual re-send if needed
const sendTicket = async (req, res) => {
  res.json({ message: "Feature coming soon" });
};

// EXPORTS - THIS MUST MATCH YOUR ROUTE IMPORTS EXACTLY
module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking,
  sendTicket,
};
