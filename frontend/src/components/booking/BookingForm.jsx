import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CreditCard, Calendar, User, Mail, Phone } from "lucide-react";
import { bookingsAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const BookingForm = ({
  route,
  selectedSeats,
  passengerInfo,
  travelDate,
  totalAmount,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("khalti");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    // Validate passenger info
    for (const seat of selectedSeats) {
      const info = passengerInfo[seat];
      if (!info?.name || !info?.age) {
        toast.error(`Please fill passenger information for seat ${seat}`);
        return;
      }
    }

    setLoading(true);

    try {
      const seats = selectedSeats.map((seat) => ({
        seatNumber: seat.toString(),
        passengerName: passengerInfo[seat].name,
        passengerAge: parseInt(passengerInfo[seat].age),
      }));

      const bookingData = {
        routeId: route._id,
        seats,
        travelDate,
      };

      const response = await bookingsAPI.create(bookingData);

      toast.success("Booking confirmed! Redirecting to bookings...");

      // Send ticket email
      try {
        await bookingsAPI.sendTicket(response.data._id);
        toast.success("Ticket sent to your email!");
      } catch (emailError) {
        console.error("Error sending ticket:", emailError);
      }

      setTimeout(() => {
        navigate("/my-bookings");
      }, 2000);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error.response?.data?.error || "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const paymentMethods = [
    { id: "khalti", name: "Khalti", icon: "💰" },
    { id: "esewa", name: "eSewa", icon: "📱" },
    { id: "card", name: "Credit/Debit Card", icon: "💳" },
    { id: "cash", name: "Cash on Bus", icon: "💵" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Booking Summary */}
      <div className="card bg-linear-to-r from-primary-50 to-white">
        <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Route:</span>
            <span className="font-medium">
              {route?.from} → {route?.to}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Travel Date:</span>
            <span className="font-medium">
              {new Date(travelDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Seats Selected:</span>
            <span className="font-medium">{selectedSeats.join(", ")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price per Seat:</span>
            <span className="font-medium">NPR {route?.price}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-primary-600">NPR {totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field pl-10"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field pl-10"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field pl-10"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                paymentMethod === method.id
                  ? "border-primary-600 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-2">{method.icon}</div>
              <div className="font-medium">{method.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="card">
        <div className="flex items-start space-x-3">
          <input type="checkbox" id="terms" required className="mt-1" />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the Terms & Conditions and Privacy Policy. I understand
            that cancellations must be made at least 24 hours before departure
            for a full refund.
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary bg-luxury-gold hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Confirm Booking & Pay NPR {totalAmount}</span>
          </div>
        )}
      </button>
    </form>
  );
};

export default BookingForm;
