import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { routesAPI } from "../services/api";
import { FaBus, FaSearch, FaFilter } from "react-icons/fa";
import toast from "react-hot-toast";

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    filterRoutes();
  }, [searchTerm, filter, routes]);

  const fetchRoutes = async () => {
    try {
      const response = await routesAPI.getAll();
      setRoutes(response.data.routes);
      setFilteredRoutes(response.data.routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  const filterRoutes = () => {
    let filtered = routes;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (route) =>
          route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filter !== "all") {
      if (filter === "popular") {
        filtered = filtered.filter((route) => route.isPopular);
      } else {
        filtered = filtered.filter((route) => route.busType === filter);
      }
    }

    setFilteredRoutes(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Explore Routes
        </h1>
        <p className="text-gray-600">
          Find your perfect journey from our extensive route network
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Routes
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by destination or route..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field pl-10"
              >
                <option value="all">All Routes</option>
                <option value="popular">Popular Routes</option>
                <option value="standard">Standard Bus</option>
                <option value="luxury">Luxury Bus</option>
                <option value="sleeper">Sleeper Bus</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Routes Grid */}
      {filteredRoutes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoutes.map((route, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {route.from} → {route.to}
                    </h3>
                    <div className="flex items-center mt-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          route.isPopular
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {route.isPopular
                          ? "Popular"
                          : route.busType || "Standard"}
                      </span>
                    </div>
                  </div>
                  <FaBus className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {route.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Duration: {route.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Price: NPR {route.price}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="h-5 w-5 text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Seats available: {route.availableSeats}</span>
                  </div>
                  {route.amenities && route.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {route.amenities.slice(0, 3).map((amenity, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {route.amenities.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          +{route.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Link
                    to={`/booking/${route._id}`}
                    className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-3 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg"
                  >
                    Book Now
                  </Link>
                  <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <svg
            className="h-16 w-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No routes found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilter("all");
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {routes.length}
            </div>
            <div className="text-gray-700 font-medium">Total Routes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {routes.filter((r) => r.isPopular).length}
            </div>
            <div className="text-gray-700 font-medium">Popular Routes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {routes.filter((r) => r.availableSeats > 0).length}
            </div>
            <div className="text-gray-700 font-medium">Available Routes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {Math.min(...routes.map((r) => r.price)) || 0}
            </div>
            <div className="text-gray-700 font-medium">
              Starting Price (NPR)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesPage;
