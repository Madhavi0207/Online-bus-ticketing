const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("../config/db"); // adjust if different
const User = require("../models/User"); // adjust to your User model path

async function run() {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASS || "AdminPass123!";
  const hash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = "admin";
    existing.isAdmin = true;
    existing.password = hash;
    await existing.save();
    console.log("Updated existing user to admin");
  } else {
    await User.create({ email, password: hash, role: "admin", isAdmin: true });
    console.log("Admin user created");
  }
  process.exit();
}
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
