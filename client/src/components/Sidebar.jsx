import React, { useState } from "react";
import { motion } from "framer-motion";

const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("vehicles");

  return (
    <div className="flex h-screen">
      <motion.div
        animate={{ width: expanded ? 192 : 64 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-gray-900 text-white flex flex-col"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{ minWidth: 64, maxWidth: 256 }}
      >
        <div className="flex flex-col items-center py-4 space-y-2">
          {/* Vehicles Button */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#1e293b" }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center px-2 py-2 rounded transition-colors duration-200 ${
              activeTab === "vehicles" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("vehicles")}
          >
            <span className="material-icons">directions_car</span>
            {expanded && <span className="ml-2">My Vehicles</span>}
          </motion.button>

          {/* Trips Button */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#1e293b" }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center px-2 py-2 rounded transition-colors duration-200 ${
              activeTab === "trips" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("trips")}
          >
            <span className="material-icons">map</span>
            {expanded && <span className="ml-2">My Trips</span>}
          </motion.button>

          {/* Fuel Button */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#1e293b" }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center px-2 py-2 rounded transition-colors duration-200 ${
              activeTab === "fuel" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("fuel")}
          >
            <span className="material-icons">local_gas_station</span>
            {expanded && <span className="ml-2">Fuel Logs</span>}
          </motion.button>
        </div>
      </motion.div>

      <div className="flex-1 bg-gray-50 overflow-auto">
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { activeTab })
        )}
      </div>
    </div>
  );
};

export default Sidebar;
