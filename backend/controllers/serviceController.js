const Service = require("../models/Service");

const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort("order"); // admin sees all
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createService = async (req, res) => {
  try {
    const lastService = await Service.findOne().sort("-order");
    const order = lastService ? lastService.order + 1 : 0;

    const service = await Service.create({ ...req.body, order });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getServices, createService, updateService, deleteService };
