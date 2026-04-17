import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../ui/Spinner";

const MaintenanceLog = ({ vehicleId, userId, refreshKey }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.motolog.online/api/maintenance/${vehicleId}?userId=${userId}`);
        setLogs(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch maintenance logs");
      } finally {
        setLoading(false);
      }
    };
    if (vehicleId && userId) fetchLogs();
  }, [vehicleId, userId, refreshKey]);

  if (loading) return <div className="flex justify-center p-4"><Spinner /></div>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (logs.length === 0) return <p className="text-gray-500 mt-2">No maintenance logs found.</p>;

  const totalCost = logs.reduce((sum, log) => sum + log.cost, 0);

  return (
    <div className="mt-4">
      <div className="bg-indigo-50 border border-indigo-200 rounded-md p-3 mb-4 flex justify-between items-center text-black">
         <span className="font-semibold text-indigo-800">Total Spend</span>
         <span className="font-bold text-xl text-indigo-600">${totalCost.toLocaleString()}</span>
      </div>

      <ul className="space-y-3 dark:text-white">
        {logs.map((log) => (
          <li key={log._id} className="border p-3 rounded bg-gray-50 dark:bg-gray-800 shadow-sm flex flex-col gap-1">
            <div className="flex justify-between items-center font-bold text-gray-800 dark:text-gray-100">
               <span className="capitalize">{log.serviceType}</span>
               <span className="text-indigo-600 dark:text-indigo-400">${log.cost}</span>
            </div>
            <div className="text-sm text-gray-500 flex justify-between">
              <span>Date: {new Date(log.date).toLocaleDateString()}</span>
              <span>Odo: {log.odoReading} km</span>
            </div>
            {log.description && (
              <p className="text-sm mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-200">
                {log.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default MaintenanceLog;
