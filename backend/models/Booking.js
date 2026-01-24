const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    selectedSeats: [
      {
        type: String,
        required: true,
      },
    ],
    bookerName: {
      type: String,
      required: true,
    },
    bookerEmail: {
      type: String,
      required: true,
    },
    bookerPhone: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
