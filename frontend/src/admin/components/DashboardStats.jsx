import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Ticket,
  DollarSign,
  Bus,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const DashboardStats = ({ stats, loading }) => {
  const statCards = [
    {
      title: "Total Revenue",
      value: `NPR ${stats?.totalRevenue}`,
      change: stats?.revenue?.change || 0,
      icon: DollarSign,
      color: "green",
      chartData: stats?.revenue?.chart || [],
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings,
      change: stats?.bookings?.change || 0,
      icon: Ticket,
      color: "blue",
      chartData: stats?.bookings?.chart || [],
    },
    {
      title: "Active Users",
      value: stats?.totalUsers,
      change: stats?.users?.change || 0,
      icon: Users,
      color: "purple",
      chartData: stats?.users?.chart || [],
    },
    {
      title: "Active Routes",
      value: stats?.totalRoutes,
      change: stats?.routes?.change || 0,
      icon: Bus,
      color: "orange",
      chartData: stats?.routes?.chart || [],
    },
    {
      title: "Today's Bookings",
      value: stats?.todayBookings?.toLocaleString() || "0",
      change: stats?.todayChange || 0,
      icon: Calendar,
      color: "red",
      chartData: [],
    },
    {
      title: "Occupancy Rate",
      value: `${stats?.occupancyRate?.toFixed(1) || "0"}%`,
      change: stats?.occupancyChange || 0,
      icon: TrendingUp,
      color: "teal",
      chartData: stats?.occupancyChart || [],
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: "bg-green-50 text-green-700 border-green-200",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      red: "bg-red-50 text-red-700 border-red-200",
      teal: "bg-teal-50 text-teal-700 border-teal-200",
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.change >= 0;

        return (
          <div
            key={index}
            className={`border rounded-xl p-4 transition-all hover:shadow-lg ${getColorClasses(
              stat.color,
            )}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-white">
                <Icon className="h-5 w-5" />
              </div>
              <div
                className={`flex items-center space-x-1 text-sm ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-sm font-medium opacity-75">{stat.title}</h3>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>

            {/* Mini Chart */}
            {stat.chartData.length > 0 && (
              <div className="flex items-end h-12 mt-2">
                {stat.chartData.map((value, i) => (
                  <div
                    key={i}
                    className="flex-1 mx-0.5 bg-current opacity-20 rounded-t"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
