const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bcrypt = require("bcrypt");
const User = require("./models/User");

// Load env vars
dotenv.config();

// Connect to database
connectDB();
const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Madmin",
    email: "admin@admin.com",
    password: hashedPassword,
    isAdmin: true,
  });

  console.log("Admin created");
};

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/routes", require("./routes/routeRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/buses", require("./routes/busesRoutes"));

// Default route
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
//g714FfgMd8izjAJs
