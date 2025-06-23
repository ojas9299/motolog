import { useEffect, useState } from "react";
import axios from "axios";
import FuelLogList from "./FuelLogList";

const FuelLog = ({ vehicleId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`/api/fuel/${vehicleId}?userId=user123`);
        setLogs(res.data);
      } catch (err) {
        console.error("❌ Error fetching logs", err);
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) fetchLogs();
  }, [vehicleId]);

  if (loading) return <p className="p-4">Loading fuel logs...</p>;

  return (
    <div className="p-4">
      <FuelLogList logs={logs} />
    </div>
  );
};

export default FuelLog;
