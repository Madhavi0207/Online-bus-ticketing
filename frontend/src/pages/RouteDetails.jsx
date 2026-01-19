import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Users, MapPin } from "lucide-react";
import busesAPI from "../services/busesAPI";
import LoadingSpinner from "../components/common/LoadingSpinner";

const RouteDetails = () => {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBus();
  }, [id]);

  const fetchBus = async () => {
    try {
      const response = await busesAPI.getById(id);
      setBus(response.data);
    } catch (error) {
      console.error("Error fetching bus:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!bus) {
    return (
      <div className="section-container text-center">
        <h1 className="text-2xl font-bold">Bus not found</h1>
        <Link to="/routes" className="btn-primary mt-4">
          Back to Routes
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container">
      <Link
        to="/routes"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Routes
      </Link>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {bus.route?.from || "Unknown"} → {bus.route?.to || "Unknown"}
            </h1>
            <p className="text-gray-600">Bus: {bus.busNumber}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              NPR {bus.price}
            </div>
            <div className="text-sm text-gray-500">per seat</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Trip Details</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <span>From: {bus.route?.from || "Unknown"}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <span>To: {bus.route?.to || "Unknown"}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <span>Departure: {bus.departureTime}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <span>Duration: {bus.route?.duration || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-3" />
                <span>Total Seats: {bus.totalSeats}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Booking</h3>
            <Link to={`/booking?bus=${bus._id}`} className="btn-primary w-full">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetails;
