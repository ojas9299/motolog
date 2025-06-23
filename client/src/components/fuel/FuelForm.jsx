import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react"; // ✅ Get userId from Clerk

const FuelForm = ({ vehicleId, onLogSaved, initialOdo = "", initialFuel = "", editLogId, onCancel }) => {
  const { user } = useUser(); // ✅ Access Clerk user object

  const [odoReading, setOdoReading] = useState(initialOdo);
  const [fuelLitres, setFuelLitres] = useState(initialFuel);
  const [error, setError] = useState(null);

  useEffect(() => {
    setOdoReading(initialOdo);
    setFuelLitres(initialFuel);
  }, [initialOdo, initialFuel, editLogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editLogId) {
        // Update existing log
        await axios.put(`/api/fuel/log/${editLogId}`, {
          odoReading: Number(odoReading),
          fuelLitres: Number(fuelLitres),
        });
      } else {
        // Create new log
        await axios.post("/api/fuel", {
          userId: user?.id, // ✅ Manually pass userId
          vehicleId,
          odoReading: Number(odoReading),
          fuelLitres: Number(fuelLitres),
        });
      }

      setOdoReading("");
      setFuelLitres("");
      setError(null);
      onLogSaved(); // callback
    } catch (err) {
      console.error("Failed to save fuel log:", err);
      setError("Could not save fuel log. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="font-bold mb-2">{editLogId ? "Edit Fuel Log" : "Add Fuel Log"}</h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <input
        type="number"
        placeholder="Odometer Reading"
        value={odoReading}
        onChange={(e) => setOdoReading(e.target.value)}
        className="border p-2 mr-2"
        required
      />

      <input
        type="number"
        placeholder="Fuel Litres"
        value={fuelLitres}
        onChange={(e) => setFuelLitres(e.target.value)}
        className="border p-2 mr-2"
        required
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 mr-2">
        {editLogId ? "Update Log" : "Save Log"}
      </button>

      {onCancel && (
        <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2">
          Cancel
        </button>
      )}
    </form>
  );
};

export default FuelForm;
