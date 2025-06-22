const { GEOCODING_USER_AGENT } = require('../config/constants');

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Get coordinates from location string using Nominatim API
 * @param {string} location - Location string to geocode
 * @returns {Promise<{lat: number, lon: number}>} Coordinates object
 */
const getCoordinates = async (location) => {
  try {
    const encodedLocation = encodeURIComponent(location);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedLocation}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': GEOCODING_USER_AGENT
      }
    });
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    } else {
      console.warn(`No coordinates found for location: ${location}`);
      return { lat: 0, lon: 0 };
    }
  } catch (error) {
    console.error(`Error geocoding location "${location}":`, error.message);
    return { lat: 0, lon: 0 };
  }
};

/**
 * Calculate distance between two locations
 * @param {string} startLocation - Start location string
 * @param {string} endLocation - End location string
 * @returns {Promise<number|null>} Distance in kilometers or null if calculation fails
 */
const calculateTripDistance = async (startLocation, endLocation) => {
  try {
    const startCoords = await getCoordinates(startLocation);
    const endCoords = await getCoordinates(endLocation);
    
    if (startCoords.lat !== 0 && endCoords.lat !== 0) {
      return calculateDistance(
        startCoords.lat, startCoords.lon, 
        endCoords.lat, endCoords.lon
      );
    } else {
      return null;
    }
  } catch (error) {
    console.warn("Could not calculate distance:", error.message);
    return null;
  }
};

module.exports = {
  calculateDistance,
  getCoordinates,
  calculateTripDistance
}; 