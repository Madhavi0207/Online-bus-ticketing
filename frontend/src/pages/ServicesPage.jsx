import React, { useState, useEffect } from "react";
import {
  Ticket,
  Smartphone,
  MapPin,
  Bell,
  CreditCard,
  Gift,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import { servicesAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Navbar from "../components/common/NavBar";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safety First",
      description: "Regular maintenance, trained drivers, and safety protocols",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "On-time Service",
      description: "95% on-time departure and arrival record",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Customer Support",
      description: "24/7 customer support via call, email, and chat",
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="section-container p-20">
      <div className="text-center mb-2">
        <h1 className="text-5xl font-bold text-yellow-500 mb-4">
          Our Premium Services
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We offer a comprehensive suite of services to ensure your journey is
          comfortable, safe, and memorable.
        </p>
      </div>

      {/* Main Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16 ">
        {services.map((service) => (
          <div
            key={service._id}
            className="card hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {service.title}
            </h3>
            <p className="text-gray-600 mb-6">{service.description}</p>
            <div className="text-primary-600 font-semibold">Learn more →</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="bg-linear-to-r from-primary-50 to-blue-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Choose LuxuryRide?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center border p-20 rounded-lg bg-white shadow-md"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                <div className="text-primary-600">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Process */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">Easy Booking in 3 Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto ">
          <div className="relative border-4 border-primary-500 rounded p-6">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-600 text-black rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div className="card pt-8">
              <h3 className="text-xl font-semibold mb-3">Select Route</h3>
              <p className="text-gray-600">
                Choose from our popular routes across Nepal
              </p>
            </div>
          </div>
          <div className="relative  border-4 border-primary-500 rounded-lg p-15">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-600 text-black rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div className="card pt-8">
              <h3 className="text-xl font-semibold mb-3">Choose Seats</h3>
              <p className="text-gray-600">
                Pick your preferred seats with interactive map
              </p>
            </div>
          </div>
          <div className="relative border-4 border-primary-500 rounded-lg p-15">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-600 text-black rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div className="card pt-8">
              <h3 className="text-xl font-semibold mb-3">Confirm & Pay</h3>
              <p className="text-gray-600">
                Secure payment and instant confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
