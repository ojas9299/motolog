import React from 'react';

const TripMapPreview = ({ startLocation, endLocation, onClick }) => {
  // Create a static map URL using OpenStreetMap
  const getStaticMapUrl = () => {
    // For now, we'll use a placeholder. In a real app, you could use:
    // - Google Static Maps API
    // - Mapbox Static Images API
    // - Or generate a simple preview with coordinates
    
    // This is a simple placeholder that shows a map-like background
    return `https://via.placeholder.com/300x150/4F46E5/FFFFFF?text=🗺️+View+Route`;
  };

  return (
    <div 
      className="w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg cursor-pointer relative overflow-hidden group"
      onClick={onClick}
    >
      {/* Map-like background pattern */}
      <div className="absolute inset-0 bg-opacity-20 bg-white"></div>
      
      {/* Route visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white font-medium">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-xs truncate max-w-20">{startLocation}</span>
          <div className="w-8 h-0.5 bg-white"></div>
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <span className="text-xs truncate max-w-20">{endLocation}</span>
        </div>
      </div>
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
        <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Click to View Full Map
        </span>
      </div>
    </div>
  );
};

export default TripMapPreview; 