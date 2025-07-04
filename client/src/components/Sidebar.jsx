// components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Car, Route, Fuel, Globe, BarChart2 } from 'lucide-react';

const Sidebar = ({ setActiveTab, activeTab, children }) => {
  const tabs = [
    { key: "vehicles", label: "Vehicles", icon: <Car size={20} /> },
    { key: "trips", label: "My Trips", icon: <Route size={20} /> },
    { key: "fuel", label: "Fuel Log", icon: <Fuel size={20} /> },
    { key: "rideboard", label: "Rideboard", icon: <Globe size={20} /> },
    { key: "analytics", label: "Analytics", icon: <BarChart2 size={20} /> },
  ];
  const navigate = useNavigate();

  return (
    <div className="flex">
      {/* Clean Sidebar, no logo or Motolog text or Log New Trip button */}
      <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-start">
        <div className="px-4 py-4">
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
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
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition text-left ${
                  activeTab === tab.key
                    ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-white font-bold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Sidebar;
