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
import { MoreVertical, Edit, Trash2, Car } from 'lucide-react';
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "../ui/DropdownMenu";

const API_NINJAS_KEY = "8s0Wvvk7bRewkDb4/sKLhA==qVEIlg8bkbJD5NgW";

const fetchVehicleSpecs = async (brand, model) => {
  try {
    const res = await axios.get("https://api.api-ninjas.com/v1/motorcycles", {
      params: { make: brand, model },
      headers: { "X-Api-Key": API_NINJAS_KEY },
    });
    if (Array.isArray(res.data) && res.data.length > 0) {
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
          <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>
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

  if (!user) return <p className="text-center py-10 text-lg">Please sign in to view your vehicles.</p>;

  if (isAdding) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Add New Vehicle</h2>
        <VehicleForm
          onSubmit={handleAddVehicle}
          onCancel={() => setIsAdding(false)}
        />
      </div>
    );
  }

  if (editingVehicle) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Edit Vehicle</h2>
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
      <VehicleSpecsModal
        open={specsModalOpen}
        onClose={() => setSpecsModalOpen(false)}
        specs={vehicleSpecs}
        loading={specsLoading}
        verified={verified}
      />
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-indigo-700">My Vehicles</h2>
        </div>
        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>
        ) : vehicles.length === 0 ? (
          <div className="text-center text-indigo-400 py-12 text-lg">No vehicles found. Add your first vehicle!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10">
            {vehicles.map((vehicle) => (
              <Card
                key={vehicle._id}
                className="group flex flex-col p-0 cursor-pointer hover:shadow-2xl hover:ring-2 hover:ring-indigo-200 transition-shadow min-h-[420px] max-w-2xl w-full mx-auto relative font-sans border-2 border-indigo-100 bg-white"
                onClick={() => handleCardClick(vehicle)}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(vehicle); }}
              >
                <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 flex items-center justify-center bg-indigo-100 rounded-t-xl overflow-hidden relative">
                  {vehicle.vehicleImages && vehicle.vehicleImages.length > 0 ? (
                    <img
                      src={vehicle.vehicleImages[0]}
                      alt={vehicle.brand + ' ' + vehicle.model}
                      className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : vehicle.imageUrl ? (
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.brand + ' ' + vehicle.model}
                      className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-indigo-400 text-7xl font-extrabold">
                      {vehicle.brand?.[0]?.toUpperCase() || <Car size={56} />}
                    </div>
                  )}
                </div>
                <div className="flex flex-row items-center w-full px-6 pt-5">
                  <div className="text-3xl font-bold text-indigo-900 mb-1">{vehicle.brand} {vehicle.model}</div>
                </div>
                <div className="flex flex-row flex-wrap items-center gap-3 text-sm font-medium w-full px-6 pt-3 pb-4">
                  <span className="text-indigo-700 bg-indigo-50 rounded px-3 py-1 transition duration-200 hover:scale-105">{vehicle.color}</span>
                  <span className="text-indigo-700 bg-indigo-50 rounded px-3 py-1 transition duration-200 hover:scale-105">{vehicle.type?.toUpperCase()}</span>
                  <span className="text-indigo-700 bg-indigo-50 rounded px-3 py-1 transition duration-200 hover:scale-105">{vehicle.year}</span>
                  <span className="text-indigo-700 bg-indigo-50 rounded px-3 py-1 transition duration-200 hover:scale-105">{vehicle.registrationNumber}</span>
                </div>
              </Card>
            ))}
            <Card
              className="group flex flex-col items-center justify-center p-0 cursor-pointer border-2 border-dashed border-indigo-200 bg-gray-50 min-h-[420px] max-w-2xl w-full mx-auto relative font-sans opacity-70 hover:opacity-100 hover:shadow-xl transition-all"
              onClick={() => setIsAdding(true)}
              tabIndex={0}
              role="button"
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setIsAdding(true); }}
            >
              <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 flex flex-col items-center justify-center rounded-t-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xl font-semibold text-indigo-400">Add New Vehicle</span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default VehicleList;
