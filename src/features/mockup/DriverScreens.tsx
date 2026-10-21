import React, { useState } from "react";
import { useMockup } from "./MockupContext";
import { MockupMap } from "./MockupMap";
import {
  Car,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Lock,
  Phone,
  MessageSquare,
  CheckCircle2,
  Calendar,
  User,
  Star,
  Check,
  Upload,
  TrendingUp,
} from "lucide-react";

export const DriverScreens: React.FC = () => {
  const {
    driverScreen,
    setDriverScreen,
    setFlow,
    setStudentScreen,
    driverOnline,
    setDriverOnline,
    driverOnTripStep,
    setDriverOnTripStep,
    trip,
    setShowChatModal,
  } = useMockup();

  // Screen 2 tabs
  const [driverAuthTab, setDriverAuthTab] = useState<"login" | "signup">("login");
  const [driverMobile, setDriverMobile] = useState("+91 98765 43210");
  const [driverPassword, setDriverPassword] = useState("••••••••");

  // Screen 3 registration fields
  const [regName, setRegName] = useState("Suresh Patil");
  const [regPhone, setRegPhone] = useState("+91 98765 43210");
  const [regAuto, setRegAuto] = useState("MH 08 AB 1234");
  const [rcFileName, setRcFileName] = useState("rc_book_scan.jpg");

  // Screen 8 earnings tab
  const [earningsTab, setEarningsTab] = useState<"today" | "week" | "month">("today");

  /* =========================================================================
   * SCREEN 1: WELCOME (DRIVER SELECTED)
   * ========================================================================= */
  if (driverScreen === 1) {
    return (
      <div className="flex-1 flex flex-col justify-between relative bg-zinc-900 text-white min-h-[750px] p-6 overflow-hidden">
        {/* Background Image with dark gradient overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 z-0 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&auto=format&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/95 z-0" />

        {/* Content */}
        <div className="relative z-10 pt-16 flex flex-col items-center text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-3xl font-black shadow-2xl mb-1">
            🛺
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Ride <span className="text-amber-400">Mitra</span>
          </h1>
          <p className="text-xs font-semibold tracking-wider text-amber-200 uppercase">
            Partner with us and earn more
          </p>
        </div>

        {/* Role Selection */}
        <div className="relative z-10 space-y-3.5 pb-6">
          {/* I am a Student */}
          <button
            onClick={() => {
              setFlow("student");
              setStudentScreen(1);
            }}
            className="w-full p-4 rounded-2xl bg-white/95 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center gap-4 shadow-xl border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition text-left active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-base leading-tight">I am a Student</h3>
              <p className="text-xs text-zinc-500">Book an auto</p>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-400" />
          </button>

          {/* I am a Driver (Selected with Orange Highlight) */}
          <button
            onClick={() => setDriverScreen(2)}
            className="w-full p-4 rounded-2xl bg-white text-zinc-900 flex items-center gap-4 shadow-xl border-2 border-orange-500 hover:scale-[1.02] transition text-left active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-base leading-tight">I am a Driver</h3>
              <p className="text-xs text-zinc-500">Find passengers</p>
            </div>
            <ArrowRight className="w-5 h-5 text-orange-600" />
          </button>

          <p className="text-[11px] text-zinc-400 text-center pt-2">
            Lavel Stop ↔ Gharda Institute of Technology
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 2: DRIVER LOGIN / SIGN UP
   * ========================================================================= */
  if (driverScreen === 2) {
    return (
      <div className="flex-1 flex flex-col p-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <button
          onClick={() => setDriverScreen(1)}
          className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="space-y-1 mb-6">
          <h2 className="text-2xl font-black">Driver Login / Sign Up</h2>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-6">
          <button
            onClick={() => setDriverAuthTab("login")}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              driverAuthTab === "login" ? "bg-orange-500 text-white shadow-sm" : "text-zinc-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setDriverScreen(3)}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              driverAuthTab === "signup" ? "bg-orange-500 text-white shadow-sm" : "text-zinc-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={driverMobile}
                onChange={(e) => setDriverMobile(e.target.value)}
                placeholder="Mobile Number"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={driverPassword}
                onChange={(e) => setDriverPassword(e.target.value)}
                placeholder="Password"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="text-right">
              <button className="text-[11px] font-semibold text-orange-500 hover:underline">
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            onClick={() => setDriverScreen(4)}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-[0.98]"
          >
            Login
          </button>

          <div className="relative py-2 flex items-center justify-center">
            <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
            <span className="bg-white dark:bg-zinc-950 px-2 text-[11px] text-zinc-400 uppercase font-bold absolute">
              OR
            </span>
          </div>

          <button
            onClick={() => setDriverScreen(4)}
            className="w-full h-11 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex items-center justify-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50"
          >
            <span className="text-orange-500 font-black">G</span> Continue with Google
          </button>
        </div>

        <p className="text-xs text-center text-zinc-500 mt-auto pt-6">
          New here?{" "}
          <button onClick={() => setDriverScreen(3)} className="text-orange-500 font-bold hover:underline">
            Create an account
          </button>
        </p>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 3: DRIVER REGISTRATION
   * ========================================================================= */
  if (driverScreen === 3) {
    return (
      <div className="flex-1 flex flex-col p-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-y-auto">
        <button
          onClick={() => setDriverScreen(2)}
          className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="space-y-1 mb-5">
          <h2 className="text-2xl font-black">Driver Registration</h2>
          <p className="text-xs text-zinc-500">Complete your profile to start</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-zinc-500 block mb-1">Full Name</label>
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-500 block mb-1">Mobile Number</label>
            <input
              type="text"
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-500 block mb-1">Auto Number</label>
            <input
              type="text"
              value={regAuto}
              onChange={(e) => setRegAuto(e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold uppercase"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-500 block mb-1">Upload RC (Optional)</label>
            <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
              <span className="text-xs text-zinc-500 flex items-center gap-2">
                <Upload className="w-4 h-4" /> {rcFileName}
              </span>
              <button
                type="button"
                className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold rounded-lg"
              >
                Choose File
              </button>
            </div>
          </div>

          <button
            onClick={() => setDriverScreen(4)}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-md transition mt-6 active:scale-[0.98]"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 4: DRIVER HOME
   * ========================================================================= */
  if (driverScreen === 4) {
    return (
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {/* Top Online Switch Header */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                driverOnline ? "bg-emerald-500 animate-ping" : "bg-zinc-400"
              }`}
            />
            <span className="font-extrabold text-sm">
              {driverOnline ? "You are Online" : "You are Offline"}
            </span>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setDriverOnline(!driverOnline)}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              driverOnline ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                driverOnline ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Metrics Row */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center shadow-sm">
              <span className="text-xl font-black text-zinc-900 dark:text-zinc-100 block">5</span>
              <span className="text-[10px] text-zinc-400 font-bold">Today Rides</span>
            </div>

            <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center shadow-sm">
              <span className="text-xl font-black text-orange-500 block">₹150</span>
              <span className="text-[10px] text-zinc-400 font-bold">Today Earnings</span>
            </div>

            <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center shadow-sm">
              <span className="text-xl font-black text-amber-500 flex items-center justify-center gap-0.5">
                ★ 4.8
              </span>
              <span className="text-[10px] text-zinc-400 font-bold">Rating</span>
            </div>
          </div>
        </div>

        {/* New Ride Request Card */}
        {driverOnline && (
          <div className="px-4 pb-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border-2 border-orange-400 shadow-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-orange-500 uppercase tracking-wide">
                  New Ride Request
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">
                  ⏱ 25s
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Pickup</span>
                    <strong className="text-zinc-800 dark:text-zinc-100">{trip.pickup}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Drop</span>
                    <strong className="text-zinc-800 dark:text-zinc-100">{trip.drop}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                  ₹{trip.fare}
                </span>
                <span className="text-xs text-zinc-500 font-medium">~10 mins • 4.2 km</span>
              </div>

              {/* Reject / Accept Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setDriverOnline(false)}
                  className="h-11 rounded-xl border border-red-300 dark:border-red-800 text-red-600 font-bold text-xs hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => setDriverScreen(5)}
                  className="h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 5: RIDE DETAILS
   * ========================================================================= */
  if (driverScreen === 5) {
    return (
      <div className="flex-1 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div>
          {/* Header */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => setDriverScreen(4)}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-black text-sm">Ride Details</h3>
            <div className="w-8" />
          </div>

          <MockupMap autoPosition="middle" className="h-52" />

          {/* Trip Details Card */}
          <div className="p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Pickup</span>
                    <strong className="text-zinc-800 dark:text-zinc-100">{trip.pickup}</strong>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Drop</span>
                    <strong className="text-zinc-800 dark:text-zinc-100">{trip.drop}</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 block">Distance</span>
                  <span className="font-bold">{trip.distance}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 block">Estimated Time</span>
                  <span className="font-bold">{trip.estimatedTime}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Fare</span>
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                  ₹{trip.fare} (Fixed)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => {
              setDriverOnTripStep("reached_pickup");
              setDriverScreen(6);
            }}
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-[0.98]"
          >
            Accept Ride
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 6: ON TRIP (NAVIGATE TO PICKUP & ON TRIP)
   * ========================================================================= */
  if (driverScreen === 6) {
    return (
      <div className="flex-1 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div>
          {/* Header */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => setDriverScreen(5)}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-center">
              <h3 className="font-black text-sm">On Trip</h3>
              <p className="text-[10px] text-zinc-400">
                {driverOnTripStep === "reached_pickup" ? "Navigate to Pickup" : "In Progress"}
              </p>
            </div>
            <div className="w-8" />
          </div>

          <MockupMap autoPosition="middle" className="h-64" />

          {/* Contact Student Card */}
          <div className="p-4 space-y-4">
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-400 block font-bold uppercase">
                  Contact Student
                </span>
                <h4 className="font-extrabold text-sm">Rahul Sisode</h4>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:9123456789"
                  className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setShowChatModal(true)}
                  className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Step Progression Buttons */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          {driverOnTripStep === "reached_pickup" && (
            <button
              onClick={() => setDriverOnTripStep("start_trip")}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-md transition"
            >
              Reached Pickup
            </button>
          )}

          {driverOnTripStep === "start_trip" && (
            <button
              onClick={() => setDriverOnTripStep("complete_trip")}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition"
            >
              Start Trip
            </button>
          )}

          {driverOnTripStep === "complete_trip" && (
            <button
              onClick={() => setDriverScreen(7)}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm shadow-md transition"
            >
              Complete Trip
            </button>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 7: TRIP COMPLETED!
   * ========================================================================= */
  if (driverScreen === 7) {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <h2 className="text-xl font-black">Trip Completed!</h2>
            <div className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950 rounded-full border border-emerald-200">
              <span className="text-xl font-black text-emerald-600">₹{trip.fare}</span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 ml-1.5">
                Added to your earnings
              </span>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3.5">
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">Trip Details</h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-400 block">From</span>
                  <strong className="text-zinc-800 dark:text-zinc-100">{trip.pickup}</strong>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-400 block">To</span>
                  <strong className="text-zinc-800 dark:text-zinc-100">{trip.drop}</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">Fare</span>
                <span className="font-black text-base text-zinc-900 dark:text-zinc-100">
                  ₹{trip.fare}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block">Time</span>
                <span className="font-bold text-sm">{trip.estimatedTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-6">
          <button
            onClick={() => setDriverScreen(8)}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 8: DRIVER EARNINGS
   * ========================================================================= */
  if (driverScreen === 8) {
    return (
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => setDriverScreen(4)}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="font-black text-base">Earnings</h3>
          <div className="w-8" />
        </div>

        {/* Segmented Control */}
        <div className="p-4 pb-2">
          <div className="grid grid-cols-3 p-1 bg-zinc-200/80 dark:bg-zinc-800 rounded-xl">
            <button
              onClick={() => setEarningsTab("today")}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                earningsTab === "today" ? "bg-orange-500 text-white shadow" : "text-zinc-500"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setEarningsTab("week")}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                earningsTab === "week" ? "bg-orange-500 text-white shadow" : "text-zinc-500"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setEarningsTab("month")}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                earningsTab === "month" ? "bg-orange-500 text-white shadow" : "text-zinc-500"
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Total Earnings Card */}
        <div className="px-4 py-2">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase">Total Earnings</span>
              <h2 className="text-3xl font-black text-orange-500 mt-0.5">₹150</h2>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 font-black text-xs rounded-full">
                5 rides
              </span>
            </div>
          </div>
        </div>

        {/* Trip List */}
        <div className="p-4 space-y-2.5 flex-1 overflow-y-auto">
          {[
            { route: "Lavel ➔ GIT", fare: "₹30", time: "09:15 AM" },
            { route: "GIT ➔ Lavel", fare: "₹30", time: "08:45 AM" },
            { route: "Lavel ➔ GIT", fare: "₹30", time: "08:10 AM" },
            { route: "GIT ➔ Lavel", fare: "₹30", time: "07:35 AM" },
            { route: "Lavel ➔ Hostel", fare: "₹30", time: "07:05 AM" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{item.route}</p>
                <p className="text-[10px] text-zinc-400">{item.time}</p>
              </div>
              <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">{item.fare}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
