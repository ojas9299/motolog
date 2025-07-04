import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../ui/Spinner";
import FuelLogList from "../fuel/FuelLogList";
import { useUser } from "@clerk/clerk-react";
import { Bar, Line } from "react-chartjs-2";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import ReactECharts from "echarts-for-react";
import { useVehicles } from "../../hooks/useVehicles";
import VehicleForm from "./VehicleForm";
import { Button } from "../ui/Button";
import { Edit, Trash2 } from 'lucide-react';
import ImageModal from "../ui/ImageModal";

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
  const navigate = useNavigate();
  const { updateVehicle, deleteVehicle } = useVehicles(user?.id);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIdx, setModalIdx] = useState(0);

  // Fetch vehicle from backend
  useEffect(() => {
    const fetchVehicle = async () => {
      setVehicleLoading(true);
      try {
        const res = await axios.get(`https://api.motolog.online/api/vehicle/${vehicleId}`);
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
            await axios.put(`https://api.motolog.online/api/vehicle/${vehicle._id}`, { ...vehicle, verified: true });
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
        const res = await axios.get(`https://api.motolog.online/api/trip?userId=${user.id}&vehicleId=${vehicleId}`);
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
        const res = await axios.get(`https://api.motolog.online/api/fuel/${vehicleId}?userId=${user?.id}`);
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

  const handleEdit = () => setEditing(true);
  const handleCancelEdit = () => setEditing(false);
  const handleUpdate = async (vehicleData) => {
    setError(null);
    const ownerName = user.fullName || user.firstName || user.username || "";
    const result = await updateVehicle(vehicle._id, {
      ...vehicleData,
      userId: user.id,
      owner: ownerName,
    });
    if (result.success) {
      setEditing(false);
      setVehicle(result.data);
    } else {
      setError(result.error || "Failed to update vehicle");
    }
  };
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    const result = await deleteVehicle(vehicle._id);
    if (result.success) {
      navigate("/vehicles");
    } else {
      setError(result.error || "Failed to delete vehicle");
    }
  };

  if (vehicleLoading) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>;
  if (!vehicle) return <div className="p-8 text-center text-red-600">Vehicle not found.</div>;

  if (editing) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Edit Vehicle</h2>
        <VehicleForm vehicle={vehicle} onSubmit={handleUpdate} onCancel={handleCancelEdit} error={error} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-[70%]">
          <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center justify-center min-h-[420px]">
            {(vehicle.vehicleImages && vehicle.vehicleImages.length > 0) ? (
              (() => {
                const imgs = vehicle.vehicleImages.slice(0, 3);
                if (imgs.length === 1) {
                  return (
                    <img
                      src={imgs[0]}
                      alt="Vehicle"
                      className="object-contain w-full h-[420px] rounded-xl bg-gray-50 cursor-pointer"
                      onClick={() => { setModalIdx(0); setModalOpen(true); }}
                    />
                  );
                } else if (imgs.length === 2) {
                  return (
                    <div className="flex gap-4 w-full h-[420px]">
                      <img
                        src={imgs[0]}
                        alt="Vehicle 1"
                        className="object-contain w-1/2 h-full rounded-xl bg-gray-50 cursor-pointer"
                        onClick={() => { setModalIdx(0); setModalOpen(true); }}
                      />
                      <img
                        src={imgs[1]}
                        alt="Vehicle 2"
                        className="object-contain w-1/2 h-full rounded-xl bg-gray-50 cursor-pointer"
                        onClick={() => { setModalIdx(1); setModalOpen(true); }}
                      />
                    </div>
                  );
                } else if (imgs.length === 3) {
                  return (
                    <div className="flex gap-4 w-full h-[420px]">
                      <img
                        src={imgs[0]}
                        alt="Vehicle 1"
                        className="object-contain w-1/2 h-full rounded-xl bg-gray-50 cursor-pointer"
                        onClick={() => { setModalIdx(0); setModalOpen(true); }}
                      />
                      <div className="flex flex-col gap-4 w-1/2 h-full">
                        <img
                          src={imgs[1]}
                          alt="Vehicle 2"
                          className="object-contain w-full h-1/2 rounded-xl bg-gray-50 cursor-pointer"
                          onClick={() => { setModalIdx(1); setModalOpen(true); }}
                        />
                        <img
                          src={imgs[2]}
                          alt="Vehicle 3"
                          className="object-contain w-full h-1/2 rounded-xl bg-gray-50 cursor-pointer"
                          onClick={() => { setModalIdx(2); setModalOpen(true); }}
                        />
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })()
            ) : vehicle.imageUrl ? (
              <img src={vehicle.imageUrl} alt="Vehicle" className="object-contain w-full h-[420px] rounded-xl bg-gray-50 cursor-pointer" onClick={() => { setModalIdx(0); setModalOpen(true); }} />
            ) : null}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-start">
          <div className="flex flex-col gap-2 mb-2 mt-16">
            <h1 className="text-5xl font-extrabold text-indigo-700 leading-tight">{vehicle.brand} {vehicle.model}</h1>
            <div className="flex gap-2 mt-2">
              <Button onClick={handleEdit} className="flex items-center gap-1" size="sm"><Edit size={18}/> Edit</Button>
              <Button onClick={handleDelete} className="flex items-center gap-1 bg-red-600 text-white hover:bg-red-700 font-semibold shadow-sm" size="sm"><Trash2 size={18}/> Delete</Button>
            </div>
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Verified Specs {specsLoading && <div className="flex justify-center items-center min-h-[60px]"><Spinner /></div>}</h2>
          {specs ? (
            <div>
              <div className={`flex flex-row flex-wrap gap-x-8 gap-y-2 overflow-x-auto pb-2 ${showAllSpecs ? 'max-h-56 overflow-y-auto' : ''}`}>
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
          <h2 className="text-xl font-bold mb-4">Vehicle Details</h2>
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
          <div className="flex justify-center items-center min-h-[60px]"><Spinner /></div>
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
          <div className="flex justify-center items-center min-h-[60px]"><Spinner /></div>
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

      {modalOpen && (
        <ImageModal
          images={vehicle.vehicleImages && vehicle.vehicleImages.length > 0 ? vehicle.vehicleImages : [vehicle.imageUrl]}
          startIndex={modalIdx}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default VehicleDetail; 