const express = require("express");
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController"); // <- note plural "serviceControllers"
const { auth, adminAuth } = require("../middleware/auth");

// Get all services (admin can also see all)
router.get("/", auth, adminAuth, getServices);

// CRUD routes
router.post("/", auth, adminAuth, createService);
router.put("/:id", auth, adminAuth, updateService);
router.delete("/:id", auth, adminAuth, deleteService);

module.exports = router;
