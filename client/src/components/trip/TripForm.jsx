import React, { useState, useEffect } from "react";

const TripForm = ({ vehicles, onSubmit, onCancel, ...editTrip }) => {
  const [formData, setFormData] = useState({
    vehicleId: vehicles[0]?._id || "",
    startLocation: "",
    endLocation: "",
    startTime: "",
    endTime: "",
    tripImages: [""],
    description: "",
    rating: ""
  });

  // Autofill form fields when editing
  useEffect(() => {
    if (editTrip && Object.keys(editTrip).length > 0) {
      setFormData({
        vehicleId: editTrip.vehicleId || vehicles[0]?._id || "",
        startLocation: editTrip.startLocation || "",
        endLocation: editTrip.endLocation || "",
        startTime: editTrip.startTime ? new Date(editTrip.startTime).toISOString().slice(0, 16) : "",
        endTime: editTrip.endTime ? new Date(editTrip.endTime).toISOString().slice(0, 16) : "",
        tripImages: editTrip.tripImages && editTrip.tripImages.length > 0 ? editTrip.tripImages : [""],
        description: editTrip.description || "",
        rating: editTrip.rating || ""
      });
    }
  }, [editTrip, vehicles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (idx, value) => {
    setFormData((prev) => {
      const imgs = [...prev.tripImages];
      imgs[idx] = value;
      return { ...prev, tripImages: imgs };
    });
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, tripImages: [...prev.tripImages, ""] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      rating: formData.rating ? Number(formData.rating) : undefined,
      tripImages: formData.tripImages.filter((img) => img)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Vehicle</label>
        <select
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          {vehicles.map((v) => (
            <option key={v._id} value={v._id}>
              {v.brand} {v.model} ({v.color})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Location</label>
        <input
          type="text"
          name="startLocation"
          value={formData.startLocation}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">End Location</label>
        <input
          type="text"
          name="endLocation"
          value={formData.endLocation}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Trip Images (URLs)</label>
        {formData.tripImages.map((img, idx) => (
          <div key={idx} className="flex space-x-2 mb-1">
            <input
              type="url"
              value={img}
              onChange={(e) => handleImageChange(idx, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Image URL"
            />
            {idx === formData.tripImages.length - 1 && (
              <button type="button" onClick={addImageField} className="px-2 py-1 bg-gray-200 rounded">+</button>
            )}
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows="3"
          placeholder="Describe your trip..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <input
          type="number"
          name="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="Rate your trip (1-5)"
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Log Trip
        </button>
      </div>
    </form>
  );
};

export default TripForm; 