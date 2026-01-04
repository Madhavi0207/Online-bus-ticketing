import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBus,
  FaTicketAlt,
  FaMobileAlt,
  FaChair,
  FaMapMarkedAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { servicesAPI, routesAPI } from "../services/api";

const Home = () => {
  const [services, setServices] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, routesRes] = await Promise.all([
        servicesAPI.getAll(),
        routesAPI.getPopular(),
      ]);

      setServices(servicesRes.data.services.slice(0, 6));
      setRoutes(routesRes.data.routes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const iconComponents = {
    FaBus,
    FaTicketAlt,
    FaMobileAlt,
    FaChair,
    FaMapMarkedAlt,
    FaShieldAlt,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div
        className="relative h-150 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-down">
              Let's Go
            </h1>
            <p className="text-xl md:text-2xl mb-8">Your journey starts here</p>

            <div className="mt-12">
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/routes"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  Book Now
                </Link>
                <Link
                  to="/services"
                  className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Preview */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Premium Services
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Experience travel like never before with our exclusive services
            designed for your comfort and convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = iconComponents[service.icon] || FaBus;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-blue-50 group-hover:bg-blue-100 rounded-xl transition-colors duration-300">
                    <IconComponent className="h-12 w-12 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg group"
          >
            View All Services
            <svg
              className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Popular Routes */}
      <div className="bg-linear-to-br from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Routes
            </h2>
            <p className="text-gray-600 text-lg">
              Choose from our most sought-after destinations
            </p>
          </div>

          {routes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {routes.map((route, index) => (
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
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-2">
                          {route.busType || "Standard"}
                        </span>
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
                      {route.amenities && route.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {route.amenities.slice(0, 2).map((amenity, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/booking/${route._id}`}
                      className="block w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-3 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No routes available at the moment.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/routes"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg group"
            >
              Explore All Routes
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Daily Trips</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
