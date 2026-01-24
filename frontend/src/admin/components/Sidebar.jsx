import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bus,
  Ticket,
  Users,
  Settings,
  BarChart3,
  Mail,
  LogOut,
  Shield,
  ListOrdered,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { title: "Bookings", icon: Ticket, path: "/admin/bookings" },
    { title: "Routes", icon: Bus, path: "/admin/routes" },
    { title: "Users", icon: Users, path: "/admin/users" },
    { title: "Services", icon: ListOrdered, path: "/admin/services" },
    { title: "Tickets", icon: Mail, path: "/admin/tickets/send" },
    { title: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { title: "Reports", icon: FileText, path: "/admin/reports" },
    { title: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out from admin panel");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-green-600 text-white rounded-md"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-40
          h-screen w-64 bg-gray-900 text-white
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-800 flex items-center gap-3">
          <Shield className="h-8 w-8 text-yellow-400" />
          <div>
            <h2 className="text-lg font-bold">LuxuryRide</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>

          {/* Close button (mobile) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden"
          >
            <X />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-1">
          {menuItems.map(({ title, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition
                 ${
                   isActive
                     ? "bg-green-600 text-white"
                     : "text-gray-300 hover:bg-gray-800"
                 }`
              }
            >
              <Icon size={18} />
              <span>{title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:bg-red-900/20 rounded-lg"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
