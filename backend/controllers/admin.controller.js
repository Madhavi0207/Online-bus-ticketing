const User = require("../models/User");
const Booking = require("../models/Booking");
const Route = require("../models/route.model");
const Bus = require("../models/bus.model");
const sendEmail = require("../utils/email");
const mongoose = require("mongoose");

/* =====================================================
   DASHBOARD STATS
===================================================== */
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalBookings, totalRoutes, totalRevenue] =
      await Promise.all([
        User.countDocuments(),
        Booking.countDocuments(),
        Route.countDocuments(),
        Booking.aggregate([
          { $match: { paymentStatus: "completed", isCancelled: false } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
      ]);

    res.json({
      totalUsers,
      totalBookings,
      totalRoutes,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};

exports.getRecentBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("route")
      .populate("bus")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recent bookings" });
  }
};

/* =====================================================
   USERS MANAGEMENT
===================================================== */
exports.getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {};
    if (req.query.isAdmin) filters.isAdmin = req.query.isAdmin === "true";
    if (req.query.email) filters.email = new RegExp(req.query.email, "i");

    const total = await User.countDocuments(filters);
    const users = await User.find(filters)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ data: users, total });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
};

exports.toggleAdminStatus = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isAdmin = !user.isAdmin;
  await user.save();

  res.json({ message: "Admin status updated", isAdmin: user.isAdmin });
};

exports.searchUsers = async (req, res) => {
  const q = req.query.q || "";
  const users = await User.find({
    $or: [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }],
  }).select("-password");

  res.json(users);
};

/* =====================================================
   ROUTES MANAGEMENT
===================================================== */
exports.getAllRoutes = async (req, res) => {
  const routes = await Route.find().sort({ createdAt: -1 });
  res.json(routes);
};

exports.getRouteById = async (req, res) => {
  const route = await Route.findById(req.params.id);
  if (!route) return res.status(404).json({ message: "Route not found" });
  res.json(route);
};

exports.createRoute = async (req, res) => {
  const route = await Route.create(req.body);
  res.status(201).json(route);
};

exports.updateRoute = async (req, res) => {
  const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!route) return res.status(404).json({ message: "Route not found" });
  res.json(route);
};

exports.deleteRoute = async (req, res) => {
  await Route.findByIdAndDelete(req.params.id);
  res.json({ message: "Route deleted successfully" });
};

/* =====================================================
   BOOKINGS MANAGEMENT
===================================================== */
exports.getAllBookings = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filters = {};
  if (req.query.paymentStatus) filters.paymentStatus = req.query.paymentStatus;
  if (req.query.isCancelled)
    filters.isCancelled = req.query.isCancelled === "true";

  const total = await Booking.countDocuments(filters);
  const bookings = await Booking.find(filters)
    .populate("user", "name email")
    .populate("route")
    .populate("bus")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({ data: bookings, total });
};

exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  booking.isCancelled = true;
  await booking.save();

  res.json({ message: "Booking cancelled successfully" });
};

exports.sendTicketEmail = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("user");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  await sendEmail({
    to: booking.bookerEmail,
    subject: "Your Bus Ticket",
    text: `Your booking for ${booking.route} is confirmed.`,
  });

  res.json({ message: "Ticket sent successfully" });
};

exports.bulkSendTickets = async (req, res) => {
  const { bookingIds } = req.body;

  const bookings = await Booking.find({
    _id: { $in: bookingIds },
  });

  for (const booking of bookings) {
    await sendEmail({
      to: booking.bookerEmail,
      subject: "Your Bus Ticket",
      text: "Your ticket details are attached.",
    });
  }

  res.json({ message: "Tickets sent successfully" });
};

/* =====================================================
   ANALYTICS
===================================================== */
exports.getBookingAnalytics = async (req, res) => {
  const { startDate, endDate } = req.query;

  const data = await Booking.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: "$createdAt" },
        totalBookings: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  res.json(data);
};

/* =====================================================
   REPORTS
===================================================== */
exports.generateBookingReport = async (req, res) => {
  const bookings = await Booking.find()
    .populate("user route bus")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

exports.generateRevenueReport = async (req, res) => {
  const revenue = await Booking.aggregate([
    { $match: { paymentStatus: "completed" } },
    { $group: { _id: null, total: { $sum: "$totalAmount" } } },
  ]);
  res.json(revenue[0] || { total: 0 });
};

exports.generateUserReport = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
