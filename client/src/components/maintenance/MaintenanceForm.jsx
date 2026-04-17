import { useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { Form, ShadcnFormField } from "../ui/Form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const MaintenanceForm = ({ vehicleId, onLogSaved, onCancel }) => {
  const { user } = useUser();

  const [serviceType, setServiceType] = useState("service");
  const [cost, setCost] = useState("");
  const [odoReading, setOdoReading] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await axios.post(`https://api.motolog.online/api/maintenance`, {
        userId: user?.id,
        vehicleId,
        serviceType,
        cost: Number(cost),
        odoReading: Number(odoReading),
        date: new Date(date),
        description,
      });
      setCost("");
      setOdoReading("");
      setDescription("");
      setError(null);
      onLogSaved();
    } catch (err) {
      console.error("Failed to save maintenance log:", err);
      setError("Could not save maintenance log. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4 px-2 sm:px-0 dark:text-white">
      <h2 className="font-bold mb-2">Log Maintenance</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" style={{color:'#000'}}>Service Type</label>
        <select
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isSubmitting}
          style={{color: '#000'}}
        >
          <option value="service" style={{color: '#000'}}>General Service</option>
          <option value="oil" style={{color: '#000'}}>Oil Change</option>
          <option value="tire" style={{color: '#000'}}>Tire Replacement</option>
          <option value="repair" style={{color: '#000'}}>Repair</option>
          <option value="other" style={{color: '#000'}}>Other</option>
        </select>
      </div>

      <ShadcnFormField label="Cost" labelStyle={{color:'#000'}}>
        <Input
          type="number"
          placeholder="Amount"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </ShadcnFormField>

      <ShadcnFormField label="Odometer Reading" labelStyle={{color:'#000'}}>
        <Input
          type="number"
          placeholder="Odometer at Service"
          value={odoReading}
          onChange={(e) => setOdoReading(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </ShadcnFormField>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" style={{color:'#000'}}>Date</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <ShadcnFormField label="Description (Optional)" labelStyle={{color:'#000'}}>
        <Input
          type="text"
          placeholder="e.g. Changed brake pads"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </ShadcnFormField>

      <div className="flex gap-2 mt-4">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary" disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Maintenance"}
        </Button>
      </div>
    </Form>
  );
};
export default MaintenanceForm;
