import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Safe JSON parse
  const safeJSONParse = (item) => {
    try {
      return item && item !== "undefined" ? JSON.parse(item) : null;
    } catch (err) {
      console.error("Failed to parse JSON from localStorage:", item, err);
      return null;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = safeJSONParse(storedUser);
    if (parsedUser) setUser(parsedUser);
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      // Correctly create user object from backend response
      const loggedInUser = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        isAdmin: res.data.isAdmin,
      };
      const token = res.data.token;

      if (role === "admin" && !loggedInUser.isAdmin) {
        throw new Error("You are not authorized as admin");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      return { success: true };
    } catch (err) {
      toast.error(
        err.response?.data?.error || err.response?.data?.message || err.message,
      );
      return { success: false };
    }
  };
  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);

      // Optional: auto-login after registration
      const newUser = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        isAdmin: res.data.isAdmin || false,
      };

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      }

      toast.success("Account created successfully");
      return { success: true };
    } catch (err) {
      toast.error(
        err.response?.data?.error || err.response?.data?.message || err.message,
      );
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
