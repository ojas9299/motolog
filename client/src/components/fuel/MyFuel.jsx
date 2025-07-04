import React from "react";
import { useUser } from "@clerk/clerk-react";
import FuelForm from "./FuelForm";
import FuelLog from "./FuelLog";
import { useVehicles } from "../../hooks/useVehicles";
import { Fuel as FuelIcon, ListPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';

const MyFuel = ({ activeTab }) => {
  const { user } = useUser();
  const { vehicles, loading, error } = useVehicles(user?.id);
  const [showFormFor, setShowFormFor] = React.useState(null);
  const [showLogsFor, setShowLogsFor] = React.useState(null);
  const [refreshKeys, setRefreshKeys] = React.useState({});

  const handleLogSaved = (vehicleId) => {
    setRefreshKeys((prev) => ({
      ...prev,
      [vehicleId]: (prev[vehicleId] || 0) + 1,
    }));
    setShowLogsFor(vehicleId);
  };

  if (activeTab !== "fuel") return null;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">My Fuel Logs</h2>
      <h2 className="text-xl font-semibold mb-4">Fuel Tracker</h2>
      {loading ? (
        <p>Loading vehicles...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="border p-4 rounded-lg shadow-md bg-white"
            >
              <h3 className="text-lg font-bold mb-1">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Registration: {vehicle.registrationNumber}
              </p>
              <div className="flex gap-4 mb-2">
                {showFormFor !== vehicle._id && (
                  <Button
                    onClick={() => setShowFormFor(vehicle._id)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                  >
                    <FuelIcon size={16} /> Log Fuel
                  </Button>
                )}
                {showFormFor === vehicle._id && (
                  <Button
                    onClick={() => setShowFormFor(null)}
                    className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1"
                  >
                    <ListPlus size={16} /> Hide Form
                  </Button>
                )}
                <Button
                  onClick={() => setShowLogsFor(showLogsFor === vehicle._id ? null : vehicle._id)}
                  className={`flex items-center gap-1 ${showLogsFor === vehicle._id ? 'bg-blue-400 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-1`}
                >
                  {showLogsFor === vehicle._id ? <EyeOff size={16} /> : <Eye size={16} />} {showLogsFor === vehicle._id ? 'Hide Logs' : 'View Logs'}
                </Button>
              </div>
              {showFormFor === vehicle._id && (
                <div className="mt-2">
                  <FuelForm
                    vehicleId={vehicle._id}
                    onLogSaved={() => handleLogSaved(vehicle._id)}
                  />
                </div>
              )}
              {showLogsFor === vehicle._id && (
                <div className="mt-2 border-t pt-2">
                  <FuelLog vehicleId={vehicle._id} userId={user.id} refreshKey={refreshKeys[vehicle._id] || 0} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFuel;
