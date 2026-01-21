import React from "react";
import {
  CreditCard,
  Smartphone,
  User,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";

const BookingForm = ({
  bus,
  selectedSeats,
  travelDate,
  totalAmount,
  bookerDetails,
  onBookerInfoChange,
  onConfirm,
  isProcessing,
}) => {
  if (!bus) return null;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left Column: Form Details */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            Passenger Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={bookerDetails.name}
                onChange={onBookerInfoChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={bookerDetails.email}
                onChange={onBookerInfoChange}
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={bookerDetails.phone}
                onChange={onBookerInfoChange}
                placeholder="98XXXXXXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary-600" />
            Payment Method
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {["esewa", "khalti", "card", "cash"].map((method) => (
              <label
                key={method}
                className={`relative flex items-center justify-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-all ${
                  bookerDetails.paymentMethod === method
                    ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600"
                    : "border-gray-200"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={bookerDetails.paymentMethod === method}
                  onChange={onBookerInfoChange}
                  className="sr-only"
                />
                <span className="capitalize font-medium text-gray-700">
                  {method}
                </span>
                {bookerDetails.paymentMethod === method && (
                  <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-primary-600" />
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">
          Booking Summary
        </h3>

        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">
                {bus.route?.from} → {bus.route?.to}
              </p>
              <p className="text-gray-500">
                {bus.busName} ({bus.busNumber})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700 font-medium">
              {new Date(travelDate).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-900">
                Selected Seats ({selectedSeats.length})
              </p>
              <p className="text-gray-500 break-words">
                {selectedSeats.join(", ")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2 text-gray-600">
            <span>Price per seat</span>
            <span>NPR {bus.price}</span>
          </div>
          <div className="flex justify-between items-center mb-6 text-gray-600">
            <span>Quantity</span>
            <span>x {selectedSeats.length}</span>
          </div>

          <div className="flex justify-between items-center text-xl font-bold text-primary-700">
            <span>Total Amount</span>
            <span>NPR {totalAmount}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isProcessing}
          className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all
            ${
              isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700 hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
        >
          {isProcessing ? "Processing..." : `Pay NPR ${totalAmount}`}
        </button>
      </div>
    </div>
  );
};

export default BookingForm;
