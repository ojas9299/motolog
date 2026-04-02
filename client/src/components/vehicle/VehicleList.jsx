import React, { useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import VehicleForm from "./VehicleForm";
import { useVehicles } from "../../hooks/useVehicles";
import { useToast } from "../../hooks/useToast";
import Spinner from "../ui/Spinner";
import Toast from "../ui/Toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, BarChart2 } from 'lucide-react';

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

const VehicleSpecsModal = ({ open, onClose, specs, loading, verified }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-hud-surface-container-high border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-6 text-indigo-400 font-headline flex items-center gap-2">
          Vehicle Specs
          {verified === true && <span title="Verified" className="text-green-400 text-base">✅ Verified</span>}
          {verified === false && <span title="Not Verified" className="text-red-400 text-base">⚠️ Not Verified</span>}
        </h2>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]"><Spinner /></div>
        ) : specs ? (
          <div className="space-y-3 font-body text-sm text-slate-300">
            <div className="text-lg font-bold mb-4 text-white font-headline">{specs.make} {specs.model} {specs.year}</div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500 font-label tracking-widest uppercase text-[10px]">Engine</span> <span className="font-semibold text-white">{specs.engine}</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500 font-label tracking-widest uppercase text-[10px]">Power</span> <span className="font-semibold text-white">{specs.power}</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500 font-label tracking-widest uppercase text-[10px]">Torque</span> <span className="font-semibold text-white">{specs.torque}</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500 font-label tracking-widest uppercase text-[10px]">Tank</span> <span className="font-semibold text-white">{specs.fuel_capacity || specs.tankCapacity}</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-500 font-label tracking-widest uppercase text-[10px]">Weight</span> <span className="font-semibold text-white">{specs.total_weight || specs.weight}</span></div>
          </div>
        ) : (
          <div className="text-slate-500 text-center py-8 font-body">No specs found in database.</div>
        )}
      </div>
    </div>
  );
};

const VehicleList = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    vehicles,
    loading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicles(user?.id);
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [specsModalOpen, setSpecsModalOpen] = useState(false);
  const [specsLoading, setSpecsLoading] = useState(false);
  const [vehicleSpecs, setVehicleSpecs] = useState(null);
  const [verified, setVerified] = useState(null);

  const handleCardClick = (vehicle) => {
    navigate(`/vehicle/${vehicle._id}`);
  };

  const handleAddVehicle = async (vehicleData) => {
    try {
      const ownerName = user?.fullName || user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress || "Unknown";
      const result = await createVehicle({
        ...vehicleData,
        userId: user?.id || "",
        owner: ownerName,
      });
      if (result.success) {
        showSuccess("Vehicle added successfully!");
        setIsAdding(false);
      } else {
        showError(result.error || "Failed to add vehicle");
      }
    } catch (err) {
      showError(err.message || "Failed to add vehicle");
    }
  };

  const handleUpdateVehicle = async (vehicleData) => {
    try {
      const ownerName = user?.fullName || user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress || "Unknown";
      const result = await updateVehicle(editingVehicle._id, {
        ...vehicleData,
        userId: user.id,
        owner: ownerName,
      });
      if (result.success) {
        showSuccess("Vehicle updated successfully!");
        setEditingVehicle(null);
      } else {
        showError(result.error || "Failed to update vehicle");
      }
    } catch (err) {
      showError(err.message || "Failed to update vehicle");
    }
  };

  // Mock fleet stats or aggregate logic
  const fleetDistance = useMemo(() => vehicles.length * 4160, [vehicles]); // Mock multiplier for visual completeness based on design

  if (!user) return <p className="text-center py-10 text-lg text-slate-400 font-body">Please sign in to view your vehicles.</p>;

  if (isAdding) {
    const ownerName = user?.fullName || user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress || "Unknown";
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto bg-hud-bg min-h-screen">
        <h2 className="text-3xl font-extrabold mb-6 text-white font-headline">Add New Vehicle</h2>
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <VehicleForm
            onSubmit={handleAddVehicle}
            onCancel={() => setIsAdding(false)}
            owner={ownerName}
          />
        </div>
      </div>
    );
  }

  if (editingVehicle) {
    const ownerName = user?.fullName || user?.firstName || user?.username || user?.emailAddresses?.[0]?.emailAddress || "Unknown";
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto bg-hud-bg min-h-screen">
        <h2 className="text-3xl font-extrabold mb-6 text-white font-headline">Edit Vehicle</h2>
        <div className="glass-card rounded-2xl p-6 border border-white/10">
          <VehicleForm
            vehicle={editingVehicle}
            onSubmit={handleUpdateVehicle}
            onCancel={() => setEditingVehicle(null)}
            owner={ownerName}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hud-bg font-body text-hud-on-surface">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
      <VehicleSpecsModal
        open={specsModalOpen}
        onClose={() => setSpecsModalOpen(false)}
        specs={vehicleSpecs}
        loading={specsLoading}
        verified={verified}
      />

      <div className="max-w-6xl mx-auto p-4 sm:p-8 lg:p-12">
        {/* ─── Header Section ─── */}
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter mb-2 text-white">My Vehicles</h2>
            <p className="font-label text-slate-500 uppercase tracking-widest text-xs">Manage your high-performance fleet</p>
          </div>
          <div className="hidden md:flex gap-2">
            <div className="px-4 py-2 bg-hud-surface-container-high rounded-lg flex items-center gap-2 border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-label text-slate-300">SYSTEMS NOMINAL</span>
            </div>
          </div>
        </div>

        {/* ─── Loading / Empty / Grid ─── */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]"><Spinner /></div>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
            <button
              onClick={() => setIsAdding(true)}
              className="h-auto min-h-[300px] w-full max-w-lg rounded-2xl border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/60 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all flex flex-col items-center justify-center group gap-4 cursor-pointer"
            >
               <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={32} className="text-indigo-400" />
               </div>
               <div className="text-center">
                  <p className="text-xl font-bold text-indigo-300 font-headline">Deploy First Unit</p>
                  <p className="text-xs font-label text-slate-500 uppercase tracking-widest mt-2">Initialize Fleet Data</p>
               </div>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <AnimatePresence>
              {vehicles.map((vehicle, idx) => (
                <motion.div
                  key={vehicle._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="glass-card rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.2)] cursor-pointer"
                  onClick={() => handleCardClick(vehicle)}
                  style={{ border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {/* Decorative Power Bar */}
                  <div className="h-[2px] w-10 bg-pink-600 transition-all group-hover:w-full group-hover:bg-indigo-500" />
                  
                  {/* Image Area */}
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-hud-surface-container">
                    {vehicle.vehicleImages && vehicle.vehicleImages.length > 0 ? (
                      <img
                        src={vehicle.vehicleImages[0]}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : vehicle.imageUrl ? (
                      <img
                        src={vehicle.imageUrl}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-indigo-900/20 text-indigo-500 text-6xl font-black font-headline opacity-50">
                        {vehicle.brand?.[0]?.toUpperCase()}
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-hud-surface via-transparent to-transparent opacity-80 z-10" />
                    
                    {/* Floating Title */}
                    <div className="absolute bottom-4 left-5 sm:left-6 z-20">
                      <span className="inline-block px-3 py-1 rounded-full bg-hud-primary-container/90 text-white text-[10px] font-label font-bold tracking-widest uppercase mb-2 shadow-lg backdrop-blur-md">
                        {vehicle.color || "Standard Finish"}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white font-headline tracking-tight">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                    </div>
                  </div>

                  {/* Metadata Area */}
                  <div className="p-5 sm:p-6 grid grid-cols-3 gap-2 sm:gap-4 bg-hud-surface-container-low/50">
                    <div className="space-y-1">
                      <p className="font-label text-[10px] text-slate-500 uppercase tracking-wider">Year</p>
                      <p className="text-white font-bold text-sm sm:text-base">{vehicle.year || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="font-label text-[10px] text-slate-500 uppercase tracking-wider">Registration</p>
                      <p className="text-white font-bold text-sm sm:text-base truncate" title={vehicle.registrationNumber}>
                        {vehicle.registrationNumber || "Unregistered"}
                      </p>
                    </div>
                    <div className="flex justify-end items-center">
                      <button 
                         className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 transition-colors border border-white/5"
                         onClick={(e) => {
                            e.stopPropagation(); // prevent card click
                            handleCardClick(vehicle);
                         }}
                      >
                        <BarChart2 size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Add New Expansion Card explicitly */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsAdding(true)}
                className="h-auto min-h-[300px] sm:min-h-[100%] rounded-2xl border-2 border-dashed border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 transition-all flex flex-col items-center justify-center group gap-4 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus size={32} className="text-indigo-400" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-indigo-300 font-headline">Add New Vehicle</p>
                  <p className="text-[10px] font-label text-slate-500 uppercase tracking-widest mt-1">Expansion Slot Available</p>
                </div>
              </motion.button>
            </AnimatePresence>
          </div>
        )}

        {/* ─── Footer Stats / Ticker ─── */}
        {!loading && vehicles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 opacity-70 hover:opacity-100 transition-all duration-500 p-6 glass-card rounded-2xl border border-white/5"
          >
            <div className="flex flex-col gap-1 border-l-2 border-indigo-500 pl-4 sm:pl-5">
              <span className="text-[10px] font-label font-bold text-slate-400 uppercase tracking-tighter">Fleet Total Distance</span>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tighter font-headline">
                {fleetDistance.toLocaleString()} <span className="text-sm font-normal text-slate-500">KM</span>
              </span>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-indigo-500 pl-4 sm:pl-5">
              <span className="text-[10px] font-label font-bold text-slate-400 uppercase tracking-tighter">Avg Fleet Efficiency</span>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tighter font-headline">
                34.2 <span className="text-sm font-normal text-slate-500">KMPL</span>
              </span>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-indigo-500 pl-4 sm:pl-5">
              <span className="text-[10px] font-label font-bold text-slate-400 uppercase tracking-tighter">Systems Health</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tighter font-headline">
                98 <span className="text-sm font-normal text-slate-500">%</span>
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
