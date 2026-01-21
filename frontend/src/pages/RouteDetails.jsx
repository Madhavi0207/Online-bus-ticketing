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

  if (loading) return <LoadingSpinner />;

  if (!bus) {
    return (
      <div className="section-container text-center">
        <h1 className="text-2xl font-bold">Bus not found</h1>
        <Link to="/routes" className="btn-primary mt-4 inline-block">
          Back to Routes
        </Link>
      </div>
    );
  }

  return (
    <div className="section-container flex flex-col items-center mb-20">
      {/* Back button (unchanged position, enhanced style) */}
      <Link
        to="/routes"
        className="inline-flex items-center mb-6 px-4 py-4 rounded-lg m-10
                   border border-primary-600 text-primary-600
                   hover:bg-primary-600 hover:text-white
                   transition-all duration-300 bg-green-500 text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Routes
      </Link>

      {/* MAIN CARD */}
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-lg 
                   p-10 m-10 text-center
                   transition-all duration-300
                   hover:-translate-y-2 hover:shadow-2xl"
      >
        {/* Route title */}
        <h1 className="text-3xl font-bold text-green-600 mb-1">
          {bus.route?.from || "Unknown"} → {bus.route?.to || "Unknown"}
        </h1>

        {/* Bus number */}
        <p className="text-gray-500 mb-4">
          Bus Number: <span className="font-medium">{bus.busNumber}</span>
        </p>

        {/* Price */}
        <div className="mb-6">
          <p className="text-4xl font-bold text-green-600">NPR {bus.price}</p>
          <p className="text-sm text-gray-500">per seat</p>
        </div>

        {/* Divider */}
        <div className="border-t my-6"></div>

        {/* Trip Details */}
        <h3 className="text-xl font-semibold text-green-600 mb-4">
          Trip Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
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

        {/* Booking Button */}
        <Link
          to={`/booking?bus=${bus._id}`}
          className="btn-primary w-full py-3 text-lg
             transition-all duration-300
             hover:bg-white hover:text-black
             hover:border  bg-green-400 p-4 rounded-md"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default RouteDetails;
