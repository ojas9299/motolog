import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import VehicleForm from "./VehicleForm";
import { useVehicles } from "../../hooks/useVehicles";
import { useToast } from "../../hooks/useToast";
import Spinner from "../ui/Spinner";
import Toast from "../ui/Toast";

const VehicleList = () => {
  const { user } = useUser();
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
              {vehicles.map((vehicle) => (
                <motion.div
                  key={vehicle._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02 }}
                  className="border rounded-xl shadow-lg p-6 bg-white hover:shadow-xl transition-all duration-200"
                >
                  {vehicle.imageUrl && (
                    <img
                      src={vehicle.imageUrl}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-full h-48 object-cover rounded-lg mb-4 border"
                    />
                  )}

                  <h3 className="text-xl font-bold text-indigo-700 mb-2">
                    {vehicle.brand} {vehicle.model}
                  </h3>

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
                      onClick={() => setEditingVehicle(vehicle)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteVehicle(vehicle._id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default VehicleList;
