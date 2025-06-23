import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import FuelForm from "./FuelForm";
import FuelLog from "./FuelLog";

const MyFuel = ({ activeTab }) => {
  const { user } = useUser();
  const [vehicles, setVehicles] = useState([]);
  const [showFormFor, setShowFormFor] = useState(null);
  const [showLogsFor, setShowLogsFor] = useState(null);

  // ✅ HOOKS should be at top-level — no condition
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`/api/vehicles?userId=${user.id}`);
        setVehicles(res.data);
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
      }
    };

    if (user?.id) fetchVehicles();
  }, [user]);

  // ✅ Conditional rendering should come after hooks
  if (activeTab !== "fuel") return null;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Fuel Tracker</h2>
      {vehicles.length === 0 ? (
        <p>No vehicles found.</p>
      ) : (
        vehicles.map((vehicle) => (
          <div
            key={vehicle._id}
            className="border p-4 rounded-lg mb-4 shadow-md"
          >
            <h3 className="text-lg font-bold">{vehicle.name}</h3>
            <p className="text-sm text-gray-600">ID: {vehicle._id}</p>
            <div className="mt-2 flex gap-4">
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
              <div className="mt-4">
                <FuelForm
                  vehicleId={vehicle._id}
                  onLogSaved={() => {
                    setShowLogsFor(vehicle._id);
                  }}
                />
              </div>
            )}

            {showLogsFor === vehicle._id && (
              <div className="mt-4 border-t pt-4">
                <FuelLog vehicleId={vehicle._id} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyFuel;
