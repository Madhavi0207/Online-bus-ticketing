import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { RefreshCw, Download } from "lucide-react";
import DashboardStats from "../components/DashboardStats";
import DataTable from "../components/DataTable";
import { adminStatsAPI } from "../services/adminApi";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalRoutes: 0,
    totalUsers: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminStatsAPI.getDashboardStats();
      const bookingsRes = await adminStatsAPI.getRecentBookings(5);

      const statsData = statsRes.data || {};

      setStats({
        totalBookings: statsData.totalBookings || 0,
        totalRevenue: statsData.totalRevenue || 0,
        totalRoutes: statsData.totalRoutes || 0,
        totalUsers: statsData.totalUsers || 0,
      });

      setRecentBookings(
        (bookingsRes?.data?.data || bookingsRes?.data || []).map(
          (b, index) => ({
            id: b._id || `booking-${index}`, // guaranteed unique
            customerName: b.user?.name || "N/A",
            routeName: b.route ? `${b.route.from} → ${b.route.to}` : "N/A",
            travelDate: b.travelDate || null,
            amount: b.totalAmount || 0,
            status: b.paymentStatus || "unknown",
          }),
        ),
      );
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setStats({
        totalBookings: 0,
        totalRevenue: 0,
        totalRoutes: 0,
        totalUsers: 0,
      });
      setRecentBookings([]);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData();
    toast.success("Dashboard refreshed");
  };

  const handleExport = () => {
    toast.success("Exporting dashboard data...");
  };

  const bookingColumns = [
    {
      key: "id",
      title: "Booking ID",
      render: (item) => (
        <span className="font-mono text-sm">#{item.id.slice(-8)}</span>
      ),
    },
    {
      key: "customer",
      title: "Customer",
      render: (item) => item.customerName,
    },
    {
      key: "route",
      title: "Route",
      render: (item) => item.routeName,
    },
    {
      key: "date",
      title: "Travel Date",
      render: (item) =>
        item.travelDate
          ? format(new Date(item.travelDate), "MMM dd, yyyy")
          : "N/A",
    },
    {
      key: "amount",
      title: "Amount",
      type: "currency",
    },
    {
      key: "status",
      title: "Status",
      type: "status",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button onClick={handleRefresh} className="p-2 border rounded-lg">
            <RefreshCw size={18} />
          </button>
          <button onClick={handleExport} className="p-2 border rounded-lg">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} loading={loading} />

      {/* Recent Bookings */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <DataTable
          columns={bookingColumns}
          data={recentBookings}
          loading={loading}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;
