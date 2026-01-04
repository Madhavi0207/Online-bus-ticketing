import React, { useState, useEffect } from "react";
import { servicesAPI, routesAPI, adminAPI } from "../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBus,
  FaUsers,
  FaMoneyBill,
  FaChartLine,
  FaTicketAlt,
} from "react-icons/fa";
import { format } from "date-fns";
import toast from "react-hot-toast";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [services, setServices] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);

  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    icon: "FaBus",
    displayOrder: 0,
    isActive: true,
  });

  const [routeForm, setRouteForm] = useState({
    from: "",
    to: "",
    description: "",
    duration: "",
    price: "",
    departureTimes: ["08:00", "12:00", "16:00"],
    busType: "standard",
    amenities: [],
    isPopular: false,
    isActive: true,
  });

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchDashboardStats();
    } else if (activeTab === "services") {
      fetchServices();
    } else if (activeTab === "routes") {
      fetchRoutes();
    } else if (activeTab === "bookings") {
      fetchBookings();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setDashboardStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
    }
  };

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await routesAPI.getAll();
      setRoutes(response.data.routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Failed to load routes");
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await adminAPI.getAllBookings();
      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingService) {
        await servicesAPI.update(editingService._id, serviceForm);
        toast.success("Service updated successfully!");
      } else {
        await servicesAPI.create(serviceForm);
        toast.success("Service created successfully!");
      }

      fetchServices();
      setShowServiceForm(false);
      setEditingService(null);
      setServiceForm({
        title: "",
        description: "",
        icon: "FaBus",
        displayOrder: 0,
        isActive: true,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Operation failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const routeData = {
        ...routeForm,
        price: Number(routeForm.price),
      };

      if (editingRoute) {
        await routesAPI.update(editingRoute._id, routeData);
        toast.success("Route updated successfully!");
      } else {
        await routesAPI.create(routeData);
        toast.success("Route created successfully!");
      }

      fetchRoutes();
      setShowRouteForm(false);
      setEditingRoute(null);
      setRouteForm({
        from: "",
        to: "",
        description: "",
        duration: "",
        price: "",
        departureTimes: ["08:00", "12:00", "16:00"],
        busType: "standard",
        amenities: [],
        isPopular: false,
        isActive: true,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Operation failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      icon: service.icon,
      displayOrder: service.displayOrder || 0,
      isActive: service.isActive,
    });
    setShowServiceForm(true);
  };

  const handleEditRoute = (route) => {
    setEditingRoute(route);
    setRouteForm({
      from: route.from,
      to: route.to,
      description: route.description,
      duration: route.duration,
      price: route.price.toString(),
      departureTimes: route.departureTimes || ["08:00", "12:00", "16:00"],
      busType: route.busType || "standard",
      amenities: route.amenities || [],
      isPopular: route.isPopular || false,
      isActive: route.isActive,
    });
    setShowRouteForm(true);
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await servicesAPI.delete(id);
        toast.success("Service deleted successfully!");
        fetchServices();
      } catch (error) {
        const message = error.response?.data?.message || "Delete failed";
        toast.error(message);
      }
    }
  };

  const handleDeleteRoute = async (id) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await routesAPI.delete(id);
        toast.success("Route deleted successfully!");
        fetchRoutes();
      } catch (error) {
        const message = error.response?.data?.message || "Delete failed";
        toast.error(message);
      }
    }
  };

  const iconOptions = [
    "FaBus",
    "FaTicketAlt",
    "FaMobileAlt",
    "FaChair",
    "FaMapMarkedAlt",
    "FaShieldAlt",
    "FaGift",
    "FaClock",
    "FaCreditCard",
    "FaUserFriends",
  ];

  const busTypeOptions = ["standard", "luxury", "sleeper"];
  const amenitiesOptions = ["wifi", "ac", "charging", "tv", "blanket", "water"];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your bus ticketing system</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {["dashboard", "services", "routes", "bookings", "users"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </nav>
      </div>

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && dashboardStats && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full mr-4">
                  <FaTicketAlt className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.totalBookings}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full mr-4">
                  <FaUsers className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confirmed Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.confirmedBookings}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <FaMoneyBill className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cancelled Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboardStats.cancelledBookings}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full mr-4">
                  <FaChartLine className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    NPR {dashboardStats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Bookings
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Passenger
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardStats.recentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.bookingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.route?.from} → {booking.route?.to}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.user?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        NPR {booking.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(booking.bookingDate), "MMM dd, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === "services" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Manage Services
            </h2>
            <button
              onClick={() => {
                setShowServiceForm(true);
                setEditingService(null);
                setServiceForm({
                  title: "",
                  description: "",
                  icon: "FaBus",
                  displayOrder: 0,
                  isActive: true,
                });
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FaPlus className="mr-2" /> Add Service
            </button>
          </div>

          {showServiceForm && (
            <div className="card mb-6">
              <h3 className="text-xl font-bold mb-4">
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <form onSubmit={handleServiceSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          title: e.target.value,
                        })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon
                    </label>
                    <select
                      value={serviceForm.icon}
                      onChange={(e) =>
                        setServiceForm({ ...serviceForm, icon: e.target.value })
                      }
                      className="input-field"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>
                          {icon}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={serviceForm.displayOrder}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          displayOrder: parseInt(e.target.value) || 0,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={serviceForm.isActive}
                      onChange={(e) =>
                        setServiceForm({
                          ...serviceForm,
                          isActive: e.target.value === "true",
                        })
                      }
                      className="input-field"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        description: e.target.value,
                      })
                    }
                    className="input-field"
                    rows="3"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : editingService
                      ? "Update Service"
                      : "Add Service"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowServiceForm(false);
                      setEditingService(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Icon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => (
                    <tr key={service._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-blue-600">{service.icon}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {service.title}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {service.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {service.displayOrder}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            service.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditService(service)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Routes Tab */}
      {activeTab === "routes" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Manage Routes</h2>
            <button
              onClick={() => {
                setShowRouteForm(true);
                setEditingRoute(null);
                setRouteForm({
                  from: "",
                  to: "",
                  description: "",
                  duration: "",
                  price: "",
                  departureTimes: ["08:00", "12:00", "16:00"],
                  busType: "standard",
                  amenities: [],
                  isPopular: false,
                  isActive: true,
                });
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <FaPlus className="mr-2" /> Add Route
            </button>
          </div>

          {showRouteForm && (
            <div className="card mb-6">
              <h3 className="text-xl font-bold mb-4">
                {editingRoute ? "Edit Route" : "Add New Route"}
              </h3>
              <form onSubmit={handleRouteSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From *
                    </label>
                    <input
                      type="text"
                      value={routeForm.from}
                      onChange={(e) =>
                        setRouteForm({ ...routeForm, from: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To *
                    </label>
                    <input
                      type="text"
                      value={routeForm.to}
                      onChange={(e) =>
                        setRouteForm({ ...routeForm, to: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={routeForm.duration}
                      onChange={(e) =>
                        setRouteForm({ ...routeForm, duration: e.target.value })
                      }
                      className="input-field"
                      placeholder="e.g., 6-7 hours"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (NPR) *
                    </label>
                    <input
                      type="number"
                      value={routeForm.price}
                      onChange={(e) =>
                        setRouteForm({ ...routeForm, price: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bus Type
                    </label>
                    <select
                      value={routeForm.busType}
                      onChange={(e) =>
                        setRouteForm({ ...routeForm, busType: e.target.value })
                      }
                      className="input-field"
                    >
                      {busTypeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={routeForm.isActive}
                      onChange={(e) =>
                        setRouteForm({
                          ...routeForm,
                          isActive: e.target.value === "true",
                        })
                      }
                      className="input-field"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={routeForm.description}
                    onChange={(e) =>
                      setRouteForm({
                        ...routeForm,
                        description: e.target.value,
                      })
                    }
                    className="input-field"
                    rows="2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Times (comma separated)
                  </label>
                  <input
                    type="text"
                    value={routeForm.departureTimes.join(", ")}
                    onChange={(e) =>
                      setRouteForm({
                        ...routeForm,
                        departureTimes: e.target.value
                          .split(",")
                          .map((t) => t.trim()),
                      })
                    }
                    className="input-field"
                    placeholder="08:00, 12:00, 16:00"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {amenitiesOptions.map((amenity) => (
                      <label key={amenity} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={routeForm.amenities.includes(amenity)}
                          onChange={(e) => {
                            const updatedAmenities = e.target.checked
                              ? [...routeForm.amenities, amenity]
                              : routeForm.amenities.filter(
                                  (a) => a !== amenity
                                );
                            setRouteForm({
                              ...routeForm,
                              amenities: updatedAmenities,
                            });
                          }}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={routeForm.isPopular}
                      onChange={(e) =>
                        setRouteForm({
                          ...routeForm,
                          isPopular: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Mark as Popular Route
                    </span>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : editingRoute
                      ? "Update Route"
                      : "Add Route"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRouteForm(false);
                      setEditingRoute(null);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bus Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {routes.map((route) => (
                    <tr key={route._id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {route.from} → {route.to}
                        </div>
                        <div className="text-sm text-gray-500">
                          {route.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {route.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        NPR {route.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            route.isPopular
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {route.isPopular ? "Popular" : route.busType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            route.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {route.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditRoute(route)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteRoute(route._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Bookings
          </h2>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {booking.bookingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.user?.name}
                        <br />
                        <span className="text-xs">{booking.user?.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.route?.from} → {booking.route?.to}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.seatNumbers?.join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        NPR {booking.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(
                          new Date(booking.bookingDate),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Users</h2>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.bookings?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
