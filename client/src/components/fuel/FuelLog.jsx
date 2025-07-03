import { useEffect, useState } from "react";
import axios from "axios";
import FuelLogList from "./FuelLogList";
import FuelForm from "./FuelForm";

const FuelLog = ({ vehicleId, userId, refreshKey }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLog, setEditingLog] = useState(null);
  const [localRefresh, setLocalRefresh] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://16.171.137.112:5000/api/fuel/${vehicleId}?userId=${userId}`);
      setLogs(res.data);
    } catch (err) {
      console.error("❌ Error fetching logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleId && userId) fetchLogs();
     
  }, [vehicleId, userId, refreshKey, localRefresh]);

  const handleDelete = async (log) => {
    if (!window.confirm("Delete this fuel log?")) return;
    try {
      await axios.delete(`http://16.171.137.112:5000/api/fuel/log/${log._id}`);
      setLocalRefresh((r) => r + 1);
    } catch (err) {
      alert("Failed to delete log");
    }
  };

  const handleEdit = (log) => {
    setEditingLog(log);
  };

  const handleEditSaved = async () => {
    setEditingLog(null);
    setLocalRefresh((r) => r + 1);
  };

  if (loading) return <p className="p-4">Loading fuel logs...</p>;

  return (
    <div className="p-4">
      {editingLog ? (
        <div className="mb-4">
          <FuelForm
            vehicleId={vehicleId}
            onLogSaved={handleEditSaved}
            // Pass initial values for edit
            initialOdo={editingLog.odoReading}
            initialFuel={editingLog.fuelLitres}
            editLogId={editingLog._id}
            onCancel={() => setEditingLog(null)}
          />
        </div>
      ) : null}
      <FuelLogList logs={logs} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default FuelLog;
