const API_BASE_URL = 'https://api.motolog.online/api';

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise} API response
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Trip API methods
export const tripAPI = {
  /**
   * Get all trips for a user
   * @param {string} userId - User ID
   * @returns {Promise} Trips data
   */
  getTrips: (userId) => apiRequest(`/trip?userId=${userId}`),

  /**
   * Get a single trip by ID
   * @param {string} tripId - Trip ID
   * @returns {Promise} Trip data
   */
  getTrip: (tripId) => apiRequest(`/trip/${tripId}`),

  /**
   * Create a new trip
   * @param {Object} tripData - Trip data
   * @returns {Promise} Created trip
   */
  createTrip: (tripData) => apiRequest('/trip', {
    method: 'POST',
    body: JSON.stringify(tripData),
  }),

  /**
   * Update a trip
   * @param {string} tripId - Trip ID
   * @param {Object} tripData - Updated trip data
   * @returns {Promise} Updated trip
   */
  updateTrip: (tripId, tripData) => apiRequest(`/trip/${tripId}`, {
    method: 'PUT',
    body: JSON.stringify(tripData),
  }),

  /**
   * Delete a trip
   * @param {string} tripId - Trip ID
   * @returns {Promise} Deletion result
   */
  deleteTrip: (tripId) => apiRequest(`/trip/${tripId}`, {
    method: 'DELETE',
  }),

  /**
   * Test geocoding
   * @param {string} startLocation - Start location
   * @param {string} endLocation - End location
   * @returns {Promise} Geocoding test result
   */
  testGeocoding: (startLocation, endLocation) => 
    apiRequest(`/trip/test/geocode?startLocation=${encodeURIComponent(startLocation)}&endLocation=${encodeURIComponent(endLocation)}`),
};

// Vehicle API methods
export const vehicleAPI = {
  /**
   * Get all vehicles for a user
   * @param {string} userId - User ID
   * @returns {Promise} Vehicles data
   */
  getVehicles: (userId) => apiRequest(`/vehicle?userId=${userId}`),

  /**
   * Get a single vehicle by ID
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise} Vehicle data
   */
  getVehicle: (vehicleId) => apiRequest(`/vehicle/${vehicleId}`),

  /**
   * Create a new vehicle
   * @param {Object} vehicleData - Vehicle data
   * @returns {Promise} Created vehicle
   */
  createVehicle: (vehicleData) => apiRequest('/vehicle', {
    method: 'POST',
    body: JSON.stringify(vehicleData),
  }),

  /**
   * Update a vehicle
   * @param {string} vehicleId - Vehicle ID
   * @param {Object} vehicleData - Updated vehicle data
   * @returns {Promise} Updated vehicle
   */
  updateVehicle: (vehicleId, vehicleData) => apiRequest(`/vehicle/${vehicleId}`, {
    method: 'PUT',
    body: JSON.stringify(vehicleData),
  }),

  /**
   * Delete a vehicle
   * @param {string} vehicleId - Vehicle ID
   * @returns {Promise} Deletion result
   */
  deleteVehicle: (vehicleId) => apiRequest(`/vehicle/${vehicleId}`, {
    method: 'DELETE',
  }),
};

// Auth API methods
export const authAPI = {
  /**
   * Get user profile
   * @returns {Promise} User profile data
   */
  getProfile: () => apiRequest('/auth/profile'),

  /**
   * Update user profile
   * @param {Object} profileData - Profile data
   * @returns {Promise} Updated profile
   */
  updateProfile: (profileData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
};

// Rideboard API methods
export const rideboardAPI = {
  /**
   * Toggle like for a public trip
   * @param {string} tripId - Trip ID
   * @param {string} userId - User ID
   * @returns {Promise} Like result
   */
  toggleLike: (tripId, userId) => apiRequest(`/rideboard/${tripId}/like`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }),
  /**
   * Toggle save for a public trip
   */
  toggleSave: (tripId, userId) => apiRequest(`/rideboard/${tripId}/save`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }),
  /**
   * Toggle join for a public trip
   */
  toggleJoin: (tripId, userId) => apiRequest(`/rideboard/${tripId}/join`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }),
  /**
   * Add a comment to a public trip
   */
  addComment: (tripId, userId, text, displayName) => apiRequest(`/rideboard/${tripId}/comment`, {
    method: 'POST',
    body: JSON.stringify({ userId, displayName, text }),
  }),
  /**
   * Get all public (Rideboard) trips, paginated
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Number of trips per page
   * @returns {Promise} Public trips data
   */
  getPublicTrips: (page = 1, limit = 10) => apiRequest(`/rideboard?page=${page}&limit=${limit}`),
  /**
   * Delete a comment from a public trip
   */
  deleteComment: (tripId, commentId, userId) => apiRequest(`/rideboard/${tripId}/comment/${commentId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  }),
};

export default {
  trip: tripAPI,
  vehicle: vehicleAPI,
  auth: authAPI,
  rideboard: rideboardAPI,
}; 