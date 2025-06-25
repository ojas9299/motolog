// components/Sidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setActiveTab, activeTab, children }) => {
  const tabs = ["vehicles", "trips", "fuel"];
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex">
      {/* Sidebar Icon */}
      <div
        className="flex flex-col items-center justify-start pt-4 cursor-pointer select-none z-20"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 shadow mb-2">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-200">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>
        {/* Sidebar Panel */}
        <nav
          className={`transition-all duration-300 overflow-hidden rounded-xl shadow-lg ${
            open ? "w-56 opacity-100" : "w-0 opacity-0"
          } bg-gray-100 dark:bg-gray-900 p-0`}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          style={{ minWidth: open ? 224 : 0 }}
        >
          <div className={open ? "p-4" : "p-0"}>
            {open && tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`block w-full text-left px-4 py-2 rounded-lg mb-2 transition font-medium ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            {/* Analytics Button */}
            {open && (
              <button
                onClick={() => navigate("/analytics")}
                className="block w-full text-left px-4 py-2 rounded-lg mb-2 transition font-medium flex items-center gap-2 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-800 border border-indigo-200 dark:border-indigo-700"
              >
                <span role="img" aria-label="chart">📊</span> Analytics
              </button>
            )}
          </div>
        </nav>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Sidebar;
