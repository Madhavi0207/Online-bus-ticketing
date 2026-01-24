import React, { useEffect, useState } from "react";
import { adminRoutesAPI } from "../services/adminApi";
import DataTable from "../components/DataTable";
import RouteForm from "../components/RouteForm";
import { toast } from "react-hot-toast";

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRoutes = async () => {
    setLoading(true);
    try {
      const res = await adminRoutesAPI.getAllRoutes();
      // Ensure data is array
      setRoutes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleEdit = (route) => {
    setEditingRoute(route);
    setShowForm(true);
  };

  const handleDelete = async (route) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await adminRoutesAPI.deleteRoute(route._id);
        toast.success("Route deleted");
        fetchRoutes();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete route");
      }
    }
  };

  const handleFormClose = () => {
    setEditingRoute(null);
    setShowForm(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingRoute) {
        await adminRoutesAPI.updateRoute(editingRoute._id, formData);
        toast.success("Route updated");
      } else {
        await adminRoutesAPI.createRoute(formData);
        toast.success("Route created");
      }
      handleFormClose();
      fetchRoutes();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save route");
    }
  };

  const columns = [
    { key: "from", title: "From" },
    { key: "to", title: "To" },
    { key: "description", title: "Description" },
    { key: "duration", title: "Duration" },
    { key: "isActive", title: "Active", type: "boolean" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Routes</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Add New Route
        </button>
      </div>

      {showForm && (
        <RouteForm
          route={editingRoute}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}

      <DataTable
        columns={columns}
        data={routes}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No routes found"
      />
    </div>
  );
};

export default ManageRoutes;
