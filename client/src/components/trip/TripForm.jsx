import React, { useState, useEffect, useRef } from "react";
import { Form, ShadcnFormField } from "../ui/Form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const TripForm = ({ vehicles, onSubmit, onCancel, editTrip }) => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autofill form fields when editing, but only when the trip changes
  const lastEditId = useRef();
  const [sharePublic, setSharePublic] = useState(editTrip?.visibility === "public");
  useEffect(() => {
    if (editTrip && editTrip._id) {
      if (lastEditId.current !== editTrip._id) {
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
        lastEditId.current = editTrip._id;
        setSharePublic(editTrip.visibility === "public");
      }
    } else if (!editTrip || !editTrip._id) {
      setFormData({
        vehicleId: vehicles[0]?._id || "",
        startLocation: "",
        endLocation: "",
        startTime: "",
        endTime: "",
        tripImages: [""],
        description: "",
        rating: ""
      });
      lastEditId.current = undefined;
      setSharePublic(false);
    }
  }, [editTrip?._id, vehicles]);

  const [vehicleImages, setVehicleImages] = useState([]);
  const tripFileInputRef = useRef();
  const vehicleFileInputRef = useRef();
  const [tripUploading, setTripUploading] = useState(false);
  const [tripUploadError, setTripUploadError] = useState(null);
  const [vehicleUploading, setVehicleUploading] = useState(false);
  const [vehicleUploadError, setVehicleUploadError] = useState(null);

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

  // Trip image upload
  const handleTripImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || formData.tripImages.length >= 6) return;
    setTripUploading(true);
    setTripUploadError(null);
    try {
      const res = await fetch(`http://16.171.137.112:5000/api/generate-upload-url?name=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}`);
      if (!res.ok) throw new Error('Failed to get upload URL');
      const { url, publicUrl } = await res.json();
      const uploadRes = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Failed to upload image');
      setFormData(prev => ({ ...prev, tripImages: [...prev.tripImages, publicUrl].slice(0, 6) }));
    } catch (err) {
      setTripUploadError(err.message || 'Image upload failed');
    } finally {
      setTripUploading(false);
    }
  };

  // Remove trip image
  const handleRemoveTripImage = (idx) => {
    setFormData(prev => ({ ...prev, tripImages: prev.tripImages.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    Promise.resolve(onSubmit({
      ...formData,
      rating: formData.rating ? Number(formData.rating) : undefined,
      tripImages: formData.tripImages.filter((img) => img).slice(0, 6),
      visibility: sharePublic ? "public" : "private",
      sharedAt: sharePublic ? new Date().toISOString() : undefined,
    })).finally(() => setIsSubmitting(false));
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
      <ShadcnFormField label="Vehicle">
        <select
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
          disabled={isSubmitting}
        >
          {vehicles.map((v) => (
            <option key={v._id} value={v._id}>
              {v.brand} {v.model} ({v.color})
            </option>
          ))}
        </select>
      </ShadcnFormField>
      <ShadcnFormField label="Start Location">
        <Input
          type="text"
          name="startLocation"
          value={formData.startLocation}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <ShadcnFormField label="End Location">
        <Input
          type="text"
          name="endLocation"
          value={formData.endLocation}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <div className="flex space-x-2">
        <ShadcnFormField label="Start Time" className="flex-1">
          <Input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </ShadcnFormField>
        <ShadcnFormField label="End Time" className="flex-1">
          <Input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </ShadcnFormField>
      </div>
      <ShadcnFormField label="Trip Images (max 6)">
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tripImages.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={img} alt="Trip" className="w-20 h-20 object-cover rounded border" />
              <Button type="button" variant="secondary" className="absolute top-0 right-0 p-1 text-xs" onClick={() => handleRemoveTripImage(idx)} disabled={isSubmitting || tripUploading}>×</Button>
            </div>
          ))}
          {formData.tripImages.length < 6 && (
            <input
              type="file"
              accept="image/*"
              ref={tripFileInputRef}
              onChange={handleTripImageUpload}
              disabled={isSubmitting || tripUploading}
              className="w-32"
            />
          )}
        </div>
        {tripUploading && <span className="text-blue-600 text-xs">Uploading...</span>}
        {tripUploadError && <span className="text-red-600 text-xs">{tripUploadError}</span>}
      </ShadcnFormField>
      <ShadcnFormField label="Description">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          rows="3"
          placeholder="Describe your trip..."
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <ShadcnFormField label="Rating">
        <Input
          type="number"
          name="rating"
          min="1"
          max="5"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Rate your trip (1-5)"
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <ShadcnFormField label="Share to Rideboard (public)">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={sharePublic}
            onChange={e => setSharePublic(e.target.checked)}
            disabled={isSubmitting}
          />
          <span>Share this trip to Rideboard (public)</span>
        </label>
      </ShadcnFormField>
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (editTrip && editTrip._id ? 'Updating...' : 'Logging...') : (editTrip && editTrip._id ? 'Update Trip' : 'Log Trip')}
        </Button>
      </div>
      {isSubmitting && <span className="ml-2 text-blue-600">Submitting...</span>}
    </Form>
  );
};

export default TripForm; 