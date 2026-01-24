const Booking = require("../models/Booking");
const axios = require("axios");

exports.initiateKhaltiPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // 1️⃣ Get booking info from DB
    const booking = await Booking.findById(bookingId)
      .populate("user") // to get user name/email
      .populate("route"); // to get route details

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // 2️⃣ Prepare Khalti payload
    const payload = {
      return_url: `${process.env.FRONTEND_URL}/payment-success?bookingId=${booking._id}`,
      website_url: process.env.FRONTEND_URL,
      amount: booking.totalAmount * 100, // paisa
      purchase_order_id: booking._id,
      purchase_order_name: `${booking.route.from} → ${booking.route.to} Bus Ticket`,
      customer_info: {
        name: booking.user.name,
        email: booking.user.email,
      },
      amount_breakdown: booking.selectedSeats.map((seat) => ({
        label: `Seat ${seat}`,
        amount: booking.route.price * 100,
      })),
      product_details: booking.selectedSeats.map((seat) => ({
        identity: seat,
        // name: seat.passengerName,
        qty: 1,
        price: booking.route.price * 100,
        total_price: booking.route.price * 100,
      })),
    };

    // 3️⃣ Send request to Khalti
    const khaltiRes = await axios.post(
      "https://khalti.com/api/v2/checkout/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      },
    );

    // 4️⃣ Store pidx / QR URL in booking
    booking.khaltiPaymentId = khaltiRes.data.pidx;
    booking.khaltiQrCodeUrl = khaltiRes.data.qr_code_url;
    await booking.save();

    // 5️⃣ Return QR URL to frontend
    res.json({
      qr_code_url: khaltiRes.data.qr_code_url,
      payment_url: khaltiRes.data.payment_url,
      pidx: khaltiRes.data.pidx,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to initiate Khalti payment" });
  }
};
