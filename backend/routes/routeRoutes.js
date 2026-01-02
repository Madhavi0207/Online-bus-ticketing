const express = require("express");
const router = express.Router();
const {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} = require("../controllers/routeController");
const { auth, adminAuth } = require("../middleware/auth");

router.get("/", getRoutes);
router.get("/:id", getRouteById);
router.post("/", auth, adminAuth, createRoute);
router.put("/:id", auth, adminAuth, updateRoute);
router.delete("/:id", auth, adminAuth, deleteRoute);

module.exports = router;
