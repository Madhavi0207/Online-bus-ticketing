import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bus,
  Ticket,
  Users,
  Settings,
  BarChart3,
  Mail,
  Menu,
  X,
  LogOut,
  Shield,
  ListOrdered,
  PieChart,
  FileText,
  Bell,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
      submenu: [],
    },
    {
      id: "bookings",
      title: "Bookings",
      icon: Ticket,
      path: "/admin/bookings",
      submenu: [
        { title: "All Bookings", path: "/admin/bookings" },
        { title: "Pending", path: "/admin/bookings?status=pending" },
        { title: "Confirmed", path: "/admin/bookings?status=confirmed" },
        { title: "Cancelled", path: "/admin/bookings?status=cancelled" },
      ],
    },
    {
      id: "routes",
      title: "Routes",
      icon: Bus,
      path: "/admin/routes",
      submenu: [
        { title: "All Routes", path: "/admin/routes" },
        { title: "Add New", path: "/admin/routes/new" },
        { title: "Popular Routes", path: "/admin/routes/popular" },
      ],
    },
    {
      id: "users",
      title: "Users",
      icon: Users,
      path: "/admin/users",
      submenu: [
        { title: "All Users", path: "/admin/users" },
        { title: "Admins", path: "/admin/users?role=admin" },
        { title: "Customers", path: "/admin/users?role=customer" },
      ],
    },
    {
      id: "services",
      title: "Services",
      icon: ListOrdered,
      path: "/admin/services",
      submenu: [],
    },
    {
      id: "tickets",
      title: "Tickets",
      icon: Mail,
      path: "/admin/tickets",
      submenu: [
        { title: "Send Tickets", path: "/admin/tickets/send" },
        { title: "Ticket History", path: "/admin/tickets/history" },
      ],
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
      submenu: [
        { title: "Overview", path: "/admin/analytics" },
        { title: "Revenue", path: "/admin/analytics/revenue" },
        { title: "Users", path: "/admin/analytics/users" },
        { title: "Routes", path: "/admin/analytics/routes" },
      ],
    },
    {
      id: "reports",
      title: "Reports",
      icon: FileText,
      path: "/admin/reports",
      submenu: [
        { title: "Booking Report", path: "/admin/reports/bookings" },
        { title: "Revenue Report", path: "/admin/reports/revenue" },
        { title: "User Report", path: "/admin/reports/users" },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      icon: Settings,
      path: "/admin/settings",
      submenu: [
        { title: "General", path: "/admin/settings/general" },
        { title: "Payment", path: "/admin/settings/payment" },
        { title: "Email", path: "/admin/settings/email" },
        { title: "System", path: "/admin/settings/system" },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    toast.success("Logged out from admin panel");
  };

  const toggleSubmenu = (id) => {
    setActiveSubmenu(activeSubmenu === id ? null : id);
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary-600 text-white rounded-lg shadow-lg"
      >
        {isCollapsed ? <Menu className="h-6 w-6" /> : <X className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:sticky top-0 left-0 h-screen bg-gray-900 text-white 
        transition-all duration-300 z-40 shadow-xl
        ${isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "w-64"}
      `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-luxury-gold" />
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-bold">LuxuryRide Admin</h2>
                <p className="text-xs text-gray-400">Control Panel</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100vh-8rem)]">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const submenuActive = activeSubmenu === item.id;

              return (
                <li key={item.id}>
                  {item.submenu.length > 0 ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.id)}
                        className={`
                          w-full flex items-center justify-between p-3 rounded-lg
                          transition-colors hover:bg-gray-800
                          ${
                            active
                              ? "bg-primary-600 text-white"
                              : "text-gray-300"
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </div>
                        {!isCollapsed && (
                          <span
                            className={`transition-transform ${
                              submenuActive ? "rotate-180" : ""
                            }`}
                          >
                            ▼
                          </span>
                        )}
                      </button>

                      {submenuActive && !isCollapsed && (
                        <ul className="ml-8 mt-2 space-y-2 border-l border-gray-700 pl-4">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.path}>
                              <Link
                                to={subItem.path}
                                className={`
                                  block p-2 rounded transition-colors
                                  ${
                                    location.pathname === subItem.path
                                      ? "text-primary-400 bg-gray-800"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                                  }
                                `}
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`
                        flex items-center space-x-3 p-3 rounded-lg
                        transition-colors hover:bg-gray-800
                        ${
                          active ? "bg-primary-600 text-white" : "text-gray-300"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className={`
              flex items-center space-x-3 p-3 rounded-lg w-full
              text-red-400 hover:bg-red-900/20 transition-colors
            `}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default Sidebar;
