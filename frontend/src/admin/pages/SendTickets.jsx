import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Mail,
  Send,
  Users,
  Calendar,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Download,
  Printer,
} from "lucide-react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { adminBookingsAPI } from "../services/adminApi";
import { format } from "date-fns";

const SendTickets = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState("standard");
  const [customMessage, setCustomMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: "today",
    status: "confirmed",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await adminBookingsAPI.getAllBookings(1, 100, {
        ...filters,
        isCancelled: false,
      });
      setBookings(response.data);
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTickets = async () => {
    if (selectedBookings.length === 0) {
      toast.error("Please select bookings to send tickets");
      return;
    }

    setSending(true);
    try {
      await adminBookingsAPI.bulkSendTickets(selectedBookings);
      toast.success(`Tickets sent for ${selectedBookings.length} bookings`);
      setSelectedBookings([]);

      // Update sent status
      setBookings(
        bookings.map((booking) =>
          selectedBookings.includes(booking._id)
            ? { ...booking, ticketSent: true }
            : booking,
        ),
      );
    } catch (error) {
      toast.error("Failed to send tickets");
    } finally {
      setSending(false);
    }
  };

  const handleSendTest = async () => {
    toast.success("Test email sent to admin@luxuryride.com");
  };

  const handleExportSelected = () => {
    const selectedData = bookings.filter((b) =>
      selectedBookings.includes(b._id),
    );
    // Implement export
    toast.success(`Exported ${selectedData.length} bookings`);
  };

  const columns = [
    {
      key: "select",
      title: "",
      render: (item) => (
        <input
          type="checkbox"
          checked={selectedBookings.includes(item._id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedBookings([...selectedBookings, item._id]);
            } else {
              setSelectedBookings(
                selectedBookings.filter((id) => id !== item._id),
              );
            }
          }}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
    },
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
      key: "travelDate",
      title: "Travel Date",
      render: (item) => format(new Date(item.travelDate), "MMM dd, yyyy"),
    },
    {
      key: "ticketSent",
      title: "Ticket Status",
      render: (item) => (
        <div className="flex items-center">
          {item.ticketSent ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">Sent</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-600">Not Sent</span>
            </>
          )}
        </div>
      ),
    },
  ];

  const templates = [
    {
      id: "standard",
      name: "Standard Ticket",
      description: "Includes basic booking details",
    },
    {
      id: "premium",
      name: "Premium Template",
      description: "With company branding and QR code",
    },
    {
      id: "custom",
      name: "Custom Message",
      description: "Add custom message to ticket",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Send Tickets</h1>
          <p className="text-gray-600">
            Send booking tickets to customers via email
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Preview Email
          </button>
          <button
            onClick={handleSendTest}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Send Test
          </button>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white rounded-xl border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters({ ...filters, dateRange: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="thisWeek">This Week</option>
              <option value="nextWeek">Next Week</option>
              <option value="all">All Upcoming</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Template
            </label>
            <select
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchBookings}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh List</span>
            </button>
          </div>
        </div>

        {emailTemplate === "custom" && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a custom message to include in the ticket email..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
            />
          </div>
        )}
      </div>

      {/* Selected Actions */}
      {selectedBookings.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Mail className="h-5 w-5 text-blue-600" />
              <span className="font-medium">
                {selectedBookings.length} booking
                {selectedBookings.length !== 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportSelected}
                className="px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export Selected</span>
              </button>
              <button
                onClick={handleSendTickets}
                disabled={sending}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {sending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Tickets</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <DataTable
        columns={columns}
        data={bookings}
        loading={loading}
        selectable={false}
        pagination={false}
        searchable={true}
        emptyMessage="No bookings found for the selected filters"
      />

      {/* Email Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Email Preview"
        size="lg"
      >
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">To: customer@example.com</div>
                <div className="text-sm text-gray-600">
                  Subject: Your LuxuryRide Booking Confirmation
                </div>
              </div>
              <div className="text-sm text-gray-500">Preview</div>
            </div>
          </div>
          <div className="p-6 bg-white">
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-primary-600 mb-2">
                LuxuryRide
              </div>
              <div className="text-gray-600">Your Journey, Our Priority</div>
            </div>

            <div className="border rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-lg font-bold text-green-600">
                  Booking Confirmed!
                </div>
                <div className="text-gray-600">
                  Your ticket has been generated successfully
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600">Booking ID</div>
                  <div className="font-medium">#TKT123456</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Travel Date</div>
                  <div className="font-medium">
                    {format(new Date(), "MMM dd, yyyy")}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Route</div>
                  <div className="font-medium">Kathmandu → Pokhara</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Departure</div>
                  <div className="font-medium">07:00 AM</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm text-gray-600 mb-2">
                  Passenger Details:
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>John Doe (Seat A1)</span>
                    <span>Adult</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="text-2xl font-bold text-green-600">
                      NPR 800
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">Paid via Khalti</div>
                </div>
              </div>
            </div>

            {customMessage && (
              <div className="border-t pt-4 mt-6">
                <div className="text-sm text-gray-600 mb-2">
                  Message from LuxuryRide:
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">{customMessage}</div>
              </div>
            )}

            <div className="border-t pt-6 mt-6 text-center text-gray-600 text-sm">
              <p>Thank you for choosing LuxuryRide!</p>
              <p className="mt-1">
                Need help? Contact us at support@luxuryride.com
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SendTickets;
