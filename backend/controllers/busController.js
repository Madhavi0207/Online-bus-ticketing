const Bus = require("../models/bus.model");

const getAllBuses = async (req, res) => {
  try {
    const count = await Bus.countDocuments();
    console.log(`Total buses in DB: ${count}`);
    const busesWithoutPopulate = await Bus.find();
    console.log(`Buses without populate: ${busesWithoutPopulate.length}`);
    const buses = await Bus.find().populate("route");
    console.log(`Found ${buses.length} buses with populate`);
    res.json(buses);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id).populate("route");
    if (!bus) return res.status(404).json({ error: "Bus not found" });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBus = async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bus) return res.status(404).json({ error: "Bus not found" });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ error: "Bus not found" });
    res.json({ message: "Bus deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllBuses, getBusById, createBus, updateBus, deleteBus };
