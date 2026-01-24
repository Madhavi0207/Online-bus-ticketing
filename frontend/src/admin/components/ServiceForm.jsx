import React, { useState, useEffect } from "react";

const ServiceForm = ({ service, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    icon: "",
    title: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        icon: service.icon || "",
        title: service.title || "",
        description: service.description || "",
        isActive: service.isActive !== false,
      });
    } else {
      setFormData({ icon: "", title: "", description: "", isActive: true });
    }
  }, [service]);

  const icons = ["🚌", "🛡️", "🍱", "🎥", "🔌", "💺", "❄️", "📶", "🍵", "🚽"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Icon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Icon
        </label>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {icons.map((icon, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, icon }))}
              className={`p-3 text-2xl rounded-lg border ${formData.icon === icon ? "border-primary-600 bg-primary-50" : "border-gray-300 hover:border-gray-400"}`}
            >
              {icon}
            </button>
          ))}
        </div>
        <input
          type="text"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          placeholder="Or type custom icon/emoji"
          className="input-field w-full"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Service title"
          required
          className="input-field w-full"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe service features..."
          rows={3}
          required
          className="input-field w-full"
        />
      </div>

      {/* Status */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
        />
        <label className="text-sm text-gray-700">
          Active (visible to customers)
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {service ? "Update Service" : "Add Service"}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
