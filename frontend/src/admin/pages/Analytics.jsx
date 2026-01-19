import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Ticket,
  DollarSign,
  Calendar,
  Download,
  Filter,
  PieChart,
  LineChart,
} from "lucide-react";
import { adminAnalyticsAPI } from "../services/adminApi";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [analytics, setAnalytics] = useState({
    bookingTrends: [],
    revenueTrends: [],
    userGrowth: [],
    routePerformance: [],
    summary: {},
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period, startDate, endDate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch all analytics data
      const [bookingsResponse, revenueResponse, usersResponse] =
        await Promise.all([
          adminAnalyticsAPI.getBookingAnalytics(startDate, endDate),
          adminAnalyticsAPI.getRevenueAnalytics(startDate, endDate),
          adminAnalyticsAPI.getUserAnalytics(),
        ]);

      // Mock data for demo
      setAnalytics({
        bookingTrends: generateMockData(30, 50, 100),
        revenueTrends: generateMockData(30, 10000, 50000),
        userGrowth: generateMockData(30, 5, 20),
        routePerformance: [
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
        ],
        summary: {
          totalBookings: 1245,
          totalRevenue: 4589200,
          totalUsers: 856,
          avgBookingValue: 3685,
          conversionRate: 3.2,
          repeatCustomers: 245,
        },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (days, min, max) => {
    return Array.from({ length: days }, (_, i) => ({
      date: format(subDays(new Date(), days - i - 1), "MMM dd"),
      value: Math.floor(Math.random() * (max - min + 1)) + min,
    }));
  };

  const handleExport = () => {
    toast.success("Exporting analytics data...");
    // Implement export
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    const today = new Date();

    switch (newPeriod) {
      case "week":
        setStartDate(format(subDays(today, 7), "yyyy-MM-dd"));
        break;
      case "month":
        setStartDate(format(startOfMonth(today), "yyyy-MM-dd"));
        break;
      case "quarter":
        setStartDate(format(subDays(today, 90), "yyyy-MM-dd"));
        break;
      case "year":
        setStartDate(format(subDays(today, 365), "yyyy-MM-dd"));
        break;
      default:
        break;
    }
    setEndDate(format(today, "yyyy-MM-dd"));
  };

  const summaryCards = [
    {
      title: "Total Revenue",
      value: `NPR ${analytics.summary.totalRevenue?.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Total Bookings",
      value: analytics.summary.totalBookings?.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Ticket,
      color: "blue",
    },
    {
      title: "Total Users",
      value: analytics.summary.totalUsers?.toLocaleString(),
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "purple",
    },
    {
      title: "Avg. Booking Value",
      value: `NPR ${analytics.summary.avgBookingValue?.toLocaleString()}`,
      change: "+4.7%",
      trend: "up",
      icon: DollarSign,
      color: "orange",
    },
    {
      title: "Conversion Rate",
      value: `${analytics.summary.conversionRate}%`,
      change: "+0.8%",
      trend: "up",
      icon: TrendingUp,
      color: "teal",
    },
    {
      title: "Repeat Customers",
      value: analytics.summary.repeatCustomers?.toLocaleString(),
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "red",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">Insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            {["week", "month", "quarter", "year"].map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                className={`px-3 py-1 text-sm rounded-full ${
                  period === p
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.trend === "up";

          return (
            <div key={index} className="bg-white border rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-${card.color}-50`}>
                  <Icon className={`h-5 w-5 text-${card.color}-600`} />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{card.change}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Trend */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Booking Trends</h2>
            <LineChart className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-64">
            <div className="flex items-end h-48 space-x-1">
              {analytics.bookingTrends.slice(-14).map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t-lg"
                    style={{ height: `${(day.value / 100) * 100}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2">{day.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Revenue Trends</h2>
            <BarChart3 className="h-5 w-5 text-green-600" />
          </div>
          <div className="h-64">
            <div className="flex items-end h-48 space-x-1">
              {analytics.revenueTrends.slice(-14).map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t-lg"
                    style={{ height: `${(day.value / 50000) * 100}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2">{day.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Route Performance */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Route Performance</h2>
          <PieChart className="h-5 w-5 text-purple-600" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Occupancy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.routePerformance.map((route, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{route.route}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{route.bookings}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">
                      NPR {route.revenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${route.occupancy}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {route.occupancy}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        route.occupancy > 75
                          ? "bg-green-100 text-green-800"
                          : route.occupancy > 50
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {route.occupancy > 75
                        ? "Excellent"
                        : route.occupancy > 50
                        ? "Good"
                        : "Needs Improvement"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Growth */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">User Growth</h2>
          <Users className="h-5 w-5 text-orange-600" />
        </div>
        <div className="h-64">
          <div className="flex items-end h-48 space-x-1">
            {analytics.userGrowth.slice(-30).map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-orange-500 rounded-t-lg"
                  style={{ height: `${(day.value / 20) * 100}%` }}
                />
                <div className="text-xs text-gray-500 mt-2">
                  {index % 5 === 0 ? day.date : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
