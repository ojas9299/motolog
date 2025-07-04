import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react"; // ✅ Get userId from Clerk
import { Form, ShadcnFormField } from "../ui/Form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const FuelForm = ({ vehicleId, onLogSaved, initialOdo = "", initialFuel = "", editLogId, onCancel }) => {
  const { user } = useUser(); // ✅ Access Clerk user object

  const [odoReading, setOdoReading] = useState(initialOdo);
  const [fuelLitres, setFuelLitres] = useState(initialFuel);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setOdoReading(initialOdo);
    setFuelLitres(initialFuel);
  }, [initialOdo, initialFuel, editLogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const owner = user?.fullName || user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress || "Unknown";
      if (editLogId) {
        // Update existing log
        await axios.put(`https://api.motolog.online/api/fuel/log/${editLogId}`, {
          odoReading: Number(odoReading),
          fuelLitres: Number(fuelLitres),
          owner,
        });
      } else {
        // Create new log
        await axios.post(`https://api.motolog.online/api/fuel`, {
          userId: user?.id,
          vehicleId,
          odoReading: Number(odoReading),
          fuelLitres: Number(fuelLitres),
          owner,
        });
      }
      setOdoReading("");
      setFuelLitres("");
      setError(null);
      onLogSaved(); // callback
    } catch (err) {
      console.error("Failed to save fuel log:", err);
      setError("Could not save fuel log. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4 px-2 sm:px-0 dark:text-white">
      <h2 className="font-bold mb-2">{editLogId ? "Edit Fuel Log" : "Add Fuel Log"}</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <ShadcnFormField label="Odometer Reading" labelStyle={{color:'#000'}}>
        <Input
          type="number"
          placeholder="Odometer Reading"
          value={odoReading}
          onChange={(e) => setOdoReading(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <ShadcnFormField label="Fuel Litres" labelStyle={{color:'#000'}}>
        <Input
          type="number"
          placeholder="Fuel Litres"
          value={fuelLitres}
          onChange={(e) => setFuelLitres(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      <div className="flex gap-2 mt-2">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary" disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (editLogId ? "Updating..." : "Saving...") : (editLogId ? "Update Log" : "Save Log")}
        </Button>
      </div>
      {isSubmitting && <span className="ml-2 text-blue-600">Submitting...</span>}
    </Form>
  );
};

export default FuelForm;
