import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Filter,
  Download,
  Mail,
  Eye,
  XCircle,
  RefreshCw,
  Printer,
  FileText,
} from "lucide-react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { adminBookingsAPI } from "../services/adminApi";
import { format } from "date-fns";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [currentPage, filters]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await adminBookingsAPI.getAllBookings(
        currentPage,
        10,
        filters
      );
      setBookings(response.data);
      setTotalItems(response.total || response.data.length);
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminBookingsAPI.getAllBookings(1, 1000);
      const data = response.data;
      setStats({
        total: data.length,
        pending: data.filter((b) => b.paymentStatus === "pending").length,
        confirmed: data.filter(
          (b) => !b.isCancelled && b.paymentStatus === "completed"
        ).length,
        cancelled: data.filter((b) => b.isCancelled).length,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = async (booking) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      await adminBookingsAPI.cancelBooking(booking._id);
      toast.success("Booking cancelled successfully");
      fetchBookings();
      fetchStats();
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  const handleSendTicket = async (booking) => {
    try {
      await adminBookingsAPI.sendTicketEmail(booking._id);
      toast.success("Ticket sent to customer email");
    } catch (error) {
      toast.error("Failed to send ticket");
    }
  };

  const handleBulkSendTickets = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select bookings to send tickets");
      return;
    }

    try {
      await adminBookingsAPI.bulkSendTickets(selectedRows);
      toast.success(`Tickets sent for ${selectedRows.length} bookings`);
      setSelectedRows([]);
    } catch (error) {
      toast.error("Failed to send tickets");
    }
  };

  const handleExport = async () => {
    try {
      const blob = await adminBookingsAPI.exportBookings(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookings-${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Bookings exported successfully");
    } catch (error) {
      toast.error("Failed to export bookings");
    }
  };

  const handlePrint = (booking) => {
    // Implement print functionality
    toast.success("Printing booking details...");
  };

  const columns = [
    {
      key: "id",
      title: "Booking ID",
      render: (item) => (
        <span className="font-mono text-sm">#{item._id.slice(-8)}</span>
      ),
    },
    {
      key: "customer",
      title: "Customer",
      render: (item) => (
        <div>
          <div className="font-medium">{item.user?.name}</div>
          <div className="text-sm text-gray-500">{item.user?.email}</div>
        </div>
      ),
    },
    {
      key: "route",
      title: "Route",
      render: (item) => (
        <div>
          <div className="font-medium">
            {item.route?.from} → {item.route?.to}
          </div>
          <div className="text-sm text-gray-500">
            {item.route?.departureTime}
          </div>
        </div>
      ),
    },
    {
      key: "date",
      title: "Travel Date",
      render: (item) => format(new Date(item.travelDate), "MMM dd, yyyy"),
    },
    {
      key: "seats",
      title: "Seats",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.seats.map((seat, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs">
              {seat.seatNumber}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "amount",
      title: "Amount",
      render: (item) => (
        <span className="font-medium">NPR {item.totalAmount}</span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (item) => {
        if (item.isCancelled) {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <XCircle className="h-3 w-3 mr-1" />
              Cancelled
            </span>
          );
        }
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              item.paymentStatus === "completed"
                ? "bg-green-100 text-green-800"
                : item.paymentStatus === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.paymentStatus === "completed"
              ? "Confirmed"
              : item.paymentStatus === "pending"
              ? "Pending"
              : "Failed"}
          </span>
        );
      },
    },
    {
      key: "bookingDate",
      title: "Booked On",
      render: (item) => format(new Date(item.bookingDate), "MMM dd, HH:mm"),
    },
  ];

  const tableFilters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    {
      key: "paymentStatus",
      label: "Payment",
      options: [
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" },
        { value: "failed", label: "Failed" },
      ],
    },
  ];

  const statsCards = [
    {
      title: "Total Bookings",
      value: stats.total,
      color: "blue",
      icon: FileText,
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      color: "green",
      icon: FileText,
    },
    {
      title: "Pending",
      value: stats.pending,
      color: "yellow",
      icon: RefreshCw,
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      color: "red",
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-600">View and manage all customer bookings</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {selectedRows.length > 0 && (
            <button
              onClick={handleBulkSendTickets}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Mail className="h-4 w-4" />
              <span>Send Tickets ({selectedRows.length})</span>
            </button>
          )}
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bookings Table */}
      <DataTable
        columns={columns}
        data={bookings}
        loading={loading}
        onView={handleViewDetails}
        onSelect={setSelectedRows}
        selectedRows={selectedRows}
        selectable={true}
        filters={tableFilters}
        onFilter={setFilters}
        onExport={handleExport}
        totalItems={totalItems}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        emptyMessage="No bookings found"
        actions={true}
        onDelete={handleCancelBooking}
      />

      {/* Booking Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Booking Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Booking ID</label>
                <div className="font-medium">{selectedBooking._id}</div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Status</label>
                <div>
                  {selectedBooking.isCancelled ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Cancelled
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Confirmed
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Booked On</label>
                <div className="font-medium">
                  {format(new Date(selectedBooking.bookingDate), "PPP p")}
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Travel Date</label>
                <div className="font-medium">
                  {format(new Date(selectedBooking.travelDate), "PPP")}
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <div className="font-medium">
                    {selectedBooking.user?.name}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <div className="font-medium">
                    {selectedBooking.user?.email}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <div className="font-medium">
                    {selectedBooking.user?.phone || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* Route Info */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Route Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Route</label>
                  <div className="font-medium">
                    {selectedBooking.route?.from} → {selectedBooking.route?.to}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Departure</label>
                  <div className="font-medium">
                    {selectedBooking.route?.departureTime}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Duration</label>
                  <div className="font-medium">
                    {selectedBooking.route?.duration}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Price per Seat
                  </label>
                  <div className="font-medium">
                    NPR {selectedBooking.route?.price}
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Passenger Details</h3>
              <div className="space-y-3">
                {selectedBooking.seats.map((seat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">Seat {seat.seatNumber}</div>
                      <div className="text-sm text-gray-600">
                        {seat.passengerName}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Age: {seat.passengerAge}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Total Amount</label>
                  <div className="text-2xl font-bold text-green-600">
                    NPR {selectedBooking.totalAmount}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">
                    Payment Status
                  </label>
                  <div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedBooking.paymentStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedBooking.paymentStatus === "completed"
                        ? "Paid"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-6 flex justify-end space-x-3">
              <button
                onClick={() => handlePrint(selectedBooking)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
              <button
                onClick={() => handleSendTicket(selectedBooking)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Mail className="h-4 w-4" />
                <span>Send Ticket</span>
              </button>
              {!selectedBooking.isCancelled && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Cancel Booking</span>
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageBookings;
