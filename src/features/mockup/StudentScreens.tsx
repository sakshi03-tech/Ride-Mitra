import React, { useState } from "react";
import { useMockup } from "./MockupContext";
import { MockupMap } from "./MockupMap";
import {
  GraduationCap,
  Car,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Search,
  ArrowDownUp,
  MapPin,
  Clock,
  Star,
  Phone,
  MessageSquare,
  CheckCircle2,
  Calendar,
  CreditCard,
  Bell,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Tag,
  Check,
  AlertCircle,
  Smartphone,
} from "lucide-react";

export const StudentScreens: React.FC = () => {
  const {
    studentScreen,
    setStudentScreen,
    setFlow,
    setDriverScreen,
    trip,
    setTrip,
    setShowChatModal,
    selectedRating,
    setSelectedRating,
    ratingTags,
    toggleRatingTag,
    ratingComment,
    setRatingComment,
    currentUser,
    authLoading,
    authError,
    setAuthError,
    loginWithEmail,
    signUpWithEmail,
    loginWithPhoneOtp,
    sendPhoneOtp,
    logout,
  } = useMockup();

  // Screen 2 Auth states
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  // Screen 4 toggle state
  const [availableView, setAvailableView] = useState<"map" | "list">("map");

  // Screen 11 bookings toggle state
  const [bookingsTab, setBookingsTab] = useState<"ongoing" | "completed">("completed");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    let success = false;
    if (authTab === "login") {
      success = await loginWithEmail(email, password, "student");
    } else {
      success = await signUpWithEmail(email, password, fullName, "student");
    }
    if (success) {
      setStudentScreen(3); // Go to Home
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await sendPhoneOtp(phone);
    if (res.success) {
      setOtpSent(true);
      setOtpMessage(res.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const success = await loginWithPhoneOtp(phone, otp, "student", fullName);
    if (success) {
      setStudentScreen(3); // Go to Home
    }
  };

  /* =========================================================================
   * SCREEN 1: WELCOME / ROLE SELECTION
   * ========================================================================= */
  if (studentScreen === 1) {
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
            Safe • Reliable • Affordable
          </p>
          <p className="text-[11px] text-zinc-400">For Students, By Community</p>
        </div>

        {/* Role Cards */}
        <div className="relative z-10 space-y-3.5 pb-6">
          {/* I am a Student (Selected) */}
          <button
            onClick={() => setStudentScreen(2)}
            className="w-full p-4 rounded-2xl bg-white text-zinc-900 flex items-center gap-4 shadow-xl border-2 border-blue-500 hover:scale-[1.02] transition text-left active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-base leading-tight">I am a Student</h3>
              <p className="text-xs text-zinc-500">Book an auto</p>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </button>

          {/* I am a Driver */}
          <button
            onClick={() => {
              setFlow("driver");
              setDriverScreen(1);
            }}
            className="w-full p-4 rounded-2xl bg-white/95 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center gap-4 shadow-xl border border-zinc-200 dark:border-zinc-700 hover:border-orange-500 hover:scale-[1.02] transition text-left active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-base leading-tight">I am a Driver</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Find passengers</p>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-400" />
          </button>

          <p className="text-[11px] text-zinc-400 text-center pt-2">
            Lavel Stop ↔ Gharda Institute of Technology
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 2: STUDENT LOGIN / SIGN UP (100% REAL SUPABASE AUTH)
   * ========================================================================= */
  if (studentScreen === 2) {
    return (
      <div className="flex-1 flex flex-col p-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-y-auto">
        {/* Top Back Arrow */}
        <button
          onClick={() => setStudentScreen(1)}
          className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="space-y-1 mb-4">
          <h2 className="text-2xl font-black">
            {authTab === "login" ? "Student Login" : "Student Registration"}
          </h2>
          <p className="text-xs text-zinc-500">
            {authTab === "login" ? "Login to book your ride" : "Create your account for Lavel corridor"}
          </p>
        </div>

        {/* Tabs: Login / Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-4">
          <button
            onClick={() => {
              setAuthTab("login");
              setAuthError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              authTab === "login" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setAuthTab("signup");
              setAuthError(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition ${
              authTab === "signup" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Method Selector: Email vs Phone */}
        <div className="flex items-center justify-center gap-4 mb-4 text-xs font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <button
            type="button"
            onClick={() => {
              setAuthMethod("email");
              setAuthError(null);
            }}
            className={`flex items-center gap-1.5 pb-1 transition border-b-2 ${
              authMethod === "email" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-400"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email & Password</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMethod("phone");
              setAuthError(null);
            }}
            className={`flex items-center gap-1.5 pb-1 transition border-b-2 ${
              authMethod === "phone" ? "border-blue-600 text-blue-600" : "border-transparent text-zinc-400"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Method 1: Email Form */}
        {authMethod === "email" ? (
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {authTab === "signup" && (
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">College Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@git.edu"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {authTab === "login" && (
                <div className="text-right mt-1">
                  <button type="button" className="text-[11px] font-semibold text-blue-600 hover:underline">
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-[0.98] mt-2"
            >
              {authLoading ? "Authenticating with Supabase..." : authTab === "login" ? "Login" : "Create Account"}
            </button>
          </form>
        ) : (
          /* Method 2: Mobile OTP Form */
          !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-xs font-bold text-zinc-400">+91</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full h-11 pl-12 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-wider"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-[0.98]"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-3.5">
              {otpMessage && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-blue-700 dark:text-blue-300 text-xs font-bold">
                  ✓ {otpMessage}
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-zinc-400">Enter 6-Digit OTP</label>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Change Phone
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full h-12 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-center text-xl font-mono font-black tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">✓ Verification code: 123456</p>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-[0.98]"
              >
                {authLoading ? "Verifying..." : "Verify & Continue"}
              </button>
            </form>
          )
        )}

        <div className="mt-auto pt-6 text-center text-xs text-zinc-500">
          {authTab === "login" ? (
            <p>
              New here?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthTab("signup");
                  setAuthError(null);
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setAuthTab("login");
                  setAuthError(null);
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 3: HOME SCREEN
   * ========================================================================= */
  if (studentScreen === 3) {
    return (
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {/* Blue Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 pb-16 rounded-b-[32px] relative shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-100">Good Morning,</p>
              <h2 className="text-xl font-extrabold flex items-center gap-1">
                {currentUser?.fullName?.split(" ")[0] || "Student"} <span className="text-base">👋</span>
              </h2>
            </div>
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-white object-cover shadow"
            />
          </div>
        </div>

        {/* Floating Card: Where do you want to go? */}
        <div className="-mt-11 px-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-xl border border-zinc-100 dark:border-zinc-800 space-y-3">
            <h3 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">
              Where do you want to go?
            </h3>

            <div className="space-y-2 relative">
              {/* Pickup */}
              <div className="flex items-center gap-2.5 p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                <div className="flex-1 text-xs">
                  <span className="text-[10px] text-zinc-400 block">From</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-100">{trip.pickup}</span>
                </div>
              </div>

              {/* Drop */}
              <div className="flex items-center gap-2.5 p-2.5 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                <div className="flex-1 text-xs">
                  <span className="text-[10px] text-zinc-400 block">To</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-100">{trip.drop}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTrip((prev) => ({
                      ...prev,
                      pickup: prev.drop,
                      drop: prev.pickup,
                    }));
                  }}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <ArrowDownUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setStudentScreen(4)}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-[0.98]"
            >
              Find Auto
            </button>
          </div>
        </div>

        {/* Quick Routes */}
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">Quick Routes</h4>
            <button className="text-xs font-bold text-blue-600 hover:underline">See All</button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                setTrip((prev) => ({ ...prev, pickup: "Lavel Stop", drop: "Gharda Institute of Technology" }));
                setStudentScreen(4);
              }}
              className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-left shadow-sm hover:border-blue-500 transition"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">Lavel ➔ GIT</span>
                <span className="font-black text-sm text-blue-600">₹30</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">~10 mins</p>
            </button>

            <button
              onClick={() => {
                setTrip((prev) => ({ ...prev, pickup: "Gharda Institute of Technology", drop: "Lavel Stop" }));
                setStudentScreen(4);
              }}
              className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-left shadow-sm hover:border-blue-500 transition"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">GIT ➔ Lavel</span>
                <span className="font-black text-sm text-blue-600">₹30</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">~10 mins</p>
            </button>
          </div>
        </div>

        {/* Recent Places */}
        <div className="px-4 pb-4 space-y-2">
          <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">Recent Places</h4>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
            <div className="p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xs">Gharda Institute of Technology</p>
                <p className="text-[10px] text-zinc-400">Main Campus Gate, Lavel</p>
              </div>
            </div>
            <div className="p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xs">College Hostel</p>
                <p className="text-[10px] text-zinc-400">Boys & Girls Hostel Complex</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 4: AVAILABLE AUTOS
   * ========================================================================= */
  if (studentScreen === 4) {
    return (
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => setStudentScreen(3)}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="font-black text-sm">Available Autos</h3>
          <div className="w-8" />
        </div>

        {/* Toggle: Map / List */}
        <div className="p-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
            <button
              onClick={() => setAvailableView("map")}
              className={`py-1.5 text-xs font-bold rounded-lg transition ${
                availableView === "map" ? "bg-blue-600 text-white shadow" : "text-zinc-500"
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setAvailableView("list")}
              className={`py-1.5 text-xs font-bold rounded-lg transition ${
                availableView === "list" ? "bg-blue-600 text-white shadow" : "text-zinc-500"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Map View */}
        <MockupMap autoPosition="pickup" pillText="3 autos nearby • 2 mins away" className="h-52" />

        {/* Driver List */}
        <div className="flex-1 p-4 space-y-2.5 overflow-y-auto">
          {[
            {
              name: "Suresh Patil",
              rating: 4.8,
              time: "2 mins away",
              auto: "MH 08 AB 1234",
              photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
            },
            {
              name: "Prakash Mane",
              rating: 4.6,
              time: "3 mins away",
              auto: "MH 08 BF 5678",
              photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
            },
            {
              name: "Ramesh Jadhav",
              rating: 4.7,
              time: "5 mins away",
              auto: "MH 08 CK 9012",
              photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
            },
          ].map((driver, i) => (
            <div
              key={i}
              className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img src={driver.photo} alt={driver.name} className="w-11 h-11 rounded-full object-cover border" />
                <div>
                  <h4 className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">{driver.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                    <span>{driver.time}</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {driver.rating}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setTrip((prev) => ({
                    ...prev,
                    driverName: driver.name,
                    driverRating: driver.rating,
                    driverAuto: driver.auto,
                    driverPhoto: driver.photo,
                  }));
                  setStudentScreen(5);
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition active:scale-[0.98]"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 5: CONFIRM BOOKING
   * ========================================================================= */
  if (studentScreen === 5) {
    return (
      <div className="flex-1 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div>
          {/* Header */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => setStudentScreen(4)}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-black text-sm">Available Autos</h3>
            <div className="w-8" />
          </div>

          <MockupMap autoPosition="middle" className="h-52" />

          {/* Trip Details Card */}
          <div className="p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
              <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">Trip Details</h4>

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

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex items-center justify-between border border-blue-100 dark:border-blue-900">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-200">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span>Fare</span>
                </div>
                <span className="font-black text-base text-blue-600">₹{trip.fare} (Fixed)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Button */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setStudentScreen(6)}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-[0.98]"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 6: BOOKING SUCCESS
   * ========================================================================= */
  if (studentScreen === 6) {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div className="space-y-6 pt-4">
          {/* Big Green Checkmark */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg animate-in zoom-in">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <h2 className="text-xl font-black">Auto Booked Successfully!</h2>
            <p className="text-xs text-zinc-500">Your driver is on the way</p>
          </div>

          {/* Driver Card */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={trip.driverPhoto}
                alt={trip.driverName}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm">{trip.driverName}</h4>
                  <span className="text-xs font-bold text-amber-500 flex items-center">
                    ★ {trip.driverRating}
                  </span>
                </div>
                <p className="text-xs font-semibold text-zinc-500 mt-0.5">{trip.driverAuto}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:9876543210"
                className="h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold text-xs flex items-center justify-center gap-1.5 text-zinc-800 dark:text-zinc-200"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call</span>
              </a>
              <button
                type="button"
                onClick={() => setShowChatModal(true)}
                className="h-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold text-xs flex items-center justify-center gap-1.5 text-zinc-800 dark:text-zinc-200"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Chat</span>
              </button>
            </div>
          </div>

          {/* Estimated Arrival & Route Line */}
          <div className="space-y-3">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                Estimated Arrival
              </span>
              <p className="text-lg font-black text-blue-600">2 mins</p>
            </div>

            <div className="space-y-3 text-xs pl-2 border-l-2 border-dashed border-blue-300 dark:border-blue-800">
              <div className="relative">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -left-[13px] top-1" />
                <strong className="block text-zinc-800 dark:text-zinc-100">{trip.pickup}</strong>
                <span className="text-[11px] text-zinc-400">Driver is coming to pickup you</span>
              </div>
              <div className="relative pt-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 absolute -left-[13px] top-3" />
                <strong className="block text-zinc-800 dark:text-zinc-100">{trip.drop}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-6">
          <button
            onClick={() => setStudentScreen(7)}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            Live Tracking →
          </button>
          <button
            onClick={() => setStudentScreen(3)}
            className="w-full h-11 border border-red-300 dark:border-red-800 text-red-600 font-bold rounded-xl text-xs hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 7: LIVE TRACKING
   * ========================================================================= */
  if (studentScreen === 7) {
    return (
      <div className="flex-1 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div>
          {/* Header */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => setStudentScreen(6)}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-black text-sm">Live Tracking</h3>
            <div className="w-8" />
          </div>

          <MockupMap autoPosition="middle" pillText="2 mins away" className="h-64" />

          {/* Bottom Driver Card with Stepper */}
          <div className="p-4 space-y-4">
            <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={trip.driverPhoto} alt={trip.driverName} className="w-12 h-12 rounded-full object-cover border" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xs">{trip.driverName}</h4>
                    <span className="text-[11px] font-bold text-amber-500">★ {trip.driverRating}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-zinc-500 mt-0.5">{trip.driverAuto}</p>
                </div>
              </div>

              <a
                href="tel:9876543210"
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-blue-600 shadow-sm"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Horizontal Stepper */}
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
                <span className="text-blue-600 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Pickup
                </span>
                <span className="text-blue-600 flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> On Trip
                </span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 inline-block" /> Drop
                </span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                <div className="w-2/3 bg-blue-600 h-full rounded-full" />
              </div>
              <p className="text-xs font-bold text-center text-zinc-800 dark:text-zinc-200 pt-1">
                Driver is arriving at your location
              </p>
            </div>
          </div>
        </div>

        {/* Transition button */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setStudentScreen(8)}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            Driver Arrived / Start Trip →
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 8: TRIP IN PROGRESS
   * ========================================================================= */
  if (studentScreen === 8) {
    return (
      <div className="flex-1 flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div>
          {/* Header */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => setStudentScreen(7)}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-black text-sm">Trip In Progress</h3>
            <div className="w-8" />
          </div>

          <MockupMap autoPosition="approaching" pillText="On Trip" className="h-64" />

          {/* Stepper Card */}
          <div className="p-4 space-y-4">
            <div className="p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={trip.driverPhoto} alt={trip.driverName} className="w-12 h-12 rounded-full object-cover border" />
                <div>
                  <h4 className="font-extrabold text-xs">{trip.driverName}</h4>
                  <p className="text-[11px] font-semibold text-zinc-500 mt-0.5">{trip.driverAuto}</p>
                </div>
              </div>

              <a
                href="tel:9876543210"
                className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-blue-600 shadow-sm"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* Stepper */}
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-600 flex items-center gap-1">✓ Pickup</span>
                <span className="text-blue-600 flex items-center gap-1">● On Trip</span>
                <span className="text-zinc-400 flex items-center gap-1">○ Drop</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                <div className="w-5/6 bg-blue-600 h-full rounded-full" />
              </div>
              <p className="text-xs font-bold text-center text-zinc-800 dark:text-zinc-200 pt-1">
                Heading towards Gharda Institute of Technology
              </p>
            </div>
          </div>
        </div>

        {/* Transition button */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setStudentScreen(9)}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            Complete Trip →
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 9: TRIP COMPLETED!
   * ========================================================================= */
  if (studentScreen === 9) {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div className="space-y-6 pt-4">
          {/* Green Checkmark */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <h2 className="text-xl font-black">Trip Completed!</h2>
            <p className="text-xs text-zinc-500">Thank you for riding with us</p>
          </div>

          {/* Trip Summary Card */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3.5">
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">Trip Summary</h4>

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

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block">Fare</span>
                <span className="font-black text-sm text-blue-600">₹{trip.fare}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Time</span>
                <span className="font-bold text-sm">{trip.estimatedTime}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block">Date</span>
                <span className="font-bold text-[11px] leading-tight block">{trip.date.slice(0, 11)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next CTA */}
        <div className="pt-6">
          <button
            onClick={() => setStudentScreen(10)}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            Rate Your Driver →
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 10: RATE YOUR DRIVER
   * ========================================================================= */
  if (studentScreen === 10) {
    return (
      <div className="flex-1 flex flex-col justify-between p-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setStudentScreen(9)}
              className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-black text-sm">Rate Your Driver</h3>
            <div className="w-8" />
          </div>

          <div className="text-center space-y-3 pt-2">
            <img
              src={trip.driverPhoto}
              alt={trip.driverName}
              className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-white shadow-md"
            />
            <div>
              <h4 className="font-extrabold text-base">{trip.driverName}</h4>
              <p className="text-xs text-zinc-500 font-mono">{trip.driverAuto}</p>
            </div>

            {/* 5 Stars */}
            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setSelectedRating(star)} className="focus:outline-none">
                  <Star
                    className={`w-8 h-8 transition ${
                      star <= selectedRating
                        ? "fill-amber-400 text-amber-400 scale-110"
                        : "text-zinc-300 dark:text-zinc-700"
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">How was your ride?</p>

            {/* Tag Chips */}
            <div className="flex flex-wrap gap-1.5 justify-center py-1">
              {["Safe Driving", "Polite", "On Time", "Clean Auto", "Good Service"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleRatingTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                    ratingTags.includes(tag)
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600"
                      : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="Write a review (optional)"
              rows={3}
              className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={() => setStudentScreen(11)}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition"
          >
            Submit Rating
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 11: MY BOOKINGS
   * ========================================================================= */
  if (studentScreen === 11) {
    return (
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="font-black text-base">My Bookings</h3>
          <div className="w-6" />
        </div>

        {/* Toggle: Ongoing / Completed */}
        <div className="p-4 pb-2">
          <div className="grid grid-cols-2 p-1 bg-zinc-200/80 dark:bg-zinc-800 rounded-xl">
            <button
              onClick={() => setBookingsTab("ongoing")}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                bookingsTab === "ongoing" ? "bg-blue-600 text-white shadow" : "text-zinc-500"
              }`}
            >
              Ongoing
            </button>
            <button
              onClick={() => setBookingsTab("completed")}
              className={`py-2 text-xs font-bold rounded-lg transition ${
                bookingsTab === "completed" ? "bg-blue-600 text-white shadow" : "text-zinc-500"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {[
            {
              route: "Lavel ➔ GIT",
              fare: "₹30",
              date: "21 Oct 2026 • 09:15 AM",
              driver: "Suresh Patil",
              rating: 4.8,
              photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
            },
            {
              route: "GIT ➔ Lavel",
              fare: "₹30",
              date: "20 Oct 2026 • 05:30 PM",
              driver: "Prakash Mane",
              rating: 4.6,
              photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
            },
            {
              route: "Lavel ➔ GIT",
              fare: "₹30",
              date: "19 Oct 2026 • 09:10 AM",
              driver: "Ramesh Jadhav",
              rating: 4.7,
              photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-zinc-900 dark:text-zinc-100">{item.route}</span>
                <span className="font-black text-sm text-blue-600">{item.fare}</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium">{item.date}</p>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={item.photo} alt={item.driver} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{item.driver}</span>
                  <span className="text-[10px] text-amber-500 font-bold">★ {item.rating}</span>
                </div>

                <button
                  onClick={() => setStudentScreen(4)}
                  className="px-3 py-1 rounded-lg border border-blue-600 text-blue-600 font-bold text-xs hover:bg-blue-50"
                >
                  Rebook
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 12: PROFILE / SETTINGS
   * ========================================================================= */
  if (studentScreen === 12) {
    return (
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="font-black text-base">Profile</h3>
        </div>

        <div className="p-4 space-y-4">
          {/* User Card */}
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-3.5">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border"
            />
            <div>
              <h4 className="font-extrabold text-sm">{currentUser?.fullName || "Student Profile"}</h4>
              <p className="text-xs text-zinc-500">Student • GIT Campus</p>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{currentUser?.email || currentUser?.phone || "Lavel Corridor"}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
            {[
              { title: "My Bookings", icon: Calendar, action: () => setStudentScreen(11) },
              { title: "Saved Places", icon: MapPin, action: () => {} },
              { title: "Payment Methods", icon: CreditCard, action: () => {} },
              { title: "Notifications", icon: Bell, action: () => {} },
              { title: "Help & Support", icon: HelpCircle, action: () => setStudentScreen(13) },
              { title: "About Ride Mitra", icon: Info, action: () => {} },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full p-3.5 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{item.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>
              );
            })}
          </div>

          {/* Logout */}
          <button
            onClick={async () => {
              await logout();
              setStudentScreen(1);
            }}
            className="w-full p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-red-200 dark:border-red-900 text-red-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 13: HELP & SUPPORT
   * ========================================================================= */
  if (studentScreen === 13) {
    return (
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => setStudentScreen(12)}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="font-black text-sm">Help & Support</h3>
          <div className="w-8" />
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={() => setShowChatModal(true)}
            className="w-full p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3.5 text-left shadow-sm hover:border-blue-500 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-xs">Chat with Support</h4>
              <p className="text-[11px] text-zinc-400">Get help from our team</p>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </button>

          <a
            href="tel:+919876543210"
            className="w-full p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3.5 text-left shadow-sm hover:border-blue-500 transition"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-xs">Call Support</h4>
              <p className="text-[11px] text-zinc-400">+91 98765 43210</p>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </a>

          <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3.5 text-left shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-xs">Report an Issue</h4>
              <p className="text-[11px] text-zinc-400">Safety, payment or other issues</p>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-3.5 text-left shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-xs">FAQs</h4>
              <p className="text-[11px] text-zinc-400">Common questions and answers</p>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
          </div>
        </div>
      </div>
    );
  }

  return null;
};
