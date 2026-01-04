import React, { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          Have questions or need assistance? We're here to help! Reach out to us
          through any of the channels below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <FaPhone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                <p className="text-gray-600">+977 86454788858</p>
                <p className="text-sm text-gray-500">Available 24/7</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <FaEnvelope className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">adgribo@sdrhnf.com</p>
                <p className="text-sm text-gray-500">
                  Response within 24 hours
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <FaMapMarkerAlt className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                <p className="text-gray-600">Pokhara, Nepal</p>
                <p className="text-sm text-gray-500">Visit our office</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Connect With Us
            </h3>
            <p className="text-gray-600 mb-4">
              Follow us on social media for the latest updates, offers, and
              travel tips.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200"
              >
                <FaFacebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Type your message here..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <details className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                <summary className="font-medium text-gray-900 cursor-pointer flex justify-between items-center">
                  How can I cancel my booking?
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-600">
                  You can cancel your booking from the "My Bookings" section in
                  your account. Cancellations are allowed up to 2 hours before
                  departure. Refunds will be processed within 5-7 business days.
                </p>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                <summary className="font-medium text-gray-900 cursor-pointer flex justify-between items-center">
                  What payment methods do you accept?
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-600">
                  Currently, we accept cash payments. You can pay when you board
                  the bus. Online payment options are coming soon for added
                  convenience.
                </p>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                <summary className="font-medium text-gray-900 cursor-pointer flex justify-between items-center">
                  How do I change my booking date?
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-600">
                  To change your booking date, please contact our customer
                  support team at least 4 hours before departure. Date changes
                  are subject to seat availability on the new date.
                </p>
              </details>

              <details className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                <summary className="font-medium text-gray-900 cursor-pointer flex justify-between items-center">
                  Do you offer group discounts?
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="mt-3 text-gray-600">
                  Yes! We offer special discounts for group bookings of 10 or
                  more passengers. Please contact our sales team for group
                  booking rates and arrangements.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-12 card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Find Us</h3>
        <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
          <div className="text-center">
            <FaMapMarkerAlt className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-700 font-medium">Pokhara, Nepal</p>
            <p className="text-gray-600">
              Lakeside, Pokhara 33700, Gandaki Province
            </p>
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Get Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
