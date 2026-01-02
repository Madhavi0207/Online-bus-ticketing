const express = require("express");
const router = express.Router();
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { auth, adminAuth } = require("../middleware/auth");

router.get("/", getServices);
router.post("/", auth, adminAuth, createService);
router.put("/:id", auth, adminAuth, updateService);
router.delete("/:id", auth, adminAuth, deleteService);

module.exports = router;
