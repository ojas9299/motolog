import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import VehicleForm from "./VehicleForm";
import { useVehicles } from "../../hooks/useVehicles";
import { useToast } from "../../hooks/useToast";
import Spinner from "../ui/Spinner";
import Toast from "../ui/Toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical, Edit, Trash2, Car } from 'lucide-react';
import * as Avatar from '@radix-ui/react-avatar';
import * as Tooltip from '@radix-ui/react-tooltip';

const API_NINJAS_KEY = "8s0Wvvk7bRewkDb4/sKLhA==qVEIlg8bkbJD5NgW"; // <-- Inserted user API key

const fetchVehicleSpecs = async (brand, model) => {
  try {
    const res = await axios.get("https://api.api-ninjas.com/v1/motorcycles", {
      params: { make: brand, model },
      headers: { "X-Api-Key": API_NINJAS_KEY },
    });
    if (Array.isArray(res.data) && res.data.length > 0) {
      // Return the first match
      return { verified: true, specs: res.data[0] };
    } else {
      return { verified: false, specs: null };
    }
  } catch (err) {
    return { verified: false, specs: null };
  }
};

const VehicleSpecsModal = ({ open, onClose, specs, loading, verified }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-indigo-700 flex items-center gap-2">
          Vehicle Specs
          {verified === true && <span title="Verified" className="text-green-600 text-xl">✅</span>}
          {verified === false && <span title="Not Verified" className="text-red-600 text-xl">⚠️</span>}
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Spinner size="lg" />
          </div>
        ) : specs ? (
          <div className="space-y-2">
            <div className="text-lg font-semibold mb-2">{specs.make} {specs.model} {specs.year}</div>
            <div><span className="font-medium">Engine:</span> {specs.engine}</div>
            <div><span className="font-medium">Power:</span> {specs.power}</div>
            <div><span className="font-medium">Torque:</span> {specs.torque}</div>
            <div><span className="font-medium">Tank Capacity:</span> {specs.fuel_capacity || specs.tankCapacity}</div>
            <div><span className="font-medium">Weight:</span> {specs.total_weight || specs.weight}</div>
            <div><span className="font-medium">Seat Height:</span> {specs.seat_height || specs.seatHeight}</div>
            <div><span className="font-medium">Top Speed:</span> {specs.top_speed || specs.topSpeed}</div>
            {/* Add more fields as needed */}
          </div>
        ) : (
          <div className="text-gray-500">No specs found.</div>
        )}
      </div>
    </div>
  );
};

const VehicleList = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    vehicles,
    loading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicles(user?.id);
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [specsModalOpen, setSpecsModalOpen] = useState(false);
  const [specsLoading, setSpecsLoading] = useState(false);
  const [vehicleSpecs, setVehicleSpecs] = useState(null);
  const [verified, setVerified] = useState(null);
  const [lastChecked, setLastChecked] = useState({});

  const handleCardClick = (vehicle) => {
    navigate(`/vehicle/${vehicle._id}`);
  };

  const handleAddVehicle = async (vehicleData) => {
    try {
      const ownerName = user.fullName || user.firstName || user.username || "";
      const result = await createVehicle({
        ...vehicleData,
        userId: user.id,
        owner: ownerName,
      });

      if (result.success) {
        showSuccess("Vehicle added successfully!");
        setIsAdding(false);
      } else {
        showError(result.error || "Failed to add vehicle");
      }
    } catch (err) {
      showError(err.message || "Failed to add vehicle");
    }
  };

  const handleUpdateVehicle = async (vehicleData) => {
    try {
      const ownerName = user.fullName || user.firstName || user.username || "";
      const result = await updateVehicle(editingVehicle._id, {
        ...vehicleData,
        userId: user.id,
        owner: ownerName,
      });

      if (result.success) {
        showSuccess("Vehicle updated successfully!");
        setEditingVehicle(null);
      } else {
        showError(result.error || "Failed to update vehicle");
      }
    } catch (err) {
      showError(err.message || "Failed to update vehicle");
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) {
      return;
    }

    try {
      const result = await deleteVehicle(id);

      if (result.success) {
        showSuccess("Vehicle deleted successfully!");
      } else {
        showError(result.error || "Failed to delete vehicle");
      }
    } catch (err) {
      showError(err.message || "Failed to delete vehicle");
    }
  };

  if (!user) return <p>Please sign in to view your vehicles.</p>;

  if (isAdding) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Add New Vehicle</h2>
        <VehicleForm
          onSubmit={handleAddVehicle}
          onCancel={() => setIsAdding(false)}
        />
      </div>
    );
  }

  if (editingVehicle) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleUpdateVehicle}
          onCancel={() => setEditingVehicle(null)}
        />
      </div>
    );
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
      <VehicleSpecsModal open={specsModalOpen} onClose={() => setSpecsModalOpen(false)} specs={vehicleSpecs} loading={specsLoading} verified={verified} />
      <div className="p-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-indigo-300">Your Vehicles</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-lg"
          >
            Add Vehicle
          </motion.button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="bg-neutral-900/80 border border-neutral-700 rounded-2xl shadow-lg p-6 flex flex-col gap-3 hover:shadow-2xl transition group cursor-pointer relative"
              onClick={() => handleCardClick(vehicle)}
              tabIndex={0}
              role="button"
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(vehicle); }}
            >
              <div className="w-full mb-3 flex justify-center">
                {vehicle.imageUrl ? (
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.brand + ' ' + vehicle.model}
                    className="w-full max-w-[260px] h-40 object-cover rounded-xl border-2 border-indigo-500/40 shadow-md group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full max-w-[260px] h-40 flex items-center justify-center bg-indigo-800 text-indigo-200 text-5xl font-extrabold rounded-xl border-2 border-indigo-500/40 shadow-md">
                    {vehicle.brand?.[0]?.toUpperCase() || <Car size={48} />}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1">
                  <div className="text-lg font-bold text-indigo-200">{vehicle.brand} {vehicle.model}</div>
                  <div className="text-sm text-indigo-100">{vehicle.registrationNumber}</div>
                </div>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className="p-2 rounded-full hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 z-10"
                      onClick={e => e.stopPropagation()}
                      onKeyDown={e => e.stopPropagation()}
                    >
                      <MoreVertical size={20} />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="bg-neutral-900 border border-neutral-700 rounded-xl shadow-lg py-2 min-w-[140px]">
                    <DropdownMenu.Item onClick={() => setEditingVehicle(vehicle)} className="flex items-center gap-2 px-4 py-2 text-indigo-200 hover:bg-neutral-800 cursor-pointer">
                      <Edit size={16} /> Edit
                    </DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => handleDeleteVehicle(vehicle._id)} className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-neutral-800 cursor-pointer">
                      <Trash2 size={16} /> Delete
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-indigo-100">
                <span className="bg-indigo-900/60 px-2 py-1 rounded-lg">{vehicle.color}</span>
                <span className="bg-indigo-900/60 px-2 py-1 rounded-lg">{vehicle.type?.toUpperCase()}</span>
                <span className="bg-indigo-900/60 px-2 py-1 rounded-lg">{vehicle.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VehicleList;
