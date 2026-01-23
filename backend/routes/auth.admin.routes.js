const express = require("express");
const router = express.Router();
const { adminLogin, registerAdmin } = require("../controllers/authControllers");
const { auth, adminAuth } = require("../middleware/auth");

// Admin login
router.post("/login", adminLogin);

// Register new admin (only existing admin can create)
router.post("/register", auth, adminAuth, registerAdmin);

module.exports = router;
