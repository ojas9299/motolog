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
      if (!vehicle) {
        showError("Please select a valid vehicle.");
        return;
      }
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
        startTime: tripData.startTime ? new Date(tripData.startTime).toISOString() : undefined,
        endTime: tripData.endTime ? new Date(tripData.endTime).toISOString() : undefined,
      };
      console.log('Submitting trip:', enrichedTripData);
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
        showError(result.error || (result.details && result.details.join(', ')) || "Failed to save trip");
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
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">My Trips</h2>
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

                {loading && <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  <AnimatePresence mode="sync">
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
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(99,102,241,0.10)" }}
                    className="transition-all duration-200 flex justify-center"
                  >
                    <div
                      className="rounded-2xl shadow-lg p-0 bg-gray-50 flex flex-col gap-2 w-full border-2 border-dashed border-indigo-200 mx-auto my-2 max-w-md min-h-[420px] opacity-70 hover:opacity-100 hover:shadow-xl cursor-pointer items-center justify-center"
                      onClick={() => { setShowForm(true); setEditingTrip(null); }}
                      tabIndex={0}
                      role="button"
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setShowForm(true); setEditingTrip(null); } }}
                    >
                      <div className="w-full aspect-[16/9] bg-gray-100 border-b border-gray-200 shadow-sm flex items-center justify-center rounded-t-2xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div className="p-4 flex flex-col gap-2 min-h-0 items-center justify-center">
                        <span className="text-xl font-semibold text-indigo-400">Add New Trip</span>
                      </div>
                    </div>
                  </motion.div>
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
