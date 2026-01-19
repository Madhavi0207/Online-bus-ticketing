import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  GripVertical,
} from "lucide-react";
import DataTable from "../components/DataTable";
import Modal, { ConfirmationModal } from "../components/Modal";
import { adminServicesAPI } from "../services/adminApi";
import ServiceForm from "../components/ServiceForm";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await adminServicesAPI.getAllServices();
      setServices(response.data);
    } catch (error) {
      toast.error("Failed to load services");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = () => {
    setSelectedService(null);
    setShowModal(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await adminServicesAPI.deleteService(selectedService._id);
      toast.success("Service deleted successfully");
      fetchServices();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const handleSaveService = async (serviceData) => {
    try {
      if (selectedService) {
        await adminServicesAPI.updateService(selectedService._id, serviceData);
        toast.success("Service updated successfully");
      } else {
        await adminServicesAPI.createService(serviceData);
        toast.success("Service created successfully");
      }
      setShowModal(false);
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save service");
    }
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = async (dropIndex) => {
    if (dragIndex === null || dragIndex === dropIndex) return;

    const newServices = [...services];
    const [draggedItem] = newServices.splice(dragIndex, 1);
    newServices.splice(dropIndex, 0, draggedItem);

    // Update order numbers
    const updatedServices = newServices.map((service, index) => ({
      ...service,
      order: index,
    }));

    setServices(updatedServices);

    try {
      await adminServicesAPI.updateServiceOrder(updatedServices);
      toast.success("Services order updated");
    } catch (error) {
      toast.error("Failed to update order");
      fetchServices(); // Revert on error
    }

    setDragIndex(null);
  };

  const columns = [
    {
      key: "order",
      title: "Order",
      render: (item, column, index) => (
        <div
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={() => handleDrop(index)}
          className="flex items-center justify-center cursor-move p-2"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
          <span className="ml-2">{item.order + 1}</span>
        </div>
      ),
    },
    {
      key: "icon",
      title: "Icon",
      render: (item) => <div className="text-2xl">{item.icon}</div>,
    },
    {
      key: "title",
      title: "Title",
      render: (item) => <div className="font-medium">{item.title}</div>,
    },
    {
      key: "description",
      title: "Description",
      render: (item) => (
        <div className="text-sm text-gray-600">{item.description}</div>
      ),
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
    {
      key: "actions",
      title: "Actions",
      render: (item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditService(item)}
            className="text-blue-600 hover:text-blue-900"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteService(item)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
          <p className="text-gray-600">
            Drag to reorder services display order
          </p>
        </div>
        <button
          onClick={handleCreateService}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center space-x-2 mt-4 md:mt-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Table */}
      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        pagination={false}
        searchable={true}
        selectable={false}
        emptyMessage="No services found. Add your first service!"
      />

      {/* Create/Edit Service Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedService ? "Edit Service" : "Create New Service"}
        size="md"
      >
        <ServiceForm
          service={selectedService}
          onSubmit={handleSaveService}
          onCancel={() => setShowModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Service"
        message={`Are you sure you want to delete the service "${selectedService?.title}"? This action cannot be undone.`}
        confirmText="Delete Service"
        cancelText="Cancel"
        danger={true}
      />
    </div>
  );
};

export default ManageServices;
