import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import RoutesPage from "./pages/RoutesPage";
import RouteDetails from "./pages/RouteDetails"; // Added import
import ServicesPage from "./pages/ServicesPage";
import Dashboard from "./admin/pages/Dashboard";
import Analytics from "./admin/pages/Analytics";
import ManageBooking from "./admin/pages/ManageBooking";
import ManageRoutes from "./admin/pages/ManageRoutes";
import ManageService from "./admin/pages/ManageService";
import ManageUsers from "./admin/pages/ManageUsers";
import SendTickets from "./admin/pages/SendTickets";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Toaster } from "react-hot-toast"; // Add this import

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" /> {/* Add Toaster component */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/:id" element={<RouteDetails />} />{" "}
          {/* Added route */}
          <Route path="/services" element={<ServicesPage />} />
          {/* Admin routes - protect as needed */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute adminOnly>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-booking"
            element={
              <ProtectedRoute adminOnly>
                <ManageBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-routes"
            element={
              <ProtectedRoute adminOnly>
                <ManageRoutes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-service"
            element={
              <ProtectedRoute adminOnly>
                <ManageService />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-users"
            element={
              <ProtectedRoute adminOnly>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/send-tickets"
            element={
              <ProtectedRoute adminOnly>
                <SendTickets />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
