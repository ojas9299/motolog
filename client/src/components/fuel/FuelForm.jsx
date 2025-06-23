import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react"; // ✅ Get userId from Clerk

const FuelForm = ({ vehicleId, onLogSaved }) => {
  const { user } = useUser(); // ✅ Access Clerk user object

  const [odoReading, setOdoReading] = useState("");
  const [fuelLitres, setFuelLitres] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/fuel", {
        userId: user?.id, // ✅ Manually pass userId
        vehicleId,
        odoReading: Number(odoReading),
        fuelLitres: Number(fuelLitres),
      });

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
      <h2 className="font-bold mb-2">Add Fuel Log</h2>

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

      <button type="submit" className="bg-blue-600 text-white px-4 py-2">
        Save Log
      </button>
    </form>
  );
};

export default FuelForm;
