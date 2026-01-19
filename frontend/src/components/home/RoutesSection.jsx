import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { routesAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const RoutesSection = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await routesAPI.getAll();
      setRoutes(response.data.slice(0, 4)); // Show only 4 routes
    } catch (error) {
      console.error("Error fetching routes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="section-container">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Popular Routes
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our most popular travel routes across Nepal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {routes.map((route) => (
          <div
            key={route._id}
            className="card border-2 border-gray-200 hover:border-primary-500"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {route.from} → {route.to}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {route.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  NPR {route.price}
                </div>
                <div className="text-sm text-gray-500">per seat</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{route.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{route.availableSeats} seats left</span>
                </div>
              </div>
              <div className="text-sm font-medium">
                Departs: {route.departureTime}
              </div>
            </div>

            <div className="flex space-x-3">
              <Link
                to={`/booking?route=${route._id}`}
                className="btn-primary flex-1 flex items-center justify-center space-x-2"
              >
                <span>Book Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={`/routes/${route._id}`}
                className="btn-secondary flex-1 text-center"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/routes"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
        >
          <span>View All Routes</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
};

export default RoutesSection;
