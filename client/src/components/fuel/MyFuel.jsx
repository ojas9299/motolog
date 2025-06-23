import React from "react";
import { useUser } from "@clerk/clerk-react";
import FuelForm from "./FuelForm";
import FuelLog from "./FuelLog";
import { useVehicles } from "../../hooks/useVehicles";

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
                <button
                  onClick={() =>
                    setShowFormFor(
                      showFormFor === vehicle._id ? null : vehicle._id
                    )
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  {showFormFor === vehicle._id ? "Hide Form" : "Log Fuel"}
                </button>
                <button
                  onClick={() =>
                    setShowLogsFor(
                      showLogsFor === vehicle._id ? null : vehicle._id
                    )
                  }
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  {showLogsFor === vehicle._id ? "Hide Logs" : "View Logs"}
                </button>
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
