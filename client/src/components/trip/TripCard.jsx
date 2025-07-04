// src/components/trips/TripCard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Calendar, User, MapPin, Route, Ruler, Star, FileText, Edit, Trash2, Bike, Car } from 'lucide-react';
import ImageModal from "../ui/ImageModal";

const TripCard = ({ trip, onViewMap, onEdit, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(0);
  const images = trip.tripImages?.filter(Boolean) || [];

  const handleImageClick = (idx) => {
    setModalIdx(idx);
    setModalOpen(true);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(99,102,241,0.10)" }}
      className="transition-all duration-200 flex justify-center"
    >
      <Card className="rounded-2xl shadow-lg p-0 bg-white flex flex-col gap-2 w-full border mx-auto my-2 max-w-md">
        {/* Custom 1+2 image layout */}
        <div className="w-full aspect-[16/9] bg-gray-100 border-b border-gray-200 shadow-sm flex items-stretch justify-center overflow-hidden rounded-t-2xl">
          {images.length === 1 && (
            <img
              src={images[0]}
              alt="Trip"
              className="object-cover w-full h-full cursor-pointer transition hover:brightness-90"
              onClick={() => handleImageClick(0)}
            />
          )}
          {images.length === 2 && (
            <>
              <img
                src={images[0]}
                alt="Trip 1"
                className="object-cover w-1/2 h-full cursor-pointer transition hover:brightness-90 border-r border-gray-200"
                onClick={() => handleImageClick(0)}
              />
              <img
                src={images[1]}
                alt="Trip 2"
                className="object-cover w-1/2 h-full cursor-pointer transition hover:brightness-90"
                onClick={() => handleImageClick(1)}
              />
            </>
          )}
          {images.length >= 3 && (
            <>
              <img
                src={images[0]}
                alt="Trip 1"
                className="object-cover w-1/2 h-full cursor-pointer transition hover:brightness-90 border-r border-gray-200"
                onClick={() => handleImageClick(0)}
              />
              <div className="flex flex-col w-1/2 h-full">
                <img
                  src={images[1]}
                  alt="Trip 2"
                  className="object-cover w-full h-1/2 cursor-pointer transition hover:brightness-90 border-b border-gray-200"
                  onClick={() => handleImageClick(1)}
                />
                <div className="relative w-full h-1/2">
                  <img
                    src={images[2]}
                    alt="Trip 3"
                    className="object-cover w-full h-full cursor-pointer transition hover:brightness-90"
                    onClick={() => handleImageClick(2)}
                  />
                  {images.length > 3 && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white text-lg font-bold rounded-b-2xl">
                      +{images.length - 3}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        {modalOpen && (
          <ImageModal images={images} startIndex={modalIdx} onClose={() => setModalOpen(false)} />
        )}
        <div className="p-4 flex flex-col gap-2 min-h-0">
          {/* Date/time */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Calendar size={15} className="text-indigo-400" />
            {trip.startTime && new Date(trip.startTime).toLocaleString()} <span className="mx-1">→</span> {trip.endTime && new Date(trip.endTime).toLocaleString()}
          </div>
          {/* Brand/model/color and Route in one row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="font-bold text-indigo-700 text-base flex items-center gap-2">
              {trip.brand} {trip.model}
            </div>
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded shadow-sm flex items-center gap-2">
              <MapPin size={14} className="text-green-500" />
              {trip.startLocation}
              <span className="mx-1">→</span>
              <MapPin size={14} className="text-red-500" />
              {trip.endLocation}
            </span>
          </div>
          {/* Instagram-style caption */}
          {trip.description && (
            <div className="mb-1 text-sm">
              <span className="font-semibold text-indigo-700 mr-2">{trip.owner}</span>
              <span className="text-gray-800">{trip.description}</span>
            </div>
          )}
          {/* Distance */}
          <div className="text-xs flex items-center gap-2 mb-1">
            <Ruler size={13} className="text-indigo-400" />
            <span className="font-semibold text-gray-700">Distance:</span>
            {trip.calculatedDistance ? (
              <span className="font-semibold text-green-600">{trip.calculatedDistance} km</span>
            ) : (
              <span className="text-gray-400 italic">N/A</span>
            )}
          </div>
          {/* Rating */}
          {trip.rating && (
            <div className="text-xs flex items-center gap-1 mb-1">
              <Star size={13} className="text-yellow-400" />
              <span className="font-semibold text-gray-700">Rating:</span>
              <span>{trip.rating}/5</span>
            </div>
          )}
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button onClick={onViewMap} variant="outline" className="flex items-center gap-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs py-1 px-2"><MapPin size={14}/> View Map</Button>
            <Button onClick={onEdit} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2"><Edit size={14}/> Edit</Button>
            <Button onClick={onDelete} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2"><Trash2 size={14}/> Delete</Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TripCard;
