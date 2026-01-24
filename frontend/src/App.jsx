import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Toaster } from "react-hot-toast";

/* Layouts */
import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";

/* User pages */
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import RoutesPage from "./pages/RoutesPage";
import RouteDetails from "./pages/RouteDetails";
import ServicesPage from "./pages/ServicesPage";

/* Admin pages */
import Dashboard from "./admin/pages/Dashboard";
import Analytics from "./admin/pages/Analytics";
import ManageBooking from "./admin/pages/ManageBooking";
import ManageRoutes from "./admin/pages/ManageRoutes";
import ManageService from "./admin/pages/ManageService";
import ManageUsers from "./admin/pages/ManageUsers";
import SendTickets from "./admin/pages/SendTickets";

// Error pages
import NotFoundPage from "./pages/NotFoundPage";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <ErrorBoundary>
        <Router>
          <Routes>
            {/* ================= USER LAYOUT ================= */}
            <Route element={<MainLayout />}>
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
              <Route path="/routes/:id" element={<RouteDetails />} />
              <Route path="/services" element={<ServicesPage />} />

              {/* catch all unknown user routes */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* ================= ADMIN LAYOUT ================= */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bookings" element={<ManageBooking />} />
              <Route path="routes" element={<ManageRoutes />} />
              <Route path="services" element={<ManageService />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="tickets/send" element={<SendTickets />} />

              {/* catch all unknown admin routes i.e. starting from admin/ */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* catch all the rest of the unknown routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
