// src/components/trips/TripCard.jsx
import React from "react";
import { motion } from "framer-motion";
import TripMapPreview from "./TripMapPreview";

const TripCard = ({ trip, onViewMap, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 8px 32px rgba(99,102,241,0.10)",
      }}
      className="border rounded-2xl shadow-lg p-5 bg-white transition-all duration-200"
    >
      {/* Your existing trip card JSX here */}
      <div className="mb-2 text-xs text-gray-400">
        {trip.startTime && new Date(trip.startTime).toLocaleString()} →{" "}
        {trip.endTime && new Date(trip.endTime).toLocaleString()}
      </div>
      <div className="font-bold mb-1 text-indigo-700 text-lg">
        {trip.brand} {trip.model}{" "}
        <span className="text-gray-500">({trip.color})</span>
      </div>
      <div className="mb-1 text-sm">
        Owner: <span className="font-medium">{trip.owner}</span>
      </div>
      <div className="mb-1 text-sm">
        From: <span className="font-medium">{trip.startLocation}</span>
      </div>
      <div className="mb-1 text-sm">
        To: <span className="font-medium">{trip.endLocation}</span>
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
        <div className="mb-1 text-sm">Rating: {trip.rating}/5</div>
      )}
      {trip.description && (
        <div className="mb-1 text-sm">Description: {trip.description}</div>
      )}

      <div className="mb-3">
        <TripMapPreview
          startLocation={trip.startLocation}
          endLocation={trip.endLocation}
          onClick={onViewMap}
        />
      </div>

      {trip.vehicleImage && (
        <img
          src={trip.vehicleImage}
          alt="Vehicle"
          className="w-full h-32 object-cover rounded-xl mb-2 border"
        />
      )}
      {trip.tripImages?.length > 0 && (
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
          whileHover={{ scale: 1.07, backgroundColor: "#059669" }}
          className="px-4 py-1 bg-green-600 text-white rounded-lg font-medium"
          onClick={onViewMap}
        >
          🗺️ View Map
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.07, backgroundColor: "#2563eb" }}
          className="px-4 py-1 bg-blue-600 text-white rounded-lg font-medium"
          onClick={onEdit}
        >
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.07, backgroundColor: "#dc2626" }}
          className="px-4 py-1 bg-red-600 text-white rounded-lg font-medium"
          onClick={onDelete}
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TripCard;
