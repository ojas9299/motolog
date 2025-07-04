import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";

export const useFuel = (vehicleId) => {
  const { user } = useUser();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.motolog.online/api/fuel/${vehicleId}`, {
          params: { userId: user?.id }, // 🔥 Manually pass userId here
        });
        setLogs(res.data);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching logs:", err);
        setError("Failed to load fuel logs");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && vehicleId) {
      fetchLogs();
    }
  }, [user?.id, vehicleId]);

  return { logs, loading, error };
};
