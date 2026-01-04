import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaBars, FaTimes, FaBus } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaBus className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Let's Go</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 font-medium"
              >
                Services
              </Link>
              <Link
                to="/routes"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 font-medium"
              >
                Routes
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 font-medium"
              >
                Contact Us
              </Link>
              {user && (
                <Link
                  to="/my-bookings"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 font-medium"
                >
                  My Bookings
                </Link>
              )}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 font-medium"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUser className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-900 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 text-gray-900 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              to="/routes"
              className="block px-3 py-2 text-gray-900 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Routes
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-gray-900 hover:text-blue-600 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
            {user && (
              <Link
                to="/my-bookings"
                className="block px-3 py-2 text-gray-900 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                My Bookings
              </Link>
            )}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="block px-3 py-2 text-gray-900 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            )}

            <div className="pt-4 border-t">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUser className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:text-red-800 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-900 hover:text-blue-600 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-blue-600 text-white rounded-lg font-medium text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
