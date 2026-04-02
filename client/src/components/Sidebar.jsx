import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { LogOut } from "lucide-react";

// Icons based on the user's template using Material Symbols or lucide
// Since lucide is already in project, we'll map icons close to the reference.
import { Car, Route, Fuel, Globe, BarChart2 } from 'lucide-react';

const Sidebar = ({ setActiveTab, activeTab, children }) => {
  const { user } = useUser();
  const tabs = [
    { key: "vehicles", label: "Vehicles", icon: <Car size={18} /> },
    { key: "trips", label: "My Trips", icon: <Route size={18} /> },
    { key: "fuel", label: "Fuel Log", icon: <Fuel size={18} /> },
    { key: "rideboard", label: "Rideboard", icon: <Globe size={18} /> },
    { key: "analytics", label: "Analytics", icon: <BarChart2 size={18} /> },
  ];
  const navigate = useNavigate();

  return (
    <div className="flex bg-hud-bg min-h-screen font-body w-full">
      {/* Sidebar: hidden on mobile */}
      <aside className="hidden md:flex w-[260px] h-auto min-h-screen bg-[#0F172A] border-r border-slate-800/50 shadow-[20px_0_60px_-15px_rgba(79,70,229,0.15)] flex-col justify-start z-40 relative">
        <div className="p-8">
          <span className="text-2xl font-extrabold tracking-tighter text-indigo-500 font-headline">MotoLog</span>
          <p className="text-[10px] font-label font-bold tracking-[0.2em] text-slate-500 uppercase mt-1">High-Velocity Telemetry</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {tabs.map((tab) => {
             const isActive = activeTab === tab.key;
             return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.key === "rideboard") navigate("/rideboard");
                  else if (tab.key === "vehicles") navigate("/vehicles");
                  else if (tab.key === "fuel") navigate("/");
                  else if (tab.key === "trips") navigate("/");
                  else if (tab.key === "analytics") navigate("/analytics");
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all font-body font-semibold tracking-tight uppercase text-[12px] text-left ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400 border-r-2 border-indigo-500"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
             );
          })}
        </nav>

        {/* User Profile Footer Section */}
        {user && (
          <div className="p-6 mt-auto border-t border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-indigo-500/30 flex items-center justify-center shrink-0">
                <UserButton afterSignOutUrl="/" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-200 truncate">{user?.fullName || user?.firstName || "Rider"}</p>
                <p className="text-[10px] text-slate-500 font-label tracking-wider uppercase">PRO PILOT</p>
              </div>
              <div className="text-slate-500 pointer-events-none opacity-50 ml-auto">
                 {/* Decorative logout icon since UserButton handles it */}
                 <LogOut size={16} />
              </div>
            </div>
          </div>
        )}
      </aside>
      
      {/* Main content: full width on mobile */}
      <main className="flex-1 w-full bg-hud-bg text-hud-on-surface">
         {children}
      </main>
    </div>
  );
};

export default Sidebar;
