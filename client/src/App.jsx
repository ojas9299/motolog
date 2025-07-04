import React, { useState, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useLocation,
} from "react-router-dom";
import * as Tooltip from '@radix-ui/react-tooltip';

// Components & Pages
import Sidebar from "./components/Sidebar";
import VehicleList from "./components/vehicle/VehicleList";
import MyTrips from "./components/trip/MyTrips";
import MyFuel from "./components/fuel/MyFuel";
import FuelForm from "./components/fuel/FuelForm";
import FuelLog from "./components/fuel/FuelLog";
import VehicleDetail from "./components/vehicle/VehicleDetail";
import Navbar from "./components/ui/Navbar";
import AnalyticsDashboard from "./components/analytics/AnalyticsDashboard";
import Homepage from "./components/Homepage";
import RideboardList from "./components/rideboard/RideboardList";
import Footer from "./components/ui/Footer";

// Wrapper to extract route param and pass callback
const FuelFormWrapper = () => {
  const { vehicleId } = useParams();

  const handleLogSaved = () => {
    console.log("✅ Fuel log saved!");
    // You can also navigate after this or show a toast
  };

  return <FuelForm vehicleId={vehicleId} onLogSaved={handleLogSaved} />;
};

// Animation config
const fadeSlide = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

// Tabs
const MyVehicles = ({ activeTab }) =>
  activeTab === "vehicles" && (
    <AnimatePresence mode="wait">
      <motion.div key="vehicles" {...fadeSlide}>
        <VehicleList />
      </motion.div>
    </AnimatePresence>
  );

export default function App() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("vehicles");
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("motolog-dark-mode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("motolog-dark-mode", darkMode);
  }, [darkMode]);

  return (
    <Tooltip.Provider>
      
      <> 
        {(location.pathname !== "/" || user) && (
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} setDarkMode={setDarkMode} />
        )}
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            <Routes>
              {/* Homepage */}
              <Route
                path="/"
                element={
                  <>
                    <SignedIn>
                      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab}>
                        <MyVehicles activeTab={activeTab} />
                        <MyTrips activeTab={activeTab} />
                        <MyFuel activeTab={activeTab} />
                      </Sidebar>
                    </SignedIn>
                    <SignedOut>
                      <Homepage />
                    </SignedOut>
                  </>
                }
              />
              {/* Vehicles Route */}
              <Route
                path="/vehicles"
                element={
                  <Sidebar setActiveTab={setActiveTab} activeTab={activeTab}>
                    <MyVehicles activeTab="vehicles" />
                  </Sidebar>
                }
              />
              {/* Analytics Route */}
              <Route path="/analytics" element={
                <Sidebar setActiveTab={setActiveTab} activeTab={activeTab}>
                  <AnalyticsDashboard />
                </Sidebar>
              } />
              {/* Fuel Routes */}
              <Route path="/fuel-log/new/:vehicleId" element={<FuelFormWrapper />} />
              <Route path="/fuel-log/view/:vehicleId" element={<FuelLog />} />
              {/* Vehicle Routes */}
              <Route path="/vehicle/:vehicleId" element={<VehicleDetail />} />
              {/* Rideboard Route */}
              <Route path="/rideboard" element={
                <Sidebar setActiveTab={setActiveTab} activeTab={activeTab}>
                  <RideboardList />
                </Sidebar>
              } />
            </Routes>
          </div>
          <Footer />
        </div>
      </>
    </Tooltip.Provider>
  );
}
