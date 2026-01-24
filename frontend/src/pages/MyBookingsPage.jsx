import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Download,
  Mail,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { bookingsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { format } from "date-fns";

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getUserBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId);
      toast.success("Booking cancelled successfully");
      fetchBookings(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to cancel booking");
    }
  };

  const handleSendTicket = async (bookingId) => {
    try {
      await bookingsAPI.sendTicket(bookingId);
      toast.success("Ticket sent to your email!");
    } catch (error) {
      toast.error("Failed to send ticket. Please try again.");
    }
  };

  const getStatusBadge = (booking) => {
    if (booking.isCancelled) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <XCircle className="h-4 w-4 mr-1" />
          Cancelled
        </span>
      );
    }

    const travelDate = new Date(booking.travelDate);
    const now = new Date();

    if (travelDate < now) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          <Clock className="h-4 w-4 mr-1" />
          Completed
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-4 w-4 mr-1" />
        Confirmed
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="section-container p-10 m-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-green-600 mb-4">My Bookings</h1>
        <p className="text-xl text-gray-600">
          Manage and track all your bus bookings
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-medium text-gray-900 mb-2">
            No bookings yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start your journey by booking a trip
          </p>
          <a
            href="/routes"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Book Now</span>
            <MapPin className="h-5 w-5" />
          </a>
        </div>
      ) : (
        <div className="space-y-6 ">
          {bookings.map((booking) => (
            <div key={booking._id} className="card hover:shadow-xl">
              <div className="flex flex-col md:flex-row md:items-start justify-between">
                {/* Booking Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-green-600">
                          {booking.route?.from} → {booking.route?.to}
                        </h3>
                        {getStatusBadge(booking)}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {format(new Date(booking.travelDate), "PPP")}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Departs: {booking.route?.departureTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{booking.selectedSeats.length} seat(s)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Meta */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-medium ml-2">{booking._id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Booked on:</span>
                      <span className="font-medium ml-2">
                        {format(new Date(booking.bookingDate), "PPP")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Amount */}
                <div className="mt-4 md:mt-0 md:ml-6 md:text-right">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900">
                      NPR {booking.totalAmount}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.paymentStatus === "completed" ? (
                        <span className="text-green-600">Paid</span>
                      ) : (
                        <span className="text-yellow-600">Pending</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {!booking.isCancelled &&
                      new Date(booking.travelDate) > new Date() && (
                        <>
                          <button
                            onClick={() => handleSendTicket(booking._id)}
                            className="btn-secondary flex items-center justify-center space-x-2"
                          >
                            <Mail className="h-4 w-4" />
                            <span>Send Ticket</span>
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center space-x-2"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>Cancel Booking</span>
                          </button>
                        </>
                      )}
                    <button className="btn-primary flex items-center justify-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {bookings.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary-50 rounded-xl p-6">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {bookings.length}
            </div>
            <div className="text-gray-700">Total Bookings</div>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {bookings.filter((b) => !b.isCancelled).length}
            </div>
            <div className="text-gray-700">Active Bookings</div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              NPR{" "}
              {bookings
                .filter(
                  (b) => !b.isCancelled && b.paymentStatus === "completed",
                )
                .reduce((sum, b) => sum + b.totalAmount, 0)}
            </div>
            <div className="text-gray-700">Total Spent</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
