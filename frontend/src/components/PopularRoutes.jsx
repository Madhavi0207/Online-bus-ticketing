import React from "react";
import { FaMapMarkerAlt, FaClock, FaTicketAlt } from "react-icons/fa";

const PopularRoutes = () => {
  const routes = [
    {
      from: "Kathmandu",
      to: "Pokhara",
      description: "Scenic mountain highway journey",
      duration: "6-7 hours",
      price: "NPR 800",
    },
    {
      from: "Pokhara",
      to: "Kathmandu",
      description: "Return to the capital in comfort",
      duration: "6-7 hours",
      price: "NPR 800",
    },
    {
      from: "Pokhara",
      to: "Chitwan",
      description: "Gateway to jungle adventures",
      duration: "4-5 hours",
      price: "NPR 600",
    },
    {
      from: "Chitwan",
      to: "Pokhara",
      description: "From jungle to lakes",
      duration: "4-5 hours",
      price: "NPR 600",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Popular Routes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-300"
            >
              <div className="flex items-center mb-4">
                <FaMapMarkerAlt className="text-red-500 mr-2" />
                <h3 className="text-lg font-bold text-gray-800">
                  {route.from} → {route.to}
                </h3>
              </div>

              <p className="text-gray-600 mb-4">{route.description}</p>

              <div className="flex items-center mb-4 text-gray-700">
                <FaClock className="mr-2 text-blue-500" />
                <span>Duration: {route.duration}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaTicketAlt className="text-green-500 mr-2" />
                  <span className="text-2xl font-bold text-gray-800">
                    {route.price}
                  </span>
                </div>
              </div>

              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition duration-300 transform hover:scale-105">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;
