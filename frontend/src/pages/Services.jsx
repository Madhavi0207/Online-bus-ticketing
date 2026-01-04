import React, { useState, useEffect } from "react";
import { servicesAPI } from "../services/api";
import {
  FaTicketAlt,
  FaShieldAlt,
  FaMobileAlt,
  FaGift,
  FaChair,
  FaMapMarkedAlt,
  FaBus,
  FaClock,
  FaCreditCard,
  FaUserFriends,
} from "react-icons/fa";
import toast from "react-hot-toast";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const iconComponents = {
    FaTicketAlt,
    FaShieldAlt,
    FaMobileAlt,
    FaGift,
    FaChair,
    FaMapMarkedAlt,
    FaBus,
    FaClock,
    FaCreditCard,
    FaUserFriends,
  };

  const defaultServices = [
    {
      title: "Easy Ticketing",
      description:
        "Book your tickets in seconds with our streamlined ticketing system. No hassle, just convenience.",
      icon: "FaTicketAlt",
    },
    {
      title: "Secure Payments",
      description:
        "Multiple payment options with bank-grade security for your peace of mind.",
      icon: "FaShieldAlt",
    },
    {
      title: "Mobile Booking",
      description:
        "Book on the go with our mobile-friendly platform. Your journey starts at your fingertips.",
      icon: "FaMobileAlt",
    },
    {
      title: "Rewards Program",
      description:
        "Earn points with every booking and redeem them for exciting discounts and offers.",
      icon: "FaGift",
    },
    {
      title: "Seat Selection",
      description:
        "Choose your preferred seat from our interactive seat map for maximum comfort.",
      icon: "FaChair",
    },
    {
      title: "Real-Time Updates",
      description:
        "Stay informed with live bus tracking and instant notifications about your journey.",
      icon: "FaMapMarkedAlt",
    },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          We offer a comprehensive range of services to make your travel
          experience seamless and enjoyable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayServices.map((service, index) => {
          const IconComponent = iconComponents[service.icon] || FaBus;
          return (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-blue-200"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-blue-50 group-hover:bg-blue-100 rounded-xl transition-colors duration-300">
                  <IconComponent className="h-12 w-12 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {service.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Additional Services Info */}
      <div className="mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Our Services?
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="shrink-0 h-6 w-6 text-green-500 mt-1">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-3 text-gray-700">
                  24/7 Customer Support
                </span>
              </li>
              <li className="flex items-start">
                <div className="shrink-0 h-6 w-6 text-green-500 mt-1">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-3 text-gray-700">
                  Secure & Reliable Platform
                </span>
              </li>
              <li className="flex items-start">
                <div className="shrink-0 h-6 w-6 text-green-500 mt-1">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-3 text-gray-700">
                  Easy Cancellation & Refund
                </span>
              </li>
              <li className="flex items-start">
                <div className="shrink-0 h-6 w-6 text-green-500 mt-1">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-3 text-gray-700">
                  Flexible Rescheduling
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Need Assistance?
            </h3>
            <p className="text-gray-600 mb-6">
              Our customer support team is available round the clock to help you
              with bookings, cancellations, and any queries you might have.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-blue-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-gray-700">+977 86454788858</span>
              </div>
              <div className="flex items-center">
                <svg
                  className="h-6 w-6 text-blue-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-700">support@letsgo.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
