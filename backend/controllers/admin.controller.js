// const User = require("../models/User");

// // Get all users (admin only)
// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Delete user (admin only)
// const deleteUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     await user.remove();
//     res.json({ message: "User removed" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = { getUsers, deleteUser };

const User = require("../models/User");
const Bus = require("../models/bus.model");
const Route = require("../models/route.model");
const Booking = require("../models/Booking");

// ===== Users =====
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ===== Buses =====
exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ===== Bookings =====
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user").populate("bus");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ===== Routes =====
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate("bus");
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createRoute = async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    await Route.findByIdAndDelete(req.params.id);
    res.json({ message: "Route deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
