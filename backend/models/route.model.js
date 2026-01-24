const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, require: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Route", routeSchema);
