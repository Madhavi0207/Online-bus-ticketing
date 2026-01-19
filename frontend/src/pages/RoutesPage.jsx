import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import busesAPI from "../services/busesAPI.js"; // Assuming busesAPI exists; create if not
import LoadingSpinner from "../components/common/LoadingSpinner";

const RoutesPage = () => {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    sortBy: "price",
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    filterAndSortRoutes();
  }, [buses, searchTerm, filters]);

  const fetchRoutes = async () => {
    try {
      const response = await busesAPI.getAll(); // Fetch buses with populated routes
      setBuses(response.data);
      setFilteredBuses(response.data);
    } catch (error) {
      console.error("Error fetching buses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRoutes = () => {
    let filtered = [...buses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (bus) =>
          bus.route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bus.route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // From filter
    if (filters.from) {
      filtered = filtered.filter((bus) =>
        bus.route.from.toLowerCase().includes(filters.from.toLowerCase()),
      );
    }

    // To filter
    if (filters.to) {
      filtered = filtered.filter((bus) =>
        bus.route.to.toLowerCase().includes(filters.to.toLowerCase()),
      );
    }

    // Sort
    switch (filters.sortBy) {
      case "price":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "duration":
        // Assuming duration is in route; add if needed
        break;
      case "seats":
        filtered.sort((a, b) => b.totalSeats - a.totalSeats); // Or calculate available
        break;
      default:
        break;
    }

    setFilteredBuses(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="section-container">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Explore Our Routes
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the most scenic and comfortable bus routes across Nepal
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Routes
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by city or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Departure city"
                value={filters.from}
                onChange={(e) => handleFilterChange("from", e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Destination city"
                value={filters.to}
                onChange={(e) => handleFilterChange("to", e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              className="input-field"
            >
              <option value="price">Price: Low to High</option>
              <option value="duration">Duration: Shortest</option>
              <option value="seats">Available Seats</option>
            </select>
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      {filteredBuses.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-medium text-gray-900 mb-2">
            No routes found
          </h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuses.map((bus) => (
            <div
              key={bus._id}
              className="card hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm font-semibold text-primary-600 mb-1">
                    {bus.departureTime}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {bus.route.from} → {bus.route.to}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    NPR {bus.price}
                  </div>
                  <div className="text-sm text-gray-500">per seat</div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">Bus: {bus.busNumber}</p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{bus.route.duration || "N/A"}</span>{" "}
                  {/* Assuming duration in route */}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{bus.totalSeats} seats total</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link
                  to={`/booking?bus=${bus._id}`}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <span>Book Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={`/buses/${bus._id}`}
                  className="btn-secondary flex-1 text-center"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 bg-linear-to-r from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{buses.length}</div>
            <div className="text-sm opacity-90">Active Routes</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">40+</div>
            <div className="text-sm opacity-90">Buses</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">95%</div>
            <div className="text-sm opacity-90">On-time Performance</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">50K+</div>
            <div className="text-sm opacity-90">Passengers Monthly</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;
