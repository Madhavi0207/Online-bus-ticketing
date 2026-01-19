import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Bus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Routes", path: "/routes" },
    { name: "Booking", path: "/booking" },
    ...(isAuthenticated ? [{ name: "My Bookings", path: "/my-bookings" }] : []),
    ...(user?.isAdmin ? [{ name: "Admin Panel", path: "/admin" }] : []),
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
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
            <div className="pt-6">
              {isAuthenticated ? (
                <Link
                  to="/logout"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-lg font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </Link>
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
                    className="block px-4 py-3 text-lg font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
