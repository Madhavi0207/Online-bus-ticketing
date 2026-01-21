const Booking = require("../models/Booking");
const Route = require("../models/route.model.js");
const Bus = require("../models/bus.model");
const Ticket = require("../models/Ticket"); // New Ticket Model
const sendEmail = require("../utils/email");

// Create booking
const createBooking = async (req, res) => {
  try {
    const {
      busId,
      routeId,
      selectedSeats,
      travelDate,
      bookerName,
      bookerEmail,
      bookerPhone,
    } = req.body;

    const userId = req.user.id;

    // 1. Validation: Maximum 6 seats
    if (selectedSeats.length > 6) {
      return res
        .status(400)
        .json({ error: "Maximum 6 seats allowed per booking" });
    }

    // 2. Check Bus and Route existence
    const bus = await Bus.findById(busId);
    const route = await Route.findById(routeId);
    if (!bus || !route) {
      return res.status(404).json({ error: "Bus or Route not found" });
    }

    // 3. Check specific seat availability in the Bus model
    const unavailableSeats = bus.seats.filter(
      (s) => selectedSeats.includes(s.seatNumber) && s.isBooked,
    );
    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        error: `Seats ${unavailableSeats.map((s) => s.seatNumber).join(", ")} are already booked`,
      });
    }

    // 4. Calculate total amount
    const totalAmount = bus.price * selectedSeats.length;

    // 5. Create the Booking record
    const booking = await Booking.create({
      user: userId,
      bus: busId,
      route: routeId,
      selectedSeats, // Array of strings ["A1", "A2"]
      bookerName,
      bookerEmail,
      bookerPhone,
      totalAmount,
      travelDate,
      paymentStatus: "completed", // Auto-complete for now
    });

    // 6. UPDATE BUS: Mark specific seats as booked
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

    // 7. UPDATE ROUTE: Decrease available seats count
    route.availableSeats -= selectedSeats.length;
    await route.save();

    // 8. GENERATE TICKET: Create the ticket record
    const ticketNumber =
      "TIX-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    const ticket = await Ticket.create({
      booking: booking._id,
      ticketNumber: ticketNumber,
      qrCode: `QR_${ticketNumber}`, // Logic placeholder
    });

    // 9. SEND EMAIL: Send ticket to the provided bookerEmail
    const emailContent = `
      <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px;">
        <h2>Ticket Confirmation</h2>
        <p>Hello <b>${bookerName}</b>,</p>
        <p>Your booking is confirmed for <b>${new Date(travelDate).toLocaleDateString()}</b>.</p>
        <hr/>
        <p><b>Ticket No:</b> ${ticketNumber}</p>
        <p><b>Route:</b> ${route.from} to ${route.to}</p>
        <p><b>Seats:</b> ${selectedSeats.join(", ")}</p>
        <p><b>Total Paid:</b> NPR ${totalAmount}</p>
        <br/>
        <p>Please present this ticket number or email while boarding.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: bookerEmail,
        subject: `Your Bus Ticket - ${ticketNumber}`,
        html: emailContent,
      });
      // Update ticket status
      ticket.sentToEmail = true;
      ticket.emailSentAt = Date.now();
      await ticket.save();
    } catch (emailErr) {
      console.error("Email failed to send:", emailErr);
      // We don't fail the request if email fails, but we log it
    }

    res
      .status(201)
      .json({ message: "Booking successful", booking, ticketNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Keep your existing getUserBookings and cancelBooking but update references
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("route")
      .populate("bus")
      .sort("-bookingDate");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings: async (req, res) => {
    /* ... existing ... */
  },
  cancelBooking: async (req, res) => {
    /* ... updated logic to release seats in Bus model too ... */
  },
};
