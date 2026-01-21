import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { busesAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";

const AvailableBusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      try {
        const res = await busesAPI.getAll();
        setBuses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="section-container p-10">
      <h2 className="text-3xl font-bold mb-6">Available Buses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buses.map((bus) => (
          <div key={bus._id} className="card p-6 shadow-md">
            <h3 className="text-xl font-semibold">
              {bus.route.from} → {bus.route.to}
            </h3>
            <p>Total Seats: {bus.totalSeats}</p>
            <p>Price: NPR {bus.price}</p>
            <button
              className="btn-primary mt-4"
              onClick={() => navigate(`/booking?bus=${bus._id}`)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableBusesPage;
