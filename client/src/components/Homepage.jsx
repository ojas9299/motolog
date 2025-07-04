import React from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import BlurText from "../reactbits/BlurText";
import Aurora from "../reactbits/Aurora";
import SpotlightCard from "../reactbits/SpotlightCard"
import { Car, Route, Map, UserCheck, RefreshCw, MapPin, History, User, UserPlus } from "lucide-react";
import StarBorder from "../reactbits/StarBorder"
import RotatingText from "../reactbits/RotatingText"
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden">
      {/* Aurora background, fixed and behind all content */}
      <div className="absolute top-0 left-0 w-full h-[600px] z-10 pointer-events-none ">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.9}
          amplitude={0.9}
          speed={0.8}
        />
      </div>
      {/* Foreground Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen text-center mt-40 sm:mt-60 px-2 sm:px-0">
        <BlurText
          text="Welcome to"
          delay={100}
          animateBy="words"
          direction="top"
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 z-20"
        />
        <div className="flex flex-col sm:flex-row items-center justify-center my-6 sm:my-8 overflow-hidden w-full" style={{height: 'min-content'}}>
          <span className="text-6xl xs:text-6xl sm:text-6xl md:text-7xl font-extrabold text-white mr-0 sm:mr-4 select-none">MotoLog</span>
          <RotatingText
            texts={["Intuitive", "Powerful", "Flexible", "Reliable", "Effortless", "Seamless"]}
            mainClassName="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-bold text-indigo-300 px-2 sm:px-2 md:px-3 overflow-hidden py-2 sm:py-3 md:py-4 justify-center rounded-lg z-20"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.02}
            splitLevelClassName="overflow-hidden pb-1 sm:pb-2 md:pb-2 pt-1 sm:pt-2 md:pt-2"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={3000}
          />
        </div>

        <SignedOut>
          <div className="absolute top-4 right-4 z-50 w-64 max-w-full bg-neutral-900/90 border border-pink-400 rounded-xl p-4 text-left shadow-lg hidden sm:block">
            <div className="font-bold text-pink-400 mb-2 text-center">Demo Credentials for Testing</div>
            <div className="text-white text-sm"><span className="font-semibold">Email:</span> bhalerao.hgfdk22@sinhgad.edu</div>
            <div className="text-white text-sm"><span className="font-semibold">Password:</span> democreds@123</div>
          </div>
          {/* For mobile, show at top of content */}
          <div className="w-full max-w-xs mx-auto mb-4 bg-neutral-900/80 border border-pink-400 rounded-xl p-4 text-left block sm:hidden">
            <div className="font-bold text-pink-400 mb-2 text-center">Demo Credentials for Testing</div>
            <div className="text-white text-sm"><span className="font-semibold">Email:</span> bhalerao.hgfdk22@sinhgad.edu</div>
            <div className="text-white text-sm"><span className="font-semibold">Password:</span> democreds@123</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <SignInButton mode="modal">
              <StarBorder
                as="button"
                className="text-base font-semibold px-5 py-2 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                color="#00008B"
                speed="4s"
                thickness="3"
              >
                <User size={18} className="-ml-1" />
                Sign In
              </StarBorder>
            </SignInButton>
            <SignUpButton mode="modal">
              <StarBorder
                as="button"
                className="text-base font-semibold px-5 py-2 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                color="#3021bc"
                speed="4s"
                thickness="3"
              >
                <UserPlus size={18} className="-ml-1" />
                Sign Up
              </StarBorder>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <button
            className="pointer-events-auto px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg hover:bg-indigo-700 transition z-20"
            onClick={() => navigate("/vehicles")}
          >
            View My Vehicles
          </button>
        </SignedIn>

        {/* Features Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-xs xs:max-w-sm sm:max-w-2xl lg:max-w-5xl mx-auto px-2 sm:px-0">
          <SpotlightCard spotlightColor="rgba(48, 33, 188, 0.4)">
            <div className="flex flex-col items-center justify-center p-3 sm:p-4">
              <Car size={28} className="mb-2 text-indigo-300" />
              <h2 className="text-lg font-bold mb-1 text-indigo-200">Vehicle Management</h2>
              <p className="text-indigo-100 text-center text-sm">Effortlessly organize every ride. Add, edit, and manage your vehicles in one place.</p>
            </div>
          </SpotlightCard>
          <SpotlightCard spotlightColor="rgba(48, 33, 188, 0.4)">
            <div className="flex flex-col items-center justify-center p-3 sm:p-4">
              <Route size={28} className="mb-2 text-indigo-300" />
              <h2 className="text-lg font-bold mb-1 text-indigo-200">Trip Logging</h2>
              <p className="text-indigo-100 text-center text-sm">Track every journey, automatically. Logging trips is as easy as hitting the road.</p>
            </div>
          </SpotlightCard>
          <SpotlightCard spotlightColor="rgba(48, 33, 188, 0.4)">
            <div className="flex flex-col items-center justify-center p-3 sm:p-4">
              <Map size={28} className="mb-2 text-indigo-300" />
              <h2 className="text-lg font-bold mb-1 text-indigo-200">Interactive Maps</h2>
              <p className="text-indigo-100 text-center text-sm">See your routes come alive. Visualize every trip with beautiful, interactive maps.</p>
            </div>
          </SpotlightCard>
          <SpotlightCard spotlightColor="rgba(48, 33, 188, 0.4)">
            <div className="flex flex-col items-center justify-center p-3 sm:p-4">
              <UserCheck size={28} className="mb-2 text-indigo-300" />
              <h2 className="text-lg font-bold mb-1 text-indigo-200">User Authentication</h2>
              <p className="text-indigo-100 text-center text-sm">Your data, protected. Sign in securely and enjoy a personalized experience.</p>
            </div>
          </SpotlightCard>
          <SpotlightCard spotlightColor="rgba(48, 33, 188, 0.4)">
            <div className="flex flex-col items-center justify-center p-3 sm:p-4">
              <RefreshCw size={28} className="mb-2 text-indigo-300" />
              <h2 className="text-lg font-bold mb-1 text-indigo-200">Real-time Updates</h2>
              <p className="text-indigo-100 text-center text-sm">Stay in sync, everywhere. Your logs and vehicles update instantly across devices.</p>
            </div>
          </SpotlightCard>
          <SpotlightCard spotlightColor="rgba(48, 33, 188, 0.4)">
            <div className="flex flex-col items-center justify-center p-3 sm:p-4">
              <MapPin size={28} className="mb-2 text-indigo-300" />
              <h2 className="text-lg font-bold mb-1 text-indigo-200">Automatic Geocoding</h2>
              <p className="text-indigo-100 text-center text-sm">Smart locations, zero hassle. Get real-time distance and location for every trip.</p>
            </div>
          </SpotlightCard>
        </div>

        <div className="h-12 sm:h-16 md:h-20" />
        <section className="max-w-xs xs:max-w-sm sm:max-w-2xl lg:max-w-5xl mx-auto mt-0 mb-20 w-full px-2 sm:px-4 py-10 sm:py-14 bg-neutral-950/80 rounded-2xl shadow-lg">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-center text-white mb-8 sm:mb-10">Frequently Asked Questions</h2>
          <Accordion.Root type="single" collapsible className="space-y-6">
            <Accordion.Item value="q1" className="bg-neutral-900/80 border border-neutral-700 rounded-xl">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-base sm:text-lg font-semibold text-indigo-300 hover:bg-neutral-800 rounded-xl transition">
                  What is Motolog?
                  <ChevronDownIcon className="ml-2 h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pt-4 pb-8 text-indigo-100 text-base leading-relaxed">
                Motolog is a modern, full-featured web app for logging, tracking, and visualizing your vehicle trips. Effortlessly manage all your rides, view detailed trip histories, and enjoy interactive maps—all in one intuitive dashboard. Motolog is designed for both casual drivers and enthusiasts who want to keep their vehicle life organized and insightful.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="q2" className="bg-neutral-900/80 border border-neutral-700 rounded-xl">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-base sm:text-lg font-semibold text-indigo-300 hover:bg-neutral-800 rounded-xl transition">
                  Is my data secure?
                  <ChevronDownIcon className="ml-2 h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pt-4 pb-8 text-indigo-100 text-base leading-relaxed">
                Absolutely. Your data is protected with industry-standard authentication and privacy-first design. All your logs and vehicles are encrypted and only accessible by you. Motolog never shares your data with third parties, and you can export or delete your data at any time.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="q3" className="bg-neutral-900/80 border border-neutral-700 rounded-xl">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-base sm:text-lg font-semibold text-indigo-300 hover:bg-neutral-800 rounded-xl transition">
                  Can I use Motolog on mobile?
                  <ChevronDownIcon className="ml-2 h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pt-4 pb-8 text-indigo-100 text-base leading-relaxed">
                Yes! Motolog is fully responsive and works beautifully on any device—phone, tablet, or desktop. You can log trips, view analytics, and manage your vehicles from anywhere. The interface is optimized for touch and mouse, so you get a seamless experience everywhere.
              </Accordion.Content>
            </Accordion.Item>
            <Accordion.Item value="q4" className="bg-neutral-900/80 border border-neutral-700 rounded-xl">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-base sm:text-lg font-semibold text-indigo-300 hover:bg-neutral-800 rounded-xl transition">
                  How do I get started?
                  <ChevronDownIcon className="ml-2 h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pt-4 pb-8 text-indigo-100 text-base leading-relaxed">
                Getting started is easy! Just sign up for a free account, add your vehicles, and start logging your trips. Motolog guides you through every step, and you can explore analytics, maps, and more right from your dashboard. If you ever need help, our support is just a click away.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </section>
      </div>
    </div>
  );
};

export default Homepage;
