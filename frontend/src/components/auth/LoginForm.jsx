import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // 👈 user | admin
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(
      formData.email,
      formData.password,
      formData.role,
    );

    if (result.success) {
      if (formData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto">
      {/* 🔽 ROLE SELECTOR */}
      <div className="flex justify-start mb-4">
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border rounded-md px-3 py-1 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="user">User Login</option>
          <option value="admin">Admin Login</option>
        </select>
      </div>

      {/* HEADER */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-600 mb-2">
          {formData.role === "admin" ? "Admin Login" : "Welcome Back"}
        </h2>
        <p className="text-gray-600">
          {formData.role === "admin"
            ? "Sign in to admin dashboard"
            : "Sign in to your LuxuryRide account"}
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 p-2 border rounded-md"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 p-2 border rounded-md"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* REGISTER (USER ONLY) */}
        {formData.role === "user" && (
          <p className="text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-600 font-semibold">
              Sign up
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
