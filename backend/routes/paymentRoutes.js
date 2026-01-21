const express = require("express");
const router = express.Router();
const axios = require("axios");
const Booking = require("../models/Booking");

// Khalti secret key from env
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Initiate Payment
router.post("/khalti/initiate", async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("user route");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const payload = {
      return_url: `${FRONTEND_URL}/payment-success?bookingId=${booking._id}`,
      website_url: FRONTEND_URL,
      amount: booking.totalAmount * 100, // convert to paisa
      purchase_order_id: booking._id.toString(),
      purchase_order_name: `${booking.route.from} → ${booking.route.to} Bus Ticket`,
      customer_info: {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone || "",
      },
      amount_breakdown: booking.seats.map((seat) => ({
        label: `Seat ${seat.seatNumber}`,
        amount: booking.route.price * 100,
      })),
      product_details: booking.seats.map((seat) => ({
        identity: seat.seatNumber,
        name: seat.passengerName,
        quantity: 1,
        unit_price: booking.route.price * 100,
        total_price: booking.route.price * 100,
      })),
    };

    const khaltiRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      payload,
      { headers: { Authorization: `Key ${KHALTI_SECRET_KEY}` } },
    );

    // Save pidx and optionally QR URL
    booking.khaltiPaymentId = khaltiRes.data.pidx;
    booking.khaltiQrCodeUrl = khaltiRes.data.payment_url; // optional
    await booking.save();

    res.json({ payment_url: khaltiRes.data.payment_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
});

// Verify Payment
router.post("/khalti/verify", async (req, res) => {
  try {
    const { pidx, bookingId } = req.body;
    const lookupRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      { headers: { Authorization: `Key ${KHALTI_SECRET_KEY}` } },
    );

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (lookupRes.data.status === "Completed") {
      booking.paymentStatus = "completed";
      await booking.save();
      return res.json({ message: "Payment completed" });
    } else {
      booking.paymentStatus = "failed";
      await booking.save();
      return res.status(400).json({ message: "Payment failed or pending" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

module.exports = router;
