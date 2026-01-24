const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Booking = require("./models/Booking");

// Load env vars
dotenv.config();

// Connect to database
connectDB();
const createAdmin = async () => {
  try {
    await User.create({
      name: "Maddie",
      email: "su@mail.com",
      password: "admin123",
      isAdmin: true,
    });
  } catch (error) {
    console.error({ error: error.message });
  }
  console.log("Admin created");
};

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/routes", require("./routes/routeRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/bookings", require("./routes/users/bookingRoutes"));
app.use("/api/buses", require("./routes/busesRoutes"));

// Admin routes
app.use("/api/admin/auth", require("./routes/admin/auth.admin.routes"));
app.use("/api/admin", require("./routes/admin/admin.routes"));
app.use("/api/admin/services", require("./routes/serviceRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
//g714FfgMd8izjAJs
