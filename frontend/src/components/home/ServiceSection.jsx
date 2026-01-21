import React, { useState, useEffect } from "react";
import {
  Ticket,
  Smartphone,
  MapPin,
  Bell,
  CreditCard,
  Gift,
} from "lucide-react";
import { servicesAPI } from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";

const iconMap = {
  "🎫": Ticket,
  "📱": Smartphone,
  "📍": MapPin,
  "🔔": Bell,
  "💳": CreditCard,
  "🎁": Gift,
};

const ServiceSection = () => {
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="section-container bg-white p-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-green-600 mb-4">Our Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We provide premium services to make your journey comfortable and
          hassle-free
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10 items-stretch">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon] || Ticket;
          return (
            // 1. Added h-full to the outer map div
            <div
              key={service._id}
              className="card hover:border-primary-500 h-full"
            >
              {/* 2. Added h-full and flex-1 to the inner wrapper */}
              <div className="flex items-start space-x-4 border-2 rounded p-10 h-full">
                <div className="p-3 bg-primary-100 rounded-lg shrink-0">
                  <IconComponent className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-500 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServiceSection;
