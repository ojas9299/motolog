import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

const NAV_LINKS = [
  { name: "Vehicles", tab: "vehicles" },
  { name: "Trips", tab: "trips" },
  { name: "Fuel", tab: "fuel" },
];

const Navbar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("motolog-dark-mode") === "true";
  });

  const handleBack = () => {
    navigate(-1);
  };

  const isHome = location.pathname === "/";

  //   useEffect(() => {
  //     // Do not apply any dark/light mode logic on homepage
  //     if (location.pathname === "/") {
  //       return;
  //     }
  //     // Only apply dark mode on other routes
  //     if (darkMode) {
  //       document.documentElement.classList.add("dark");
  //     } else {
  //       document.documentElement.classList.remove("dark");
  //     }
  //     localStorage.setItem("motolog-dark-mode", darkMode);
  //   }, [darkMode, location.pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        {!isHome && (
          <button
            onClick={handleBack}
            className="mr-2 text-gray-500 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 text-2xl"
            title="Back"
          >
            ←
          </button>
        )}
        <span
          className="font-bold text-xl text-indigo-700 dark:text-indigo-300 cursor-pointer select-none"
          onClick={() => {
            setActiveTab("vehicles");
            navigate("/");
          }}
        >
          Motolog
        </span>
      </div>
      <div className="flex items-center gap-4">
        {NAV_LINKS.map((link) => (
          <button
            key={link.name}
            onClick={() => {
              setActiveTab(link.tab);
              navigate("/");
            }}
            className={`text-md font-medium px-2 py-1 rounded transition ${
              activeTab === link.tab
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800"
            }`}
          >
            {link.name}
          </button>
        ))}
        <button
          onClick={() => navigate("/analytics")}
          className="flex items-center gap-1 px-3 py-1 rounded text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-50 dark:hover:bg-gray-800 transition border border-indigo-200 dark:border-indigo-700"
          title="Analytics & Graphs"
        >
          <span role="img" aria-label="chart">📊</span> Analytics
        </button>
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="ml-4 text-xl px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
        <div className="ml-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 