import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import ReactECharts from "echarts-for-react";
import Spinner from "../ui/Spinner";

// Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, ChartTooltip, ChartLegend);

const AnalyticsDashboard = () => {
  const { user } = useUser();
  const [vehicles, setVehicles] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vehiclesRes = await axios.get(`https://api.motolog.online/api/vehicle?userId=${user.id}`);
        setVehicles(vehiclesRes.data.vehicles || []);
        // Fetch all fuel logs for all vehicles
        const allLogs = [];
        for (const v of vehiclesRes.data.vehicles) {
          const logsRes = await axios.get(`https://api.motolog.online/api/fuel/${v._id}?userId=${user.id}`);
          allLogs.push(...(logsRes.data || []).map(log => ({ ...log, vehicle: v })));
        }
        setFuelLogs(allLogs);
      } catch (err) {
        setVehicles([]);
        setFuelLogs([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchData();
  }, [user]);

  // Filter logs for selected vehicle
  const filteredLogs = selectedVehicle === "all"
    ? fuelLogs
    : fuelLogs.filter(log => log.vehicle._id === selectedVehicle);

  // Prepare data for charts
  const fuelUpDates = filteredLogs.map(log => log.date || log.createdAt);
  const fuelAmounts = filteredLogs.map(log => log.fuelLitres || log.fuel || 0);
  const odometerReadings = filteredLogs.map(log => log.odoReading || log.odometer || 0);
  const mileage = filteredLogs.map(log => log.mileage || (log.odoReading && log.fuelLitres ? (log.odoReading / log.fuelLitres).toFixed(2) : null));

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
  const mileageAreaData = filteredLogs.map((log, i) => ({
    date: fuelUpDates[i],
    mileage: Number(mileage[i]) || 0,
  }));

  // ECharts Pie: Fuel-ups by vehicle (for all vehicles)
  const fuelByVehicle = vehicles.map(v => ({
    name: `${v.brand} ${v.model}`,
    value: fuelLogs.filter(log => log.vehicle._id === v._id).reduce((sum, log) => sum + (log.fuelLitres || 0), 0),
  }));
  const pieOption = {
    tooltip: { trigger: 'item' },
    legend: { top: 'bottom' },
    series: [
      {
        name: 'Fuel-ups by Vehicle',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: fuelByVehicle,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-200">Analytics & Graphs</h1>
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <label className="font-medium text-gray-700 dark:text-gray-200">Select Vehicle:</label>
        <select
          value={selectedVehicle}
          onChange={e => setSelectedVehicle(e.target.value)}
          className="border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
        >
          <option value="all">All Vehicles (Combined)</option>
          {vehicles.map(v => (
            <option key={v._id} value={v._id}>{v.brand} {v.model}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chart.js Bar */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Fuel-ups Over Time</h2>
            <Bar data={fuelBarData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          {/* Chart.js Line */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Odometer Readings Over Time</h2>
            <Line data={odoLineData} options={{ responsive: true }} />
          </div>
          {/* Recharts Area */}
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
          {/* ECharts Pie */}
          {selectedVehicle === "all" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold mb-4">Fuel-ups by Vehicle</h2>
              <ReactECharts option={pieOption} style={{ height: 350 }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 