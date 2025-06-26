// src/components/trips/TripCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Calendar, User, MapPin, Route, Ruler, Star, FileText, Edit, Trash2, Bike, Car } from 'lucide-react';

const TripCard = ({ trip, onViewMap, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(99,102,241,0.10)" }}
      className="transition-all duration-200"
    >
      <Card className="rounded-2xl shadow-lg p-0 bg-white flex flex-col gap-2 overflow-hidden">
        {/* Trip image at top */}
        {trip.tripImages?.length > 0 && (
          <img
            src={trip.tripImages[0]}
            alt="Trip"
            className="w-full h-44 object-cover rounded-t-2xl"
          />
        )}
        <div className="p-5 flex flex-col gap-2">
          {/* Date/time */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Calendar size={16} className="text-indigo-400" />
            {trip.startTime && new Date(trip.startTime).toLocaleString()} <span className="mx-1">→</span> {trip.endTime && new Date(trip.endTime).toLocaleString()}
          </div>
          {/* Brand/model/color and Route in one row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="font-bold text-indigo-700 text-lg flex items-center gap-2">
              {trip.brand} {trip.model}
              <span className="text-xs text-gray-500 font-normal">({trip.color})</span>
            </div>
            <span className="text-base font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded shadow-sm flex items-center gap-2">
              <MapPin size={16} className="text-green-500" />
              {trip.startLocation}
              <span className="mx-1">→</span>
              <MapPin size={16} className="text-red-500" />
              {trip.endLocation}
            </span>
          </div>
          {/* Description (moved up, with tag and icon, always left-aligned) */}
          {trip.description && (
            <div className="mb-1">
              <div className="flex items-center gap-1 mb-1">
                <FileText size={16} className="text-indigo-400" />
                <span className="font-semibold text-gray-700">Description:</span>
              </div>
              <div className="pl-6 text-md font-medium text-gray-700 whitespace-pre-line">
                {trip.description}
              </div>
            </div>
          )}
          {/* Distance */}
          <div className="text-sm flex items-center gap-2 mb-1">
            <Ruler size={15} className="text-indigo-400" />
            <span className="font-semibold text-gray-700">Distance:</span>
            {trip.calculatedDistance ? (
              <span className="font-semibold text-green-600">{trip.calculatedDistance} km</span>
            ) : (
              <span className="text-gray-400 italic">N/A</span>
            )}
          </div>
          {/* Rating */}
          {trip.rating && (
            <div className="text-sm flex items-center gap-1 mb-1">
              <Star size={15} className="text-yellow-400" />
              <span className="font-semibold text-gray-700">Rating:</span>
              <span>{trip.rating}/5</span>
            </div>
          )}
          {/* Additional trip images (thumbnails) */}
          {trip.tripImages?.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {trip.tripImages.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Trip"
                  className="w-20 h-20 object-cover rounded-xl border"
                />
              ))}
            </div>
          )}
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button onClick={onViewMap} variant="outline" className="flex items-center gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50"><MapPin size={16}/> View Map</Button>
            <Button onClick={onEdit} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"><Edit size={16}/> Edit</Button>
            <Button onClick={onDelete} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white"><Trash2 size={16}/> Delete</Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TripCard;
