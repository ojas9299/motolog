import React from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Welcome to Motolog</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl text-center">
        Motolog helps you manage your vehicles, track their details, and keep your records organized. Sign in to get started or view your vehicles.
      </p>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700 transition">Sign In</button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <button
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700 transition"
          onClick={() => navigate("/vehicles")}
        >
          View My Vehicles
        </button>
      </SignedIn>
    </div>
  );
};

export default Homepage; 