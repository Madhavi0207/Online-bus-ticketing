import { authAPI } from "./api";
import toast from "react-hot-toast";

export const authService = {
  async register(userData) {
    try {
      const response = await authAPI.register(userData);
      if (response.data.success) {
        toast.success("Registration successful!");
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      if (response.data.success) {
        toast.success("Login successful!");
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  },

  async getProfile() {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  },

  async updateProfile(data) {
    try {
      const response = await authAPI.updateProfile(data);
      if (response.data.success) {
        toast.success("Profile updated successfully!");
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem("token");
  },
};
export default authService;
