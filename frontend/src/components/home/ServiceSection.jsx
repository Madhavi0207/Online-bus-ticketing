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
    <section className="section-container bg-gray-50">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We provide premium services to make your journey comfortable and
          hassle-free
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon] || Ticket;
          return (
            <div key={service._id} className="card hover:border-primary-500">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <IconComponent className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
