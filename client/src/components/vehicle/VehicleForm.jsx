import React, { useState, useRef } from 'react';
import { Form, ShadcnFormField } from "../ui/Form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const VehicleForm = ({ vehicle, onSubmit, onCancel, error }) => {
  const [formData, setFormData] = useState({
    type: vehicle?.type || 'car',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    registrationNumber: vehicle?.registrationNumber || '',
    kilometersDriven: vehicle?.kilometersDriven || 0,
    color: vehicle?.color || '',
    imageUrl: vehicle?.imageUrl || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [vehicleImages, setVehicleImages] = useState(vehicle?.vehicleImages || (vehicle?.imageUrl ? [vehicle.imageUrl] : []));
  const vehicleFileInputRef = useRef();
  const [vehicleUploading, setVehicleUploading] = useState(false);
  const [vehicleUploadError, setVehicleUploadError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const dataToSend = {
      ...formData,
      year: Number(formData.year),
      kilometersDriven: Number(formData.kilometersDriven),
      registrationNumber: formData.registrationNumber.toUpperCase(),
      vehicleImages: vehicleImages.slice(0, 6),
      imageUrl: vehicleImages[0] || '', // for backward compatibility
    };
    Promise.resolve(onSubmit(dataToSend)).finally(() => setIsSubmitting(false));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      // 1. Get pre-signed URL
      const res = await fetch(`https://api.motolog.online/api/generate-upload-url?name=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}`);
      if (!res.ok) throw new Error('Failed to get upload URL');
      const { url, publicUrl } = await res.json();
      // 2. Upload to S3
      const uploadRes = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Failed to upload image');
      // 3. Set imageUrl in form
      setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
    } catch (err) {
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Vehicle image upload
  const handleVehicleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || vehicleImages.length >= 6) return;
    setVehicleUploading(true);
    setVehicleUploadError(null);
    try {
      const res = await fetch(`https://api.motolog.online/api/generate-upload-url?name=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type)}`);
      if (!res.ok) throw new Error('Failed to get upload URL');
      const { url, publicUrl } = await res.json();
      const uploadRes = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error('Failed to upload image');
      setVehicleImages(prev => [...prev, publicUrl].slice(0, 6));
    } catch (err) {
      setVehicleUploadError(err.message || 'Image upload failed');
    } finally {
      setVehicleUploading(false);
    }
  };

  // Remove vehicle image
  const handleRemoveVehicleImage = (idx) => {
    setVehicleImages(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto px-2 sm:p-4 dark:text-white">
      {error && (
        <div className="mb-4 text-red-600 font-semibold text-center">
          {error}
        </div>
      )}
      <ShadcnFormField label="Type">
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
        </select>
      </ShadcnFormField>
      <ShadcnFormField label="Brand">
        <Input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <ShadcnFormField label="Model">
        <Input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <ShadcnFormField label="Year">
        <Input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <ShadcnFormField label="Registration Number">
        <Input
          type="text"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <ShadcnFormField label="Kilometers Driven">
        <Input
          type="number"
          name="kilometersDriven"
          value={formData.kilometersDriven}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <ShadcnFormField label="Color">
        <Input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <ShadcnFormField label="Vehicle Images (max 6)">
        <div className="flex flex-wrap gap-2 mb-2">
          {vehicleImages.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={img} alt="Vehicle" className="w-20 h-20 object-cover rounded border" />
              <Button type="button" variant="secondary" className="absolute top-0 right-0 p-1 text-xs" onClick={() => handleRemoveVehicleImage(idx)} disabled={isSubmitting || vehicleUploading}>×</Button>
            </div>
          ))}
          {vehicleImages.length < 6 && (
            <input
              type="file"
              accept="image/*"
              ref={vehicleFileInputRef}
              onChange={handleVehicleImageUpload}
              disabled={isSubmitting || vehicleUploading}
              className="w-32"
            />
          )}
        </div>
        {vehicleUploading && <span className="text-blue-600 text-xs">Uploading...</span>}
        {vehicleUploadError && <span className="text-red-600 text-xs">{vehicleUploadError}</span>}
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
          {isSubmitting ? (vehicle ? 'Updating...' : 'Adding...') : (vehicle ? 'Update Vehicle' : 'Add Vehicle')}
        </Button>
      </div>
      {isSubmitting && <span className="ml-2 text-blue-600">Submitting...</span>}
    </Form>
  );
};

export default VehicleForm; 