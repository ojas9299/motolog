import { useState, useEffect, useCallback } from 'react';
import { tripAPI } from '../services/api';

/**
 * Custom hook for managing trips
 * @param {string} userId - User ID
 * @returns {Object} Trips state and operations
 */
export const useTrips = (userId) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch trips
  const fetchTrips = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await tripAPI.getTrips(userId);
      setTrips(response.data.trips || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Create trip
  const createTrip = useCallback(async (tripData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await tripAPI.createTrip(tripData);
      setTrips(prev => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update trip
  const updateTrip = useCallback(async (tripId, tripData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await tripAPI.updateTrip(tripId, tripData);
      setTrips(prev => prev.map(trip => 
        trip._id === tripId ? response.data : trip
      ));
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete trip
  const deleteTrip = useCallback(async (tripId) => {
    setLoading(true);
    setError(null);

    try {
      await tripAPI.deleteTrip(tripId);
      setTrips(prev => prev.filter(trip => trip._id !== tripId));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Test geocoding
  const testGeocoding = useCallback(async (startLocation, endLocation) => {
    try {
      const response = await tripAPI.testGeocoding(startLocation, endLocation);
      return { success: true, data: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Load trips on mount and when userId changes
  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return {
    trips,
    loading,
    error,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    testGeocoding,
  };
}; 