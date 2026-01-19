import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, MapPin } from "lucide-react";
import { routesAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";
import { format } from "date-fns";

const RouteSelector = ({ onSelectRoute, selectedDate }) => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    filterRoutes();
    const filterRoutes = () => {
      let filtered = [...routes];

      // Search term filter
      if (searchTerm) {
        filtered = filtered.filter(
          (route) =>
            route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // From filter
      if (filters.from) {
        filtered = filtered.filter((route) =>
          route.from.toLowerCase().includes(filters.from.toLowerCase())
        );
      }

      // To filter
      if (filters.to) {
        filtered = filtered.filter((route) =>
          route.to.toLowerCase().includes(filters.to.toLowerCase())
        );
      }

      // Price range filter
      if (filters.minPrice) {
        filtered = filtered.filter(
          (route) => route.price >= parseInt(filters.minPrice)
        );
      }

      if (filters.maxPrice) {
        filtered = filtered.filter(
          (route) => route.price <= parseInt(filters.maxPrice)
        );
      }

      setFilteredRoutes(filtered);
    };
  }, [routes, searchTerm, filters, selectedDate]);

  const fetchRoutes = async () => {
    try {
      const response = await routesAPI.getAll();
      setRoutes(response.data);
      setFilteredRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
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
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
                Min Price (NPR)
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price (NPR)
              </label>
              <input
                type="number"
                placeholder="5000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Selected Date */}
          {selectedDate && (
            <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                <span className="font-medium">Travel Date:</span>
                <span>{format(new Date(selectedDate), "PPP")}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Routes List */}
      <div className="space-y-4">
        {filteredRoutes.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No routes found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredRoutes.map((route) => (
            <div
              key={route._id}
              className="card hover:shadow-xl cursor-pointer transition-all duration-300 hover:border-primary-500"
              onClick={() => onSelectRoute(route)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">
                        {route.departureTime}
                      </div>
                      <div className="text-sm text-gray-500">Departure</div>
                    </div>
                    <div className="flex-1 text-center">
                      <div className="text-lg font-semibold">
                        {route.from} → {route.to}
                      </div>
                      <div className="text-sm text-gray-600">
                        {route.duration}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Arrival</div>
                      <div className="text-lg font-semibold">Est. 6:00 PM</div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{route.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{route.availableSeats} seats available</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    NPR {route.price}
                  </div>
                  <div className="text-sm text-gray-500 mb-4">per seat</div>
                  <button
                    onClick={() => onSelectRoute(route)}
                    className="btn-primary w-full md:w-auto"
                  >
                    Select Route
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RouteSelector;
