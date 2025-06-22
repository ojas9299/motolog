import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import VehicleList from "./VehicleList";
import Sidebar from "./components/Sidebar";
import TripForm from "./components/TripForm";
import TripMap from "./components/TripMap";
import TripMapPreview from "./components/TripMapPreview";
import { useTrips } from "./hooks/useTrips";
import { useVehicles } from "./hooks/useVehicles";
import { useToast } from "./hooks/useToast";
import Toast from "./components/ui/Toast";
import Spinner from "./components/ui/Spinner";

const fadeSlide = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

const MyTrips = ({ activeTab }) => {
  const { user } = useUser();
  const { trips, loading, error, createTrip, updateTrip, deleteTrip } =
    useTrips(user?.id);
  const { vehicles } = useVehicles(user?.id);
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [selectedTripForMap, setSelectedTripForMap] = useState(null);

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
      };

      let result;
      if (editingTrip) {
        result = await updateTrip(editingTrip._id, enrichedTripData);
        if (result.success) {
          showSuccess("Trip updated successfully!");
        }
      } else {
        result = await createTrip(enrichedTripData);
        if (result.success) {
          showSuccess("Trip logged successfully!");
        }
      }

      if (result.success) {
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
      if (result.success) {
        showSuccess("Trip deleted successfully!");
      } else {
        showError(result.error || "Failed to delete trip");
      }
    } catch (err) {
      showError(err.message || "Failed to delete trip");
    }
  };

  if (activeTab !== "trips") return null;

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />

      {/* Map Modal */}
      {selectedTripForMap && (
        <TripMap
          trip={selectedTripForMap}
          onClose={() => setSelectedTripForMap(null)}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div key="trips" {...fadeSlide}>
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-6 text-indigo-700">
              My Trips
            </h2>
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
                  {...(editingTrip ? { ...editingTrip } : {})}
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
                    {trips.map((trip) => (
                      <motion.div
                        key={trip._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        whileHover={{
                          scale: 1.04,
                          boxShadow: "0 8px 32px rgba(99,102,241,0.10)",
                        }}
                        className="border rounded-2xl shadow-lg p-5 bg-white transition-all duration-200"
                      >
                        <div className="mb-2 text-xs text-gray-400">
                          {trip.startTime &&
                            new Date(trip.startTime).toLocaleString()}{" "}
                          →{" "}
                          {trip.endTime &&
                            new Date(trip.endTime).toLocaleString()}
                        </div>
                        <div className="font-bold mb-1 text-indigo-700 text-lg">
                          {trip.brand} {trip.model}{" "}
                          <span className="text-gray-500">({trip.color})</span>
                        </div>
                        <div className="mb-1 text-sm">
                          Owner:{" "}
                          <span className="font-medium">{trip.owner}</span>
                        </div>
                        <div className="mb-1 text-sm">
                          From:{" "}
                          <span className="font-medium">
                            {trip.startLocation}
                          </span>
                        </div>
                        <div className="mb-1 text-sm">
                          To:{" "}
                          <span className="font-medium">
                            {trip.endLocation}
                          </span>
                        </div>
                        <div className="mb-2 text-sm">
                          {trip.calculatedDistance ? (
                            <span className="font-semibold text-green-600">
                              Distance: {trip.calculatedDistance} km
                            </span>
                          ) : (
                            <span className="text-gray-500 italic">
                              Distance: Could not calculate
                            </span>
                          )}
                        </div>
                        {trip.rating && (
                          <div className="mb-1 text-sm">
                            Rating: {trip.rating}/5
                          </div>
                        )}
                        {trip.description && (
                          <div className="mb-1 text-sm">
                            Description: {trip.description}
                          </div>
                        )}

                        {/* Map Preview */}
                        <div className="mb-3">
                          <TripMapPreview
                            startLocation={trip.startLocation}
                            endLocation={trip.endLocation}
                            onClick={() => setSelectedTripForMap(trip)}
                          />
                        </div>

                        {trip.vehicleImage && (
                          <img
                            src={trip.vehicleImage}
                            alt="Vehicle"
                            className="w-full h-32 object-cover rounded-xl mb-2 border"
                          />
                        )}
                        {trip.tripImages && trip.tripImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {trip.tripImages.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt="Trip"
                                className="w-20 h-20 object-cover rounded-xl border"
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-4">
                          <motion.button
                            whileHover={{
                              scale: 1.07,
                              backgroundColor: "#059669",
                            }}
                            whileTap={{ scale: 0.97 }}
                            className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                            onClick={() => setSelectedTripForMap(trip)}
                          >
                            🗺️ View Map
                          </motion.button>
                          <motion.button
                            whileHover={{
                              scale: 1.07,
                              backgroundColor: "#2563eb",
                            }}
                            whileTap={{ scale: 0.97 }}
                            className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                            onClick={() => {
                              setShowForm(true);
                              setEditingTrip(trip);
                            }}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{
                              scale: 1.07,
                              backgroundColor: "#dc2626",
                            }}
                            whileTap={{ scale: 0.97 }}
                            className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                            onClick={() => handleDeleteTrip(trip._id)}
                          >
                            Delete
                          </motion.button>
                        </div>
                      </motion.div>
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

const MyVehicles = ({ activeTab }) => {
  if (activeTab !== "vehicles") return null;
  return (
    <AnimatePresence mode="wait">
      <motion.div key="vehicles" {...fadeSlide}>
        <VehicleList />
      </motion.div>
    </AnimatePresence>
  );
};

const MyFuel = ({ activeTab }) => {
  if (activeTab !== "fuel") return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div key="fuel" {...fadeSlide}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-emerald-700">
            Fuel Logs
          </h2>
          <p className="text-gray-600">
            This is where you'll track and view fuel logs per vehicle.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  const { user } = useUser();

  return (
    <>
      <header className="p-4 flex justify-between items-center bg-white shadow">
        <div className="font-bold text-xl">Motolog</div>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </header>
      <SignedIn>
        <Sidebar>
          <MyVehicles />
          <MyTrips />
          <MyFuel />
        </Sidebar>
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold mb-4">Welcome to Motolog</h1>
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700 transition">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
