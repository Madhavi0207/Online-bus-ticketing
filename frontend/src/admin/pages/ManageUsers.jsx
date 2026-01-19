import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  UserPlus,
  Shield,
  ShieldOff,
  Mail,
  Phone,
  Calendar,
  Filter,
  Download,
  Search,
} from "lucide-react";
import DataTable from "../components/DataTable";
import Modal, { ConfirmationModal } from "../components/Modal";
import { adminUsersAPI } from "../services/adminApi";
import { format } from "date-fns";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filters, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = searchQuery
        ? await adminUsersAPI.searchUsers(searchQuery)
        : await adminUsersAPI.getAllUsers(currentPage, 10);
      setUsers(response.data);
      setTotalItems(response.total || response.data.length);
    } catch (error) {
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = (user) => {
    setSelectedUser(user);
    setShowAdminModal(true);
  };

  const confirmToggleAdmin = async () => {
    try {
      await adminUsersAPI.toggleAdminStatus(selectedUser._id);
      toast.success(
        `User ${selectedUser.isAdmin ? "removed from" : "added to"} admin`
      );
      fetchUsers();
      setShowAdminModal(false);
    } catch (error) {
      toast.error("Failed to update admin status");
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminUsersAPI.deleteUser(selectedUser._id);
      toast.success("User deleted successfully");
      fetchUsers();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleExport = () => {
    toast.success("Exporting users data...");
    // Implement export
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const columns = [
    {
      key: "name",
      title: "User",
      render: (item) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="font-medium text-primary-600">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-500">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      title: "Phone",
      render: (item) => item.phone || "N/A",
    },
    {
      key: "isAdmin",
      title: "Role",
      render: (item) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            item.isAdmin
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.isAdmin ? "Admin" : "Customer"}
        </span>
      ),
    },
    {
      key: "bookings",
      title: "Bookings",
      render: (item) => (
        <span className="font-medium">{item.bookingsCount || 0}</span>
      ),
    },
    {
      key: "createdAt",
      title: "Joined",
      render: (item) => format(new Date(item.createdAt), "MMM dd, yyyy"),
    },
    {
      key: "status",
      title: "Status",
      render: (item) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            item.isActive !== false
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.isActive !== false ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const tableFilters = [
    {
      key: "role",
      label: "Role",
      options: [
        { value: "admin", label: "Admin" },
        { value: "customer", label: "Customer" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600">View and manage system users</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        onEdit={handleToggleAdmin}
        onDelete={handleDeleteUser}
        selectable={false}
        filters={tableFilters}
        onFilter={setFilters}
        onSearch={handleSearch}
        onExport={handleExport}
        totalItems={totalItems}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        emptyMessage="No users found"
        searchable={true}
      />

      {/* Toggle Admin Confirmation Modal */}
      <ConfirmationModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onConfirm={confirmToggleAdmin}
        title={
          selectedUser?.isAdmin ? "Remove Admin Access" : "Grant Admin Access"
        }
        message={`Are you sure you want to ${
          selectedUser?.isAdmin ? "remove" : "grant"
        } admin access to ${selectedUser?.name}?`}
        confirmText={selectedUser?.isAdmin ? "Remove Admin" : "Make Admin"}
        cancelText="Cancel"
      />

      {/* Delete User Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete User"
        cancelText="Cancel"
        danger={true}
      />
    </div>
  );
};

export default ManageUsers;
