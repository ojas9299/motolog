import React, { useEffect, useState } from 'react';

const TripMap = ({ trip, onClose }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch coordinates for both locations
        const startResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trip.startLocation)}&limit=1`,
          {
            headers: { 'User-Agent': 'Motolog/1.0' }
          }
        );
        const endResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trip.endLocation)}&limit=1`,
          {
            headers: { 'User-Agent': 'Motolog/1.0' }
          }
        );

        const startData = await startResponse.json();
        const endData = await endResponse.json();

        if (startData.length === 0 || endData.length === 0) {
          throw new Error('Could not find coordinates for one or both locations');
        }

        const startCoords = [parseFloat(startData[0].lat), parseFloat(startData[0].lon)];
        const endCoords = [parseFloat(endData[0].lat), parseFloat(endData[0].lon)];

        setCoordinates({
          start: startCoords,
          end: endCoords,
          center: [
            (startCoords[0] + endCoords[0]) / 2,
            (startCoords[1] + endCoords[1]) / 2
          ]
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (trip.startLocation && trip.endLocation) {
      fetchCoordinates();
    }
  }, [trip]);

  const openInExternalMap = (provider = 'google') => {
    const { start, end } = coordinates;
    
    let url;
    switch (provider) {
      case 'google':
        url = `https://www.google.com/maps/dir/${start[0]},${start[1]}/${end[0]},${end[1]}`;
        break;
      case 'apple':
        url = `http://maps.apple.com/?saddr=${start[0]},${start[1]}&daddr=${end[0]},${end[1]}`;
        break;
      case 'openstreetmap':
        url = `https://www.openstreetmap.org/directions?from=${start[0]},${start[1]}&to=${end[0]},${end[1]}`;
        break;
      default:
        url = `https://www.google.com/maps/dir/${start[0]},${start[1]}/${end[0]},${end[1]}`;
    }
    
    window.open(url, '_blank');
  };

  const getMapUrl = () => {
    if (!coordinates) return null;
    
    const { start, end } = coordinates;
    const startStr = `${start[0]},${start[1]}`;
    const endStr = `${end[0]},${end[1]}`;
    
    // Calculate bounding box with some padding
    const minLat = Math.min(start[0], end[0]) - 0.05;
    const maxLat = Math.max(start[0], end[0]) + 0.05;
    const minLon = Math.min(start[1], end[1]) - 0.05;
    const maxLon = Math.max(start[1], end[1]) + 0.05;
    
    // Use OpenStreetMap with route visualization
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${startStr}&marker=${endStr}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading map: {error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!coordinates) {
    return null;
  }

  const mapUrl = getMapUrl();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Trip Route: {trip.startLocation} → {trip.endLocation}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {mapUrl ? (
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight="0"
              marginWidth="0"
              title="Trip Route Map"
              className="rounded-b-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-b-lg">
              <p className="text-gray-500">Map not available</p>
            </div>
          )}
        </div>

        {/* Footer with external map buttons */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => openInExternalMap('google')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              🗺️ Open in Google Maps
            </button>
            <button
              onClick={() => openInExternalMap('apple')}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium"
            >
              🍎 Open in Apple Maps
            </button>
            <button
              onClick={() => openInExternalMap('openstreetmap')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
            >
              🌍 Open in OpenStreetMap
            </button>
          </div>
          {trip.calculatedDistance && (
            <p className="text-center mt-2 text-sm text-gray-600">
              Distance: <span className="font-semibold text-green-600">{trip.calculatedDistance} km</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripMap; 