import { useState } from "react";
import axios from "axios";

const FuelForm = ({ vehicleId, onLogSaved }) => {
  const [odoReading, setOdoReading] = useState("");
  const [fuelLitres, setFuelLitres] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/fuel", {
      vehicleId,
      odoReading: Number(odoReading),
      fuelLitres: Number(fuelLitres),
    });
    setOdoReading("");
    setFuelLitres("");
    onLogSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <h2 className="font-bold mb-2">Add Fuel Log</h2>
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
