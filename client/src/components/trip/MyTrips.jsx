// src/pages/MyTrips.jsx
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";

import { useTrips } from "../../hooks/useTrips";
import { useVehicles } from "../../hooks/useVehicles";
import { useToast } from "../../hooks/useToast"; // ✅ Correct

import TripForm from "../../components/trip/TripForm";
import TripMap from "../../components/trip/TripMap";
import TripCard from "../../components/trip/TripCard";
import Toast from "../ui/Toast";
import Spinner from "../ui/Spinner";

const MyTrips = ({ activeTab }) => {
  const { user } = useUser();
  const { trips, loading, error, createTrip, updateTrip, deleteTrip } =
    useTrips(user?.id);
  const { vehicles } = useVehicles(user?.id);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [selectedTripForMap, setSelectedTripForMap] = useState(null);

  if (activeTab !== "trips") return null;

  // Filter out trips for deleted vehicles
  const validVehicleIds = new Set(vehicles.map(v => v._id));
  const filteredTrips = trips.filter(trip => validVehicleIds.has(trip.vehicleId));

  const handleTripSubmit = async (tripData) => {
    try {
      const vehicle = vehicles.find((v) => v._id === tripData.vehicleId);
      const enrichedTripData = {
        ...tripData,
        userId: user.id,
        owner: user.fullName || user.firstName || user.username || "",
        brand: vehicle?.brand,
        model: vehicle?.model,
        color: vehicle?.color,
        registrationNumber: vehicle?.registrationNumber,
        vehicleImage: vehicle?.imageUrl,
        type: vehicle?.type,
      };

      const result = editingTrip
        ? await updateTrip(editingTrip._id, enrichedTripData)
        : await createTrip(enrichedTripData);

      if (result.success) {
        showSuccess(
          editingTrip
            ? "Trip updated successfully!"
            : "Trip logged successfully!"
        );
        setShowForm(false);
        setEditingTrip(null);
      } else {
        showError(result.error || "Failed to save trip");
      }
    } catch (err) {
      showError(err.message || "Failed to save trip");
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const result = await deleteTrip(tripId);
      result.success
        ? showSuccess("Trip deleted successfully!")
        : showError(result.error || "Failed to delete");
    } catch (err) {
      showError(err.message || "Failed to delete trip");
    }
  };

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />

      {selectedTripForMap && (
        <TripMap
          trip={selectedTripForMap}
          onClose={() => setSelectedTripForMap(null)}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key="trips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="p-4">
            {showForm ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <TripForm
                  vehicles={vehicles}
                  onSubmit={handleTripSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingTrip(null);
                  }}
                  editTrip={editingTrip}
                />
              </motion.div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.04, backgroundColor: "#6366f1" }}
                  whileTap={{ scale: 0.97 }}
                  className="mb-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-semibold text-lg transition-all"
                  onClick={() => {
                    setShowForm(true);
                    setEditingTrip(null);
                  }}
                  disabled={vehicles.length === 0}
                >
                  Log New Trip
                </motion.button>

                {vehicles.length === 0 && (
                  <p className="text-gray-500 mb-4">
                    Add a vehicle first to log a trip.
                  </p>
                )}

                {error && (
                  <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    Error: {error}
                  </div>
                )}

                {loading && <Spinner size="lg" className="my-8" />}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredTrips.map((trip) => (
                      <TripCard
                        key={trip._id}
                        trip={trip}
                        onViewMap={() => setSelectedTripForMap(trip)}
                        onEdit={() => {
                          setShowForm(true);
                          setEditingTrip(trip);
                        }}
                        onDelete={() => handleDeleteTrip(trip._id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MyTrips;
