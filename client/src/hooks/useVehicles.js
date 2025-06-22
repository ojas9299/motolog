import { useState, useEffect, useCallback } from "react";
import { vehicleAPI } from "../services/api";

/**
 * Custom hook for managing vehicles
 * @param {string} userId - User ID
 * @returns {Object} Vehicles state and operations
 */
export const useVehicles = (userId) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch vehicles
  const fetchVehicles = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await vehicleAPI.getVehicles(userId);
      setVehicles(data.vehicles || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Create vehicle
  const createVehicle = useCallback(async (vehicleData) => {
    setLoading(true);
    setError(null);

    try {
      const newVehicle = await vehicleAPI.createVehicle(vehicleData);
      setVehicles((prev) => [newVehicle, ...prev]);
      return { success: true, data: newVehicle };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update vehicle
  const updateVehicle = useCallback(async (vehicleId, vehicleData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedVehicle = await vehicleAPI.updateVehicle(
        vehicleId,
        vehicleData
      );
      setVehicles((prev) =>
        prev.map((vehicle) =>
          vehicle._id === vehicleId ? updatedVehicle : vehicle
        )
      );
      return { success: true, data: updatedVehicle };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete vehicle
  const deleteVehicle = useCallback(async (vehicleId) => {
    setLoading(true);
    setError(null);

    try {
      await vehicleAPI.deleteVehicle(vehicleId);
      setVehicles((prev) =>
        prev.filter((vehicle) => vehicle._id !== vehicleId)
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Load vehicles on mount and when userId changes
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
};
