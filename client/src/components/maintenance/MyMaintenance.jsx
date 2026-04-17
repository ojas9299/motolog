import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Wrench, Plus, Eye, EyeOff } from 'lucide-react';
import { useVehicles } from "../../hooks/useVehicles";
import { Button } from "../ui/Button";
import Spinner from "../ui/Spinner";

import MaintenanceForm from "./MaintenanceForm";
import MaintenanceLog from "./MaintenanceLog";

const MyMaintenance = ({ activeTab }) => {
  const { user } = useUser();
  const { vehicles, loading, error } = useVehicles(user?.id);
  
  const [showFormFor, setShowFormFor] = useState(null);
  const [showLogsFor, setShowLogsFor] = useState(null);
  const [refreshKeys, setRefreshKeys] = useState({});

  const handleLogSaved = (vehicleId) => {
    setRefreshKeys((prev) => ({
      ...prev,
      [vehicleId]: (prev[vehicleId] || 0) + 1,
    }));
    setShowFormFor(null);
    setShowLogsFor(vehicleId);
  };

  if (activeTab !== "maintenance" && activeTab !== "wallet") return null;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6">Maintenance Wallet</h2>
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Service History & Spend</h2>
      
      {loading ? (
        <div className="flex justify-center p-8"><Spinner /></div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="border p-4 rounded-lg shadow-md bg-white">
              <h3 className="text-lg font-bold mb-1">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Reg: {vehicle.registrationNumber}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {showFormFor !== vehicle._id ? (
                  <Button
                    onClick={() => setShowFormFor(vehicle._id)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1"
                  >
                    <Plus size={16} /> Log Maintenance
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowFormFor(null)}
                    className="flex items-center gap-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1"
                  >
                    Cancel Edit
                  </Button>
                )}

                <Button
                  onClick={() => setShowLogsFor(showLogsFor === vehicle._id ? null : vehicle._id)}
                  className={`flex items-center gap-1 ${
                    showLogsFor === vehicle._id ? "bg-indigo-400 hover:bg-indigo-500" : "bg-indigo-600 hover:bg-indigo-700"
                  } text-white px-3 py-1`}
                >
                  {showLogsFor === vehicle._id ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showLogsFor === vehicle._id ? "Hide Logs" : "View Wallet"}
                </Button>
              </div>

              {showFormFor === vehicle._id && (
                <div className="mt-4 border-t pt-4">
                  <MaintenanceForm
                    vehicleId={vehicle._id}
                    onLogSaved={() => handleLogSaved(vehicle._id)}
                    onCancel={() => setShowFormFor(null)}
                  />
                </div>
              )}

              {showLogsFor === vehicle._id && (
                <div className="mt-4 border-t pt-4">
                  <MaintenanceLog
                    vehicleId={vehicle._id}
                    userId={user.id}
                    refreshKey={refreshKeys[vehicle._id] || 0}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default MyMaintenance;
