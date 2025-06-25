import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../ui/Spinner";
import FuelLogList from "../fuel/FuelLogList";
import { useUser } from "@clerk/clerk-react";
import { Bar, Line } from "react-chartjs-2";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import ReactECharts from "echarts-for-react";

const API_NINJAS_KEY = "8s0Wvvk7bRewkDb4/sKLhA==qVEIlg8bkbJD5NgW";

const fetchVehicleSpecs = async (brand, model) => {
  try {
    const res = await axios.get("https://api.api-ninjas.com/v1/motorcycles", {
      params: { make: brand, model },
      headers: { "X-Api-Key": API_NINJAS_KEY },
    });
    if (Array.isArray(res.data) && res.data.length > 0) {
      return { verified: true, specs: res.data[0] };
    } else {
      return { verified: false, specs: null };
    }
  } catch (err) {
    return { verified: false, specs: null };
  }
};

const fetchVehicleSpecsMemo = (() => {
  const cache = {};
  return async (brand, model) => {
    const key = `${brand.toLowerCase()}|${model.toLowerCase()}`;
    if (cache[key]) return cache[key];
    const result = await fetchVehicleSpecs(brand, model);
    cache[key] = result;
    return result;
  };
})();

const VehicleDetail = () => {
  const { vehicleId } = useParams();
  const { user } = useUser();
  const [vehicle, setVehicle] = useState(null);
  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [specs, setSpecs] = useState(null);
  const [verified, setVerified] = useState(null);
  const [specsLoading, setSpecsLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [fuelLoading, setFuelLoading] = useState(true);
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  // Fetch vehicle from backend
  useEffect(() => {
    const fetchVehicle = async () => {
      setVehicleLoading(true);
      try {
        const res = await axios.get(`/api/vehicle/${vehicleId}`);
        setVehicle(res.data);
      } catch (err) {
        setVehicle(null);
      } finally {
        setVehicleLoading(false);
      }
    };
    if (vehicleId) fetchVehicle();
  }, [vehicleId]);

  // Fetch specs from API Ninjas
  useEffect(() => {
    const fetchSpecs = async () => {
      setSpecsLoading(true);
      if (vehicle && vehicle.brand && vehicle.model) {
        if (vehicle.verified) {
          setVerified(true);
          // Always show specs, even if already verified
          let specsResult = await fetchVehicleSpecsMemo(vehicle.brand, vehicle.model);
          setSpecs(specsResult.specs);
        } else {
          const { verified: isVerified, specs } = await fetchVehicleSpecsMemo(vehicle.brand, vehicle.model);
          setSpecs(specs);
          setVerified(isVerified);
          // If verified, update backend
          if (isVerified) {
            await axios.put(`/api/vehicle/${vehicle._id}`, { ...vehicle, verified: true });
          }
        }
      }
      setSpecsLoading(false);
    };
    fetchSpecs();
  }, [vehicle]);

  // Fetch trips for this vehicle
  useEffect(() => {
    if (!user?.id || !vehicleId) return;
    const fetchTrips = async () => {
      setTripsLoading(true);
      try {
        const res = await axios.get(`/api/trip?userId=${user.id}&vehicleId=${vehicleId}`);
        setTrips(res.data.trips || []);
      } catch (err) {
        setTrips([]);
      } finally {
        setTripsLoading(false);
      }
    };
    fetchTrips();
  }, [user, vehicleId]);

  // Fetch fuel logs for this vehicle
  useEffect(() => {
    const fetchFuelLogs = async () => {
      setFuelLoading(true);
      try {
        const res = await axios.get(`/api/fuel/${vehicleId}?userId=${user?.id}`);
        setFuelLogs(res.data);
      } catch (err) {
        setFuelLogs([]);
      } finally {
        setFuelLoading(false);
      }
    };
    if (user?.id && vehicleId) fetchFuelLogs();
  }, [user, vehicleId]);

  // Prepare data for charts for this vehicle
  const fuelUpDates = fuelLogs.map(log => log.date || log.createdAt);
  const fuelAmounts = fuelLogs.map(log => log.fuelLitres || log.fuel || 0);
  const odometerReadings = fuelLogs.map(log => log.odoReading || log.odometer || 0);
  const mileage = fuelLogs.map(log => log.mileage || (log.odoReading && log.fuelLitres ? (log.odoReading / log.fuelLitres).toFixed(2) : null));

  // Chart.js Bar: Fuel-ups over time
  const fuelBarData = {
    labels: fuelUpDates,
    datasets: [
      {
        label: "Fuel-ups (Litres)",
        data: fuelAmounts,
        backgroundColor: "#6366f1",
      },
    ],
  };

  // Chart.js Line: Odometer over time
  const odoLineData = {
    labels: fuelUpDates,
    datasets: [
      {
        label: "Odometer Reading",
        data: odometerReadings,
        borderColor: "#10b981",
        backgroundColor: "rgba(16,185,129,0.2)",
        fill: true,
      },
    ],
  };

  // Recharts Area: Mileage trend
  const mileageAreaData = fuelLogs.map((log, i) => ({
    date: fuelUpDates[i],
    mileage: Number(mileage[i]) || 0,
  }));

  if (vehicleLoading) return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  if (!vehicle) return <div className="p-8 text-center text-red-600">Vehicle not found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {vehicle.imageUrl && (
          <img src={vehicle.imageUrl} alt="Vehicle" className="w-full md:w-64 h-48 object-cover rounded-xl border" />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-indigo-700">{vehicle.brand} {vehicle.model}</h1>
            {verified === true && <span title="Verified" className="text-green-600 text-2xl">✅</span>}
            {verified === false && <span title="Not Verified" className="text-red-600 text-2xl">⚠️</span>}
          </div>
          <div className="text-gray-700 mb-2">{vehicle.type} | {vehicle.year} | {vehicle.color}</div>
          <div className="mb-2"><span className="font-medium">Registration:</span> {vehicle.registrationNumber}</div>
          <div className="mb-2"><span className="font-medium">Owner:</span> {vehicle.owner}</div>
          <div className="mb-2"><span className="font-medium">Kilometers:</span> {vehicle.kilometersDriven?.toLocaleString() || "0"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Verified Specs {specsLoading && <Spinner size="sm" />}</h2>
          {specs ? (
            <div>
              <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 overflow-x-auto pb-2">
                {Object.entries(specs)
                  .filter(([key, value]) => value !== null && value !== undefined && value !== "")
                  .slice(0, showAllSpecs ? undefined : 6)
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col min-w-[160px] mb-1 border-r pr-4 last:border-r-0">
                      <span className="font-medium capitalize text-gray-600">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-gray-800 break-words">{value}</span>
                    </div>
                  ))}
              </div>
              {Object.entries(specs).filter(([key, value]) => value !== null && value !== undefined && value !== "").length > 6 && (
                <button
                  className="mt-3 px-4 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
                  onClick={() => setShowAllSpecs((v) => !v)}
                >
                  {showAllSpecs ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          ) : (
            <div className="text-gray-500">No specs found.</div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Owner-entered Details</h2>
          <div className="space-y-2">
            <div><span className="font-medium">Type:</span> {vehicle.type}</div>
            <div><span className="font-medium">Year:</span> {vehicle.year}</div>
            <div><span className="font-medium">Registration:</span> {vehicle.registrationNumber}</div>
            <div><span className="font-medium">Kilometers:</span> {vehicle.kilometersDriven?.toLocaleString() || "0"}</div>
            <div><span className="font-medium">Color:</span> {vehicle.color}</div>
            <div><span className="font-medium">Owner:</span> {vehicle.owner}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Trips</h2>
        {tripsLoading ? (
          <Spinner size="sm" />
        ) : trips.length === 0 ? (
          <div className="text-gray-500">No trips found for this vehicle.</div>
        ) : (
          <ul className="divide-y">
            {trips.map((trip) => (
              <li key={trip._id} className="py-2">
                <div className="font-medium">{trip.startLocation} → {trip.endLocation}</div>
                <div className="text-sm text-gray-600">{new Date(trip.startTime).toLocaleString()} - {new Date(trip.endTime).toLocaleString()}</div>
                <div className="text-sm">Distance: {trip.calculatedDistance ? `${trip.calculatedDistance} km` : "N/A"}</div>
                {trip.description && <div className="text-sm text-gray-700">{trip.description}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Fuel Logs</h2>
        {fuelLoading ? (
          <Spinner size="sm" />
        ) : fuelLogs.length === 0 ? (
          <div className="text-gray-500">No fuel logs found for this vehicle.</div>
        ) : (
          <FuelLogList logs={fuelLogs} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Fuel-ups Over Time</h2>
          <Bar data={fuelBarData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Odometer Readings Over Time</h2>
          <Line data={odoLineData} options={{ responsive: true }} />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Mileage Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mileageAreaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMileage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="mileage" stroke="#6366f1" fillOpacity={1} fill="url(#colorMileage)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail; 