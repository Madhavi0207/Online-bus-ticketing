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
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  //   const [activeSubmenu, setActiveSubmenu] = useState(null);
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
      submenu: [],
    },
    {
      id: "routes",
      title: "Routes",
      icon: Bus,
      path: "/admin/routes",
      submenu: [],
    },
    {
      id: "users",
      title: "Users",
      icon: Users,
      path: "/admin/users",
      submenu: [],
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      path: "/admin/analytics",
      submenu: [],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    toast.success("Logged out from admin panel");
  };

  //   const toggleSubmenu = (id) => {
  //     setActiveSubmenu(activeSubmenu === id ? null : id);
  //   };

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
            <Shield className="h-8 w-8 text-yellow-500" />
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

              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center space-x-3 p-3 rounded-lg
                      transition-colors hover:bg-gray-800
                      ${active ? "bg-primary-600 text-white" : "text-gray-300"}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
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

export default AdminSidebar;
