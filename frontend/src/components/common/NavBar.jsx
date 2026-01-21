import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // Base navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Routes", path: "/routes" },
    { name: "Booking", path: "/booking" },
    ...(isAuthenticated ? [{ name: "My Bookings", path: "/my-bookings" }] : []),
    ...(user?.isAdmin ? [{ name: "Admin Panel", path: "/admin" }] : []),
  ];

  return (
    <nav className="bg-green-600 shadow-md px-6 py-4 flex justify-between items-center relative text-white">
      {/* Logo / Brand */}
      <Link to="/" className="text-2xl font-bold text-primary-600 ">
        LuxuryRide
      </Link>

      {/* Desktop nav items */}
      <div className="hidden md:flex items-center space-x-6 text-white">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`font-medium ${
              location.pathname === item.path
                ? "text-primary-600 underline"
                : "text-gray-700 hover:text-primary-600"
            }`}
          >
            {item.name}
          </Link>
        ))}

        {/* Auth buttons */}
        {isAuthenticated ? (
          <>
            <span className="font-medium text-gray-700">
              Hi, {user.name || user.email}
            </span>
            <button
              onClick={logout}
              className="ml-4 px-3 py-1 rounded hover:bg-gray-100 text-white font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md bg-white shadow-lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white">
          <div className="flex flex-col h-full pt-20 px-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 text-lg font-medium rounded-lg ${
                  location.pathname === item.path
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Auth buttons for mobile */}
            <div className="pt-6">
              {isAuthenticated ? (
                <>
                  <span className="block mb-2 font-medium text-gray-700">
                    Hi, {user.name || user.email}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full px-4 py-3 text-lg font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg mb-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg mb-2"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
