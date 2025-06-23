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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">Your Vehicles</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-lg"
          >
            Add Vehicle
          </motion.button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}

        {loading && <Spinner size="lg" className="my-8" />}

        {!loading && vehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No vehicles found. Add your first vehicle!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {vehicles.map((vehicle) => {
                const badge = lastChecked[vehicle._id];
                return (
                  <motion.div
                    key={vehicle._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-xl shadow-lg p-6 bg-white hover:shadow-xl transition-all duration-200 cursor-pointer"
                    onClick={() => handleCardClick(vehicle)}
                  >
                    {vehicle.imageUrl && (
                      <img
                        src={vehicle.imageUrl}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-48 object-cover rounded-lg mb-4 border"
                      />
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-indigo-700">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      {badge === true && <span title="Verified" className="text-green-600 text-lg">✅</span>}
                      {badge === false && <span title="Not Verified" className="text-red-600 text-lg">⚠️</span>}
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Owner:</span>{" "}
                        {vehicle.owner}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Type:</span> {vehicle.type}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Year:</span> {vehicle.year}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Registration:</span>{" "}
                        {vehicle.registrationNumber}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Kilometers:</span>{" "}
                        {vehicle.kilometersDriven?.toLocaleString() || "0"}
                      </p>
                      {vehicle.color && (
                        <p className="text-gray-600">
                          <span className="font-medium">Color:</span>{" "}
                          {vehicle.color}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingVehicle(vehicle);
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteVehicle(vehicle._id);
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default VehicleList;
