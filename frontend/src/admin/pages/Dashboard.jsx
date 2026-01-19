import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Ticket,
  DollarSign,
  Bus,
  Calendar,
  RefreshCw,
  Download,
  BarChart3,
  PieChart,
} from "lucide-react";
import DashboardStats from "../components/DashboardStats";
import DataTable from "../components/DataTable";
import { adminStatsAPI, adminAnalyticsAPI } from "../services/adminApi";
import { format } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  //   const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [period, setPeriod] = useState("week");

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all dashboard data in parallel
      const [statsResponse, bookingsResponse] = await Promise.all([
        adminStatsAPI.getDashboardStats(),
        adminStatsAPI.getRecentBookings(),
        adminAnalyticsAPI.getBookingAnalytics(
          format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
          format(new Date(), "yyyy-MM-dd")
        ),
      ]);

      setStats(statsResponse.data);
      setRecentBookings(bookingsResponse.data);

      // Mock data for demo - replace with actual API
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
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
    // Implement export functionality
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
    {
      title: "Add New Route",
      icon: Bus,
      color: "blue",
      path: "/admin/routes/new",
    },
    {
      title: "Send Tickets",
      icon: Ticket,
      color: "green",
      path: "/admin/tickets/send",
    },
    {
      title: "View Reports",
      icon: BarChart3,
      color: "purple",
      path: "/admin/reports",
    },
    {
      title: "Manage Users",
      icon: Users,
      color: "orange",
      path: "/admin/users",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={handleRefresh}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} loading={loading} />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <a
              key={index}
              href={action.path}
              className={`bg-white border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div
                className={`inline-flex p-3 rounded-lg mb-3 bg-${action.color}-50`}
              >
                <Icon className={`h-6 w-6 text-${action.color}-600`} />
              </div>
              <h3 className="font-medium text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Click to manage</p>
            </a>
          );
        })}
      </div>

      {/* Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Bookings</h2>
            <a
              href="/admin/bookings"
              className="text-primary-600 hover:text-primary-800 text-sm"
            >
              View All →
            </a>
          </div>
          <DataTable
            columns={bookingColumns}
            data={recentBookings.slice(0, 5)}
            loading={loading}
            pagination={false}
            searchable={false}
            selectable={false}
            emptyMessage="No recent bookings"
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Revenue Overview</h2>
            <div className="flex items-center space-x-2">
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  period === "week"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100"
                }`}
              >
                Week
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  period === "month"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100"
                }`}
              >
                Month
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-full ${
                  period === "year"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100"
                }`}
              >
                Year
              </button>
            </div>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {[65, 75, 80, 85, 90, 85, 80, 75, 70, 65, 70, 75].map(
              (height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-linear-to-t from-primary-500 to-primary-300 rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    {
                      [
                        "J",
                        "F",
                        "M",
                        "A",
                        "M",
                        "J",
                        "J",
                        "A",
                        "S",
                        "O",
                        "N",
                        "D",
                      ][index]
                    }
                  </div>
                </div>
              )
            )}
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">NPR 4,589,200</div>
                <div className="text-sm text-gray-600">
                  Total revenue this month
                </div>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-5 w-5 mr-1" />
                <span>12.5% increase</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Route Performance */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-6">Route Performance</h2>
        <div className="space-y-4">
          {[
            {
              route: "Kathmandu → Pokhara",
              bookings: 342,
              revenue: 273600,
              occupancy: 85,
            },
            {
              route: "Pokhara → Chitwan",
              bookings: 218,
              revenue: 130800,
              occupancy: 78,
            },
            {
              route: "Kathmandu → Chitwan",
              bookings: 189,
              revenue: 151200,
              occupancy: 72,
            },
            {
              route: "Pokhara → Lumbini",
              bookings: 156,
              revenue: 124800,
              occupancy: 68,
            },
            {
              route: "Kathmandu → Biratnagar",
              bookings: 132,
              revenue: 158400,
              occupancy: 65,
            },
          ].map((route, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium">{route.route}</div>
                <div className="text-sm text-gray-600">
                  {route.bookings} bookings
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">
                  NPR {route.revenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {route.occupancy}% occupancy
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
