import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  TrendingUp,
  Users,
  Ticket,
  Bus,
  Calendar,
  RefreshCw,
  Download,
  BarChart3,
} from "lucide-react";
import DashboardStats from "../components/DashboardStats";
import DataTable from "../components/DataTable";
import { adminStatsAPI, adminAnalyticsAPI } from "../services/adminApi";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        adminStatsAPI.getDashboardStats(),
        adminStatsAPI.getRecentBookings(),
        adminAnalyticsAPI.getBookingAnalytics(
          format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
          format(new Date(), "yyyy-MM-dd"),
        ),
      ]);

      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data);

      // 🔹 TEMP MOCK CHART DATA (safe to remove later)
      setStats((prev) => ({
        ...prev,
        revenue: {
          total: 4589200,
          change: 12.5,
          chart: [30, 45, 60, 75, 80, 65, 90, 85, 70, 80, 85, 95],
        },
        bookings: {
          total: 1245,
          change: 8.2,
          chart: [40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 85, 90],
        },
        users: {
          total: 856,
          change: 15.3,
          chart: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
        },
        routes: {
          total: 24,
          change: 5.6,
          chart: [60, 55, 65, 60, 70, 65, 75, 70, 80, 75, 85, 80],
        },
        todayBookings: 42,
        todayChange: 3.2,
        occupancyRate: 78.5,
        occupancyChange: 2.1,
      }));
    } catch (err) {
      console.error(err);
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
        <span className="font-mono text-sm">#{item.id?.slice(-8)}</span>
      ),
    },
    {
      key: "user",
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

  const quickActions = [
    { title: "Add New Route", icon: Bus, path: "/admin/manage-routes" },
    { title: "Send Tickets", icon: Ticket, path: "/admin/send-tickets" },
    { title: "View Reports", icon: BarChart3, path: "/admin/analytics" },
    { title: "Manage Users", icon: Users, path: "/admin/manage-users" },
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

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon;
          return (
            <a
              key={i}
              href={action.path}
              className="border rounded-xl p-4 hover:shadow"
            >
              <Icon className="mb-2" />
              <div className="font-medium">{action.title}</div>
            </a>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <DataTable
          columns={bookingColumns}
          data={recentBookings.slice(0, 5)}
          loading={loading}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;
