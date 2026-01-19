const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");
// const {
//   register,
//   login,
//   getProfile,
//   forgotPassword,
//   resetPassword,
// } = require("../controllers/authControllers");
const { auth } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", auth, authController.getProfile);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
