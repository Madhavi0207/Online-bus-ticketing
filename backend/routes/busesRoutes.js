const express = require("express");
const router = express.Router();
const {
  getAllBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
} = require("../controllers/busController");
const { auth, adminAuth } = require("../middleware/auth");

router.get("/", getAllBuses);
router.get("/:id", getBusById);
router.post("/", auth, adminAuth, createBus);
router.put("/:id", auth, adminAuth, updateBus);
router.delete("/:id", auth, adminAuth, deleteBus);

module.exports = router;
