import React, { useState } from "react";
import { MapPin, Clock, DollarSign, Users, Calendar } from "lucide-react";

const RouteForm = ({ route, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    from: route?.from || "",
    to: route?.to || "",
    description: route?.description || "",
    duration: route?.duration || "",
    price: route?.price || "",
    totalSeats: route?.totalSeats || 40,
    availableSeats: route?.availableSeats || 40,
    departureTime: route?.departureTime || "",
    isActive: route?.isActive !== false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.from.trim()) newErrors.from = "Departure city is required";
    if (!formData.to.trim()) newErrors.to = "Destination city is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.departureTime)
      newErrors.departureTime = "Departure time is required";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From (Departure City)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              name="from"
              value={formData.from}
              onChange={handleChange}
              placeholder="e.g., Kathmandu"
              className={`input-field pl-10 ${
                errors.from ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.from && (
            <p className="mt-1 text-sm text-red-600">{errors.from}</p>
          )}
        </div>

        {/* To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To (Destination City)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="e.g., Pokhara"
              className={`input-field pl-10 ${
                errors.to ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.to && (
            <p className="mt-1 text-sm text-red-600">{errors.to}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Route Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g., Scenic mountain highway journey through picturesque landscapes"
            rows="3"
            className={`input-field ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 6-7 hours"
              className={`input-field pl-10 ${
                errors.duration ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (NPR)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 800"
              min="0"
              step="50"
              className={`input-field pl-10 ${
                errors.price ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price}</p>
          )}
        </div>

        {/* Total Seats */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Seats
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              min="1"
              max="100"
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Available Seats */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Seats
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="number"
              name="availableSeats"
              value={formData.availableSeats}
              onChange={handleChange}
              min="0"
              max={formData.totalSeats}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Departure Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departure Time
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              className={`input-field pl-10 ${
                errors.departureTime ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.departureTime && (
            <p className="mt-1 text-sm text-red-600">{errors.departureTime}</p>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center space-x-3 pt-6">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Active Route (visible to customers)
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {route ? "Update Route" : "Create Route"}
        </button>
      </div>
    </form>
  );
};

export default RouteForm;
