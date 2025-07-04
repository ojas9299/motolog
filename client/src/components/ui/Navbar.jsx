import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { Car, Route, Fuel, Menu, Globe, BarChart2, Sun, Moon } from 'lucide-react';

const NAV_LINKS = [
  { name: "Vehicles", tab: "vehicles", icon: <Car size={18} className="mr-1" /> },
  { name: "Trips", tab: "trips", icon: <Route size={18} className="mr-1" /> },
  { name: "Fuel", tab: "fuel", icon: <Fuel size={18} className="mr-1" /> },
  { name: "Rideboard", tab: "rideboard", icon: <Globe size={18} className="mr-1" /> },
];

const Navbar = ({ activeTab, setActiveTab, darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = React.useRef(null);

  const handleBack = () => {
    navigate(-1);
  };

  const isHome = location.pathname === "/";

  useEffect(() => {
    // Do not apply any dark/light mode logic on homepage
    if (location.pathname === "/") {
      return;
    }
    // Only apply dark mode on other routes
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("motolog-dark-mode", darkMode);
  }, [darkMode, location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-2">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden mr-2 text-gray-500 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 text-2xl"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Open navigation menu"
        >
          <Menu />
        </button>
        {!isHome && (
          <button
            onClick={handleBack}
            className="hidden md:inline mr-2 text-gray-500 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 text-2xl"
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
      {/* Desktop nav links hidden; only show dark mode and profile on right */}
      <div className="hidden md:flex items-center gap-4"></div>
      {/* Always show dark mode and profile on right, even on mobile */}
      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="text-xl px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Moon /> : <Sun />}
        </button>
        <div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      {/* Mobile nav menu (dropdown) */}
      {mobileMenuOpen && (
        <div ref={menuRef} className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md flex flex-col items-start px-4 py-2 md:hidden z-50">
          {NAV_LINKS.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                setActiveTab(link.tab);
                navigate(link.tab === 'rideboard' ? '/rideboard' : link.tab === 'vehicles' ? '/vehicles' : link.tab === 'fuel' ? '/' : '/');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center text-md font-medium px-2 py-2 rounded transition text-left ${
                activeTab === link.tab
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800"
              }`}
            >
              {link.icon}
              {link.name}
            </button>
          ))}
          {/* Analytics tab for mobile */}
          <button
            onClick={() => {
              navigate('/analytics');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-1 px-2 py-2 rounded text-indigo-700 dark:text-indigo-300 font-semibold hover:bg-indigo-50 dark:hover:bg-gray-800 transition mt-1"
            title="Analytics & Graphs"
          >
            <BarChart2 size={18} className="mr-1" /> Analytics
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 