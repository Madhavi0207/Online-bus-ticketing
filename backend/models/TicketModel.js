const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  ticketNumber: {
    type: String,
    unique: true,
    required: true,
  },
  qrCode: {
    type: String,
  },
  sentToEmail: {
    type: Boolean,
    default: false,
  },
  emailSentAt: {
    type: Date,
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
