import React, { useState } from "react";
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
} from "react-router-dom";

// Components & Pages
import Sidebar from "./components/Sidebar";
import VehicleList from "./components/vehicle/VehicleList";
import MyTrips from "./components/trip/MyTrips";
import MyFuel from "./components/fuel/MyFuel";
import FuelForm from "./components/fuel/FuelForm";
import FuelLog from "./components/fuel/FuelLog";

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

  return (
    <Routes>
      {/* Main Dashboard with Tabs */}
      <Route
        path="/"
        element={
          <>
            {/* Header */}
            <header className="p-4 flex justify-between items-center bg-white shadow">
              <div className="font-bold text-xl">Motolog</div>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </header>

            {/* Signed-in layout */}
            <SignedIn>
              <Sidebar setActiveTab={setActiveTab} activeTab={activeTab}>
                <MyVehicles activeTab={activeTab} />
                <MyTrips activeTab={activeTab} />
                <MyFuel activeTab={activeTab} />
              </Sidebar>
            </SignedIn>

            {/* Guest layout */}
            <SignedOut>
              <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-3xl font-bold mb-4">Welcome to Motolog</h1>
                <SignInButton mode="modal">
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700 transition">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
          </>
        }
      />

      {/* Fuel Routes */}
      <Route path="/fuel-log/new/:vehicleId" element={<FuelFormWrapper />} />
      <Route path="/fuel-log/view/:vehicleId" element={<FuelLog />} />
    </Routes>
  );
}
