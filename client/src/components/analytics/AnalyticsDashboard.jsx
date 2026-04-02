import React, { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import ReactECharts from "echarts-for-react";
import Spinner from "../ui/Spinner";
import { motion } from "framer-motion";
import {
  Filter,
  ChevronDown,
  Zap,
  Wallet,
  Gauge,
  Leaf,
} from "lucide-react";

// Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Filler, ChartTooltip, ChartLegend);

// ─── Shared dark chart theme options ───
const darkGridColor = "rgba(255,255,255,0.05)";
const darkTickColor = "#64748b";
const hudFont = { family: "'Space Grotesk', sans-serif", weight: "500" };

const darkScaleOptions = {
  x: {
    ticks: { color: darkTickColor, font: { ...hudFont, size: 10 }, maxRotation: 0 },
    grid: { color: darkGridColor },
    border: { color: "transparent" },
  },
  y: {
    ticks: { color: darkTickColor, font: { ...hudFont, size: 10 } },
    grid: { color: darkGridColor },
    border: { color: "transparent" },
  },
};

// ─── Stat card component ───
const StatCard = ({ icon: Icon, label, value, unit, glowClass, borderColorClass, iconColorClass, unitColorClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className={`bg-hud-surface-container-low rounded-xl p-5 border-l-2 ${borderColorClass} ${glowClass} transition-all hover:scale-[1.02]`}
  >
    <div className="flex items-center gap-2 mb-2">
      <Icon size={14} className={iconColorClass} />
      <span className="text-[10px] uppercase font-label tracking-widest text-slate-500">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-headline font-bold text-hud-on-surface">{value}</span>
      <span className={`text-xs font-body ${unitColorClass}`}>{unit}</span>
    </div>
  </motion.div>
);

// ─── Chart card wrapper ───
const ChartCard = ({ title, subtitle, metric, metricLabel, metricColor, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className="glass-card rounded-2xl p-6 flex flex-col gap-5 hover:border-indigo-500/20 transition-all"
  >
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h3 className="font-headline font-semibold text-lg text-hud-on-surface">{title}</h3>
        <span className="text-xs text-slate-500 font-body">{subtitle}</span>
      </div>
      {metric !== undefined && metric !== null && (
        <div className="flex flex-col items-end">
          <span className={`text-2xl font-headline font-bold ${metricColor || "text-indigo-400"}`}>{metric}</span>
          {metricLabel && (
            <span className={`text-[10px] uppercase font-headline font-bold ${metricColor || "text-indigo-400"} opacity-60`}>
              {metricLabel}
            </span>
          )}
        </div>
      )}
    </div>
    {children}
  </motion.div>
);

// ─── Custom Recharts Tooltip ───
const HudTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg px-3 py-2 text-xs font-label">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-hud-on-surface font-bold">
            {p.name}: <span style={{ color: p.stroke || p.fill }}>{Number(p.value).toFixed(1)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Format helpers ───
const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
};

const formatNumber = (n) => {
  if (n == null) return "—";
  return Number(n).toLocaleString("en-IN");
};

// ═════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════
const AnalyticsDashboard = () => {
  const { user } = useUser();
  const [vehicles, setVehicles] = useState([]);
  const [fuelLogs, setFuelLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vehiclesRes = await axios.get(`https://api.motolog.online/api/vehicle?userId=${user.id}`);
        setVehicles(vehiclesRes.data.vehicles || []);
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

  // ─── Derived data ───
  const filteredLogs = useMemo(() =>
    selectedVehicle === "all"
      ? fuelLogs
      : fuelLogs.filter(log => log.vehicle._id === selectedVehicle),
    [fuelLogs, selectedVehicle]
  );

  const fuelUpDates = filteredLogs.map(log => formatDate(log.date || log.createdAt));
  const fuelAmounts = filteredLogs.map(log => log.fuelLitres || log.fuel || 0);
  const odometerReadings = filteredLogs.map(log => log.odoReading || log.odometer || 0);
  const mileageValues = filteredLogs.map(log =>
    log.mileage || (log.odoReading && log.fuelLitres ? (log.odoReading / log.fuelLitres).toFixed(2) : null)
  );

  // Summary stats
  const totalFuel = fuelAmounts.reduce((a, b) => a + b, 0);
  const avgMileage = mileageValues.filter(Boolean).length > 0
    ? (mileageValues.filter(Boolean).reduce((a, b) => a + Number(b), 0) / mileageValues.filter(Boolean).length).toFixed(1)
    : "—";
  const bestMileage = mileageValues.filter(Boolean).length > 0
    ? Math.max(...mileageValues.filter(Boolean).map(Number)).toFixed(1)
    : "—";
  const totalCost = filteredLogs.reduce((sum, log) => sum + (log.totalCost || log.cost || 0), 0);
  const latestOdo = odometerReadings.length > 0 ? Math.max(...odometerReadings) : 0;
  const estimatedEmissions = (totalFuel * 2.31 / 1000).toFixed(1); // ~2.31 kg CO2 per litre petrol

  // ─── Chart.js: Fuel Bar ───
  const fuelBarData = {
    labels: fuelUpDates,
    datasets: [{
      label: "Fuel-ups (L)",
      data: fuelAmounts,
      backgroundColor: (ctx) => {
        const chart = ctx.chart;
        const { ctx: canvasCtx, chartArea } = chart;
        if (!chartArea) return "#4f46e5";
        const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, "#312e81");
        gradient.addColorStop(1, "#4f46e5");
        return gradient;
      },
      borderRadius: 6,
      borderSkipped: false,
      barPercentage: 0.6,
    }],
  };
  const fuelBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(11,19,38,0.9)",
        titleFont: hudFont,
        bodyFont: hudFont,
        borderColor: "rgba(79,70,229,0.3)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: darkScaleOptions,
  };

  // ─── Chart.js: Odometer Line ───
  const odoLineData = {
    labels: fuelUpDates,
    datasets: [{
      label: "Odometer (km)",
      data: odometerReadings,
      borderColor: "#10b981",
      backgroundColor: (ctx) => {
        const chart = ctx.chart;
        const { ctx: canvasCtx, chartArea } = chart;
        if (!chartArea) return "rgba(16,185,129,0.2)";
        const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, "rgba(16,185,129,0)");
        gradient.addColorStop(1, "rgba(16,185,129,0.25)");
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: "#10b981",
      pointBorderColor: "#0b1326",
      pointBorderWidth: 2,
      borderWidth: 2.5,
    }],
  };
  const odoLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(11,19,38,0.9)",
        titleFont: hudFont,
        bodyFont: hudFont,
        borderColor: "rgba(16,185,129,0.3)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: darkScaleOptions,
  };

  // ─── Recharts: Mileage Area ───
  const mileageAreaData = filteredLogs.map((log, i) => ({
    date: fuelUpDates[i],
    mileage: Number(mileageValues[i]) || 0,
  }));

  // ─── ECharts: Donut ───
  const vehicleColors = ["#4f46e5", "#a500bd", "#fbabff", "#4edea3", "#f59e0b", "#ef4444"];
  const fuelByVehicle = vehicles.map((v, i) => ({
    name: `${v.brand} ${v.model}`,
    value: fuelLogs
      .filter(log => log.vehicle._id === v._id)
      .reduce((sum, log) => sum + (log.fuelLitres || 0), 0),
    itemStyle: { color: vehicleColors[i % vehicleColors.length] },
  }));
  const totalFillups = fuelLogs.length;

  const pieOption = {
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(11,19,38,0.95)",
      borderColor: "rgba(79,70,229,0.3)",
      borderWidth: 1,
      textStyle: { color: "#dbe2fd", fontFamily: "'Space Grotesk', sans-serif", fontSize: 12 },
      formatter: "{b}: <b>{c}L</b> ({d}%)",
    },
    series: [{
      name: "Fuel by Vehicle",
      type: "pie",
      radius: ["50%", "75%"],
      center: ["35%", "50%"],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: "#0b1326", borderWidth: 3 },
      label: { show: false },
      emphasis: {
        label: { show: false },
        itemStyle: { shadowBlur: 20, shadowColor: "rgba(79,70,229,0.4)" },
      },
      labelLine: { show: false },
      data: fuelByVehicle,
    }],
  };

  // Vehicle label for dropdown
  const selectedLabel = selectedVehicle === "all"
    ? "All Vehicles (Combined)"
    : (() => {
        const v = vehicles.find(v => v._id === selectedVehicle);
        return v ? `${v.brand} ${v.model}` : "Select Vehicle";
      })();

  // ─── RENDER ───
  if (!user) return <p className="text-center py-10 text-lg text-slate-400">Please sign in to view analytics.</p>;

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-hud-bg min-h-screen">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
      >
        <div className="space-y-1">
          <h2 className="text-3xl sm:text-4xl font-bold font-headline text-hud-on-surface tracking-tight">
            Analytics & Graphs
          </h2>
          <p className="text-slate-500 font-body text-sm">
            Real-time performance metrics and historical trends
          </p>
        </div>

        {/* Vehicle Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-5 py-2.5 glass-card rounded-xl border border-indigo-500/20 text-hud-on-surface hover:border-indigo-500/50 transition-all text-sm font-medium cursor-pointer"
          >
            <Filter size={16} className="text-indigo-400" />
            <span>{selectedLabel}</span>
            <ChevronDown size={14} className={`text-slate-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-0 mt-2 w-64 glass-card rounded-xl border border-indigo-500/20 py-1 z-50 overflow-hidden"
            >
              <button
                onClick={() => { setSelectedVehicle("all"); setDropdownOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors
                  ${selectedVehicle === "all" ? "text-indigo-400 bg-indigo-500/10" : "text-slate-300 hover:text-white hover:bg-white/5"}`}
              >
                All Vehicles (Combined)
              </button>
              {vehicles.map(v => (
                <button
                  key={v._id}
                  onClick={() => { setSelectedVehicle(v._id); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors
                    ${selectedVehicle === v._id ? "text-indigo-400 bg-indigo-500/10" : "text-slate-300 hover:text-white hover:bg-white/5"}`}
                >
                  {v.brand} {v.model}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]"><Spinner /></div>
      ) : (
        <>
          {/* ─── Chart Grid ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fuel-ups Bar Chart */}
            <ChartCard
              title="Fuel-ups Over Time"
              subtitle="Volume per fill-up cycle"
              metric={`${totalFuel.toFixed(1)} L`}
              metricColor="text-indigo-400"
              metricLabel="Total"
              delay={0.1}
            >
              <div className="h-[240px]">
                <Bar data={fuelBarData} options={fuelBarOptions} />
              </div>
            </ChartCard>

            {/* Odometer Line Chart */}
            <ChartCard
              title="Odometer Readings Over Time"
              subtitle="Cumulative distance (km)"
              metric={formatNumber(latestOdo)}
              metricColor="text-emerald-400"
              metricLabel={odometerReadings.length > 1 ? "Latest" : ""}
              delay={0.2}
            >
              <div className="h-[240px]">
                <Line data={odoLineData} options={odoLineOptions} />
              </div>
            </ChartCard>

            {/* Mileage Trend Area Chart */}
            <ChartCard
              title="Mileage Trend"
              subtitle="Efficiency metric (km/L)"
              metric={avgMileage}
              metricColor="text-indigo-400"
              metricLabel="AVG KM/L"
              delay={0.3}
            >
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mileageAreaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="hudMileageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={darkGridColor} strokeDasharray="none" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: darkTickColor, fontSize: 10, fontFamily: "'Space Grotesk'" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: darkTickColor, fontSize: 10, fontFamily: "'Space Grotesk'" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<HudTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="mileage"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#hudMileageGradient)"
                      dot={{ fill: "#4f46e5", r: 3, strokeWidth: 2, stroke: "#0b1326" }}
                      activeDot={{ r: 5, stroke: "#4f46e5", strokeWidth: 2, fill: "#0b1326" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            {/* Donut Chart: Fuel by Vehicle */}
            {selectedVehicle === "all" && (
              <ChartCard
                title="Fuel-ups by Vehicle"
                subtitle="Contribution per machine"
                delay={0.4}
              >
                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 flex-1 min-h-[240px]">
                  <div className="relative w-48 h-48">
                    <ReactECharts
                      option={pieOption}
                      style={{ width: "100%", height: "100%" }}
                      opts={{ renderer: "canvas" }}
                    />
                    {/* Center Label — overlaid on ECharts */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ left: "-15%" }}>
                      <span className="text-[10px] uppercase font-label text-slate-500 tracking-widest">Total</span>
                      <span className="text-xl font-headline font-bold text-hud-on-surface">{totalFillups}</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-3">
                    {fuelByVehicle.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: vehicleColors[i % vehicleColors.length] }}
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-headline font-semibold text-hud-on-surface">{item.name}</span>
                          <span className="text-[10px] text-slate-500 font-body">
                            {item.value.toFixed(1)}L ({totalFuel > 0 ? ((item.value / totalFuel) * 100).toFixed(0) : 0}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>
            )}
          </div>

          {/* ─── Bottom Stats Row ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            <StatCard
              icon={Zap}
              label="Best Efficiency"
              value={bestMileage}
              unit="km/L"
              borderColorClass="border-indigo-500"
              glowClass="hud-glow-indigo"
              iconColorClass="text-indigo-400"
              unitColorClass="text-indigo-400"
            />
            <StatCard
              icon={Wallet}
              label="Total Expenditure"
              value={totalCost > 0 ? `₹${formatNumber(Math.round(totalCost))}` : "—"}
              unit=""
              borderColorClass="border-emerald-500"
              glowClass="hud-glow-emerald"
              iconColorClass="text-emerald-400"
              unitColorClass="text-emerald-400"
            />
            <StatCard
              icon={Gauge}
              label="Total Distance"
              value={formatNumber(latestOdo)}
              unit="km"
              borderColorClass="border-purple-500"
              glowClass="hud-glow-pink"
              iconColorClass="text-purple-400"
              unitColorClass="text-purple-400"
            />
            <StatCard
              icon={Leaf}
              label="Est. Emissions"
              value={estimatedEmissions}
              unit="tCO₂e"
              borderColorClass="border-red-400"
              glowClass="hud-glow-error"
              iconColorClass="text-red-400"
              unitColorClass="text-red-400"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;