import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminHeader from "./components/AdminHeader";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <AdminHeader />

          {/* Page Content */}
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
