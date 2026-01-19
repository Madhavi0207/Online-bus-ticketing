const express = require("express");
const router = express.Router();
const { getUsers, deleteUser } = require("../controllers/userControllers");
const { auth, adminAuth } = require("../middleware/auth");

router.get("/", auth, adminAuth, getUsers);
router.delete("/:id", auth, adminAuth, deleteUser);

module.exports = router;
