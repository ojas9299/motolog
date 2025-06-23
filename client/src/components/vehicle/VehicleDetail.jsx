import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "../ui/Spinner";
import FuelLogList from "../fuel/FuelLogList";
import { useUser } from "@clerk/clerk-react";

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
        const { verified, specs } = await fetchVehicleSpecs(vehicle.brand, vehicle.model);
        setSpecs(specs);
        setVerified(verified);
      }
      setSpecsLoading(false);
    };
    fetchSpecs();
  }, [vehicle]);

  // Fetch trips for this vehicle
  useEffect(() => {
    const fetchTrips = async () => {
      setTripsLoading(true);
      try {
        const res = await axios.get(`/api/trip?userId=${user?.id}&vehicleId=${vehicleId}`);
        setTrips(res.data.trips || []);
      } catch (err) {
        setTrips([]);
      } finally {
        setTripsLoading(false);
      }
    };
    if (user?.id && vehicleId) fetchTrips();
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
    </div>
  );
};

export default VehicleDetail; 