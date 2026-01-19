import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash2, Eye, Filter, Download } from "lucide-react";
import DataTable from "../components/DataTable";
import Modal, { ConfirmationModal } from "../components/Modal";
import { adminRoutesAPI } from "../services/adminApi";
import RouteForm from "../components/RouteForm";

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    fetchRoutes();
  }, [currentPage, filters]);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const response = await adminRoutesAPI.getAllRoutes(currentPage, 10);
      setRoutes(response.data);
      setTotalItems(response.total || response.data.length);
    } catch (error) {
      toast.error("Failed to load routes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoute = () => {
    setSelectedRoute(null);
    setShowModal(true);
  };

  const handleEditRoute = (route) => {
    setSelectedRoute(route);
    setShowModal(true);
  };

  const handleDeleteRoute = (route) => {
    setSelectedRoute(route);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminRoutesAPI.deleteRoute(selectedRoute._id);
      toast.success("Route deleted successfully");
      fetchRoutes();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete route");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select routes to delete");
      return;
    }

    if (!window.confirm(`Delete ${selectedRows.length} selected routes?`)) {
      return;
    }

    try {
      // Implement bulk delete
      toast.success(`${selectedRows.length} routes deleted`);
      setSelectedRows([]);
      fetchRoutes();
    } catch (error) {
      toast.error("Failed to delete routes");
    }
  };

  const handleExport = () => {
    toast.success("Exporting routes data...");
    // Implement export
  };

  const handleSaveRoute = async (routeData) => {
    try {
      if (selectedRoute) {
        await adminRoutesAPI.updateRoute(selectedRoute._id, routeData);
        toast.success("Route updated successfully");
      } else {
        await adminRoutesAPI.createRoute(routeData);
        toast.success("Route created successfully");
      }
      setShowModal(false);
      fetchRoutes();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save route");
    }
  };

  const columns = [
    {
      key: "from",
      title: "From",
      render: (item) => <div className="font-medium">{item.from}</div>,
    },
    {
      key: "to",
      title: "To",
      render: (item) => <div className="font-medium">{item.to}</div>,
    },
    {
      key: "description",
      title: "Description",
      render: (item) => (
        <div className="text-sm text-gray-600 truncate max-w-xs">
          {item.description}
        </div>
      ),
    },
    {
      key: "duration",
      title: "Duration",
    },
    {
      key: "price",
      title: "Price",
      render: (item) => <span className="font-medium">NPR {item.price}</span>,
    },
    {
      key: "availableSeats",
      title: "Available Seats",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.availableSeats > 10
              ? "bg-green-100 text-green-800"
              : item.availableSeats > 0
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.availableSeats} / {item.totalSeats}
        </span>
      ),
    },
    {
      key: "departureTime",
      title: "Departure",
    },
    {
      key: "isActive",
      title: "Status",
      render: (item) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            item.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const tableFilters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
    {
      key: "from",
      label: "From City",
      options: [
        { value: "kathmandu", label: "Kathmandu" },
        { value: "pokhara", label: "Pokhara" },
        { value: "chitwan", label: "Chitwan" },
      ],
    },
    {
      key: "to",
      label: "To City",
      options: [
        { value: "pokhara", label: "Pokhara" },
        { value: "chitwan", label: "Chitwan" },
        { value: "lumbini", label: "Lumbini" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Routes</h1>
          <p className="text-gray-600">Add, edit, and manage bus routes</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          {selectedRows.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Selected ({selectedRows.length})</span>
            </button>
          )}
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={handleCreateRoute}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Route</span>
          </button>
        </div>
      </div>

      {/* Routes Table */}
      <DataTable
        columns={columns}
        data={routes}
        loading={loading}
        onEdit={handleEditRoute}
        onDelete={handleDeleteRoute}
        onSelect={setSelectedRows}
        selectedRows={selectedRows}
        selectable={true}
        filters={tableFilters}
        onFilter={setFilters}
        onExport={handleExport}
        totalItems={totalItems}
        itemsPerPage={10}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        emptyMessage="No routes found. Add your first route!"
      />

      {/* Create/Edit Route Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedRoute ? "Edit Route" : "Create New Route"}
        size="lg"
      >
        <RouteForm
          route={selectedRoute}
          onSubmit={handleSaveRoute}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Route"
        message={`Are you sure you want to delete the route from ${selectedRoute?.from} to ${selectedRoute?.to}? This action cannot be undone.`}
        confirmText="Delete Route"
        cancelText="Cancel"
        danger={true}
      />
    </div>
  );
};

export default ManageRoutes;
