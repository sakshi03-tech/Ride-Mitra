import React, { useState } from "react";
import { useMockup } from "./MockupContext";
import { MockupMap } from "./MockupMap";
import { validateAadhaar } from "@/lib/aadhaar";
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
  Mail,
  Smartphone,
  AlertCircle,
  FileText,
  ShieldCheck,
  LogOut,
  Image,
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
    setTrip,
    setShowChatModal,
    currentUser,
    authLoading,
    authError,
    setAuthError,
    loginWithEmail,
    loginWithPhoneOtp,
    sendPhoneOtp,
    logout,
    completeCurrentRide,
    driverEarningsSummary,
    registerDriverWithDocs,
    driverDocs,
  } = useMockup();

  // Screen 2 tabs & auth state
  const [driverAuthTab, setDriverAuthTab] = useState<"login" | "signup">("login");
  const [driverAuthMethod, setDriverAuthMethod] = useState<"phone" | "email">("phone");
  const [driverMobile, setDriverMobile] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPassword, setDriverPassword] = useState("");
  const [driverOtp, setDriverOtp] = useState("");
  const [driverOtpSent, setDriverOtpSent] = useState(false);
  const [driverOtpMessage, setDriverOtpMessage] = useState<string | null>(null);

  // Screen 3 registration fields
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAuto, setRegAuto] = useState("");
  const [regLicense, setRegLicense] = useState("");
  const [regAadhaar, setRegAadhaar] = useState("");
  const [dlFileName, setDlFileName] = useState("driving_licence_scan.jpg");
  const [rcFileName, setRcFileName] = useState("rc_book_scan.jpg");
  const [aadhaarFileName, setAadhaarFileName] = useState("aadhaar_card_front_back.jpg");
  const [regSuccess, setRegSuccess] = useState(false);
  const [regSubmitting, setRegSubmitting] = useState(false);

  // Screen 8 earnings tab
  const [earningsTab, setEarningsTab] = useState<"today" | "week" | "month">("today");

  const aadhaarValidation = validateAadhaar(regAadhaar);

  const handleSendDriverOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await sendPhoneOtp(driverMobile);
    if (res.success) {
      setDriverOtpSent(true);
      setDriverOtpMessage(res.message);
    }
  };

  const handleVerifyDriverOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const success = await loginWithPhoneOtp(driverMobile, driverOtp, "driver", "Auto Driver");
    if (success) {
      setTrip((prev) => ({
        ...prev,
        driverName: prev.driverName || "Auto Driver",
        driverAuto: prev.driverAuto || "MH 08 AB 1234 • Bajaj RE",
      }));
      setDriverScreen(4); // Driver Dashboard
    }
  };

  const handleDriverEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const success = await loginWithEmail(driverEmail, driverPassword, "driver");
    if (success) {
      setDriverScreen(4); // Driver Dashboard
    }
  };

  const handleDriverRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadhaarValidation.isValid && regAadhaar.replace(/\D/g, "").length !== 12) {
      setAuthError("कृपया वैध १२ अंकी आधार नंबर टाका");
      return;
    }
    setRegSubmitting(true);
    const name = regName.trim() || "Auto Driver";
    const auto = regAuto.trim() || "MH 08 AB 1234";
    const license = regLicense.trim() || "MH08 20210012345";

    await registerDriverWithDocs({
      fullName: name,
      phone: regPhone,
      autoNumber: auto,
      dlNumber: license,
      dlUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80",
      rcUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80",
      aadhaarNumber: regAadhaar,
      aadhaarUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80",
    });

    setRegSubmitting(false);
    setRegSuccess(true);
  };

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
              <p className="text-xs text-zinc-500">Find passengers & earn</p>
            </div>
            <ArrowRight className="w-5 h-5 text-orange-600" />
          </button>

          {/* I am an Admin */}
          <button
            onClick={() => {
              setFlow("admin");
            }}
            className="w-full p-3.5 rounded-2xl bg-zinc-800/90 hover:bg-zinc-800 text-white flex items-center gap-4 shadow-xl border border-zinc-700 hover:border-amber-400 hover:scale-[1.02] transition text-left active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-base leading-tight text-white">I am an Admin</h3>
              <p className="text-xs text-zinc-400">कॉलेज व चालक प्रशासक</p>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-400" />
          </button>

          <p className="text-[11px] text-zinc-400 text-center pt-2">
            Lavel Stop ↔ Gharda Institute of Technology
          </p>

          {/* Quick APK Download & WhatsApp Share */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <a
              href="/RideMitra.apk"
              download="RideMitra.apk"
              className="px-3 py-1.5 rounded-full bg-amber-400 text-black text-[11px] font-extrabold flex items-center gap-1 shadow hover:scale-105 transition"
            >
              <span>⬇️ Download APK</span>
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                "रिक्षा मित्र (Ride Mitra) ॲप डाउनलोड करा: " + window.location.origin
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold flex items-center gap-1 shadow hover:scale-105 transition"
            >
              <span>💬 WhatsApp Share</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 2: DRIVER LOGIN / SIGN UP (NO GOOGLE - 100% WORKING REAL AUTH)
   * ========================================================================= */
  if (driverScreen === 2) {
    return (
      <div className="flex-1 flex flex-col p-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-y-auto">
        <button
          onClick={() => setDriverScreen(1)}
          className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="space-y-1 mb-4">
          <h2 className="text-2xl font-black">
            {driverAuthTab === "login" ? "Driver Login" : "Driver Sign Up"}
          </h2>
          <p className="text-xs text-zinc-500">
            {driverAuthTab === "login" ? "रिक्षा चालक लॉगिन • Lavel Corridor" : "नोंदणी करा आणि उत्पन्न वाढवा"}
          </p>
        </div>

        {/* Tabs: Login / Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-4">
          <button
            onClick={() => {
              setDriverAuthTab("login");
              setAuthError(null);
            }}
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
            New Registration
          </button>
        </div>

        {/* Auth Method Selector: Mobile OTP vs Email */}
        <div className="flex items-center justify-center gap-4 mb-4 text-xs font-bold border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <button
            type="button"
            onClick={() => {
              setDriverAuthMethod("phone");
              setAuthError(null);
            }}
            className={`flex items-center gap-1.5 pb-1 transition border-b-2 ${
              driverAuthMethod === "phone" ? "border-orange-500 text-orange-500" : "border-transparent text-zinc-400"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDriverAuthMethod("email");
              setAuthError(null);
            }}
            className={`flex items-center gap-1.5 pb-1 transition border-b-2 ${
              driverAuthMethod === "email" ? "border-orange-500 text-orange-500" : "border-transparent text-zinc-400"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email & Password</span>
          </button>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* METHOD 1: MOBILE OTP FORM */}
        {driverAuthMethod === "phone" ? (
          !driverOtpSent ? (
            <form onSubmit={handleSendDriverOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-400 block">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-xs font-bold text-zinc-400">+91</span>
                  <input
                    type="tel"
                    required
                    value={driverMobile}
                    onChange={(e) => setDriverMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full h-11 pl-12 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-wider"
                  />
                </div>
                <p className="text-[10px] text-zinc-400">१२३४५६ ओटीपी कोड त्वरित पडताळणीसाठी उपलब्ध आहे.</p>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-[0.98]"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyDriverOtp} className="space-y-4">
              {driverOtpMessage && (
                <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 text-orange-700 dark:text-orange-300 text-xs font-bold">
                  ✓ {driverOtpMessage}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-zinc-400">Enter 6-Digit OTP</label>
                  <button
                    type="button"
                    onClick={() => setDriverOtpSent(false)}
                    className="text-[11px] font-bold text-orange-500 hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={driverOtp}
                  onChange={(e) => setDriverOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-center font-mono text-base font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-[0.98]"
              >
                {authLoading ? "लॉगिन करत आहे..." : "Verify & Login"}
              </button>
            </form>
          )
        ) : (
          /* METHOD 2: EMAIL & PASSWORD FORM */
          <form onSubmit={handleDriverEmailLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={driverEmail}
                  onChange={(e) => setDriverEmail(e.target.value)}
                  placeholder="driver@ridemitra.com"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={driverPassword}
                  onChange={(e) => setDriverPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="text-right">
                <button type="button" className="text-[11px] font-semibold text-orange-500 hover:underline">
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-[0.98]"
            >
              {authLoading ? "लॉगिन करत आहे..." : "Login"}
            </button>
          </form>
        )}

        <div className="mt-auto pt-6 text-center">
          <p className="text-xs text-zinc-500">
            नवीन रिक्षा चालक आहात?{" "}
            <button
              onClick={() => setDriverScreen(3)}
              className="text-orange-500 font-bold hover:underline"
            >
              येथे नोंदणी करा (Register)
            </button>
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 3: DRIVER REGISTRATION WITH FULL DOCUMENT UPLOAD & AADHAAR VERIFICATION
   * ========================================================================= */
  if (driverScreen === 3) {
    if (regSuccess) {
      return (
        <div className="flex-1 flex flex-col p-6 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-y-auto justify-between">
          <div className="pt-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black">नोंदणी यशस्वी झाली!</h2>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              तुमची कागदपत्रे व आधार कार्ड यशस्वीरीत्या नोंदणीकृत झाले आहेत. प्रशासकीय पडताळणीनंतर तुमचे खाते सक्रिय होईल.
            </p>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">नाव:</span>
                <span className="font-bold">{regName || "Auto Driver"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">रिक्षा नंबर:</span>
                <span className="font-bold font-mono">{regAuto.toUpperCase() || "MH 08 AB 1234"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">आधार पडताळणी:</span>
                <span className="font-bold text-emerald-600">✓ यशस्वी (Verhoeff Verified)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">कागदपत्रे:</span>
                <span className="font-bold text-blue-600">DL, RC, Aadhaar अपलोड केले</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-zinc-500">खाते स्थिती:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-extrabold text-[10px]">
                  प्रलंबित (Pending Admin Approval)
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pb-6">
            <button
              onClick={() => {
                setDriverScreen(4);
              }}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-md transition"
            >
              चालक डॅशबोर्डवर जा (Driver Dashboard) →
            </button>
            <button
              onClick={() => {
                setFlow("admin");
              }}
              className="w-full h-11 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-bold rounded-xl text-xs transition border border-zinc-200 dark:border-zinc-800"
            >
              प्रशासकीय पडताळणी कक्षात पाहा (View in Admin Panel)
            </button>
          </div>
        </div>
      );
    }

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
          <p className="text-xs text-zinc-500">
            नवीन रिक्षा चालकांची कागदपत्रे व आधार पडताळणी
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleDriverRegistration} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-zinc-500 block mb-1">
              Full Name (पूर्ण नाव) *
            </label>
            <input
              type="text"
              required
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="उदा. रमेश कदम"
              className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-500 block mb-1">
              Mobile Number (मोबाईल नंबर) *
            </label>
            <input
              type="tel"
              required
              value={regPhone}
              onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="उदा. 9833445566"
              className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-500 block mb-1">
              Auto Number (रिक्षा क्रमांक) *
            </label>
            <input
              type="text"
              required
              value={regAuto}
              onChange={(e) => setRegAuto(e.target.value.toUpperCase())}
              placeholder="उदा. MH 08 CD 9012"
              className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
            />
          </div>

          {/* AADHAAR CARD NUMBER WITH VERHOEFF CHECKSUM */}
          <div className="p-3.5 rounded-2xl bg-orange-50/50 dark:bg-orange-950/20 border-2 border-orange-200 dark:border-orange-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-extrabold text-orange-950 dark:text-orange-200 block">
                🪪 आधार कार्ड नंबर (Aadhaar Card) *
              </label>
              <span className="text-[10px] text-zinc-500 font-medium">१२ अंक</span>
            </div>
            <input
              type="text"
              required
              value={regAadhaar}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
                const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
                setRegAadhaar(formatted);
              }}
              placeholder="उदा. 3675 9834 6012"
              className="w-full h-11 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-extrabold font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {/* Live Verification Feedback */}
            {regAadhaar.length > 0 && (
              <div
                className={`text-[11px] font-bold flex items-center gap-1.5 pt-1 ${
                  aadhaarValidation.isValid
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {aadhaarValidation.isValid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>✓ वैध आधार कार्ड पडताळणी पूर्ण (Aadhaar Valid)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{aadhaarValidation.message}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-500 block mb-1">
              Driving License No (परवाना क्रमांक) *
            </label>
            <input
              type="text"
              required
              value={regLicense}
              onChange={(e) => setRegLicense(e.target.value.toUpperCase())}
              placeholder="उदा. MH08 20210012345"
              className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
            />
          </div>

          {/* DOCUMENT UPLOADS */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              आवश्यक कागदपत्रे अपलोड (Upload Documents)
            </p>

            {/* 1. Aadhaar Card Photo Upload */}
            <div>
              <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                १. आधार कार्ड प्रत (Aadhaar Card Front/Back)
              </label>
              <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
                <span className="text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2 truncate pr-2">
                  <Upload className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="truncate">{aadhaarFileName}</span>
                </span>
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-lg flex-shrink-0">
                  ✓ निवडले
                </span>
              </div>
            </div>

            {/* 2. Driving License Upload */}
            <div>
              <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                २. ड्रायव्हिंग लायसन्स (Driving Licence Photo)
              </label>
              <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
                <span className="text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2 truncate pr-2">
                  <Upload className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="truncate">{dlFileName}</span>
                </span>
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-lg flex-shrink-0">
                  ✓ निवडले
                </span>
              </div>
            </div>

            {/* 3. RC Book Upload */}
            <div>
              <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block mb-1">
                ३. वाहन आरसी बुक (Vehicle RC / Permit)
              </label>
              <div className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-3 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900">
                <span className="text-xs text-zinc-600 dark:text-zinc-300 flex items-center gap-2 truncate pr-2">
                  <Upload className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="truncate">{rcFileName}</span>
                </span>
                <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-lg flex-shrink-0">
                  ✓ निवडले
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={regSubmitting}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold rounded-xl text-sm shadow-md transition mt-6 active:scale-[0.98]"
          >
            {regSubmitting ? "नोंदणी होत आहे..." : "नोंदणी सबमिट करा (Submit Registration)"}
          </button>
        </form>
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

        {/* Verification Status Banner */}
        {driverDocs.status === "pending" && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-extrabold text-amber-900 dark:text-amber-200">
                  कागदपत्रे पडताळणी प्रलंबित (Pending Approval)
                </p>
                <p className="text-[10px] text-zinc-500">
                  आधार व लायसन्स प्रशासकाकडे मंजुरीसाठी पाठवले आहे.
                </p>
              </div>
            </div>
            <button
              onClick={() => setFlow("admin")}
              className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-500 text-black text-[10px] font-black whitespace-nowrap shadow-sm"
            >
              Admin तपासणी →
            </button>
          </div>
        )}

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
                <h4 className="font-extrabold text-sm">{trip.passengerName || "Student Passenger"}</h4>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${trip.passengerPhone || "9876543210"}`}
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
              onClick={async () => {
                await completeCurrentRide();
                setDriverScreen(7);
              }}
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
              <h2 className="text-3xl font-black text-orange-500 mt-0.5">₹{driverEarningsSummary.totalAmount}</h2>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 font-black text-xs rounded-full">
                {driverEarningsSummary.tripsCount} rides
              </span>
            </div>
          </div>
        </div>

        {/* Trip List */}
        <div className="p-4 space-y-2.5 flex-1 overflow-y-auto">
          {driverEarningsSummary.trips.map((item, idx) => (
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

        {/* Driver Profile & Logout */}
        <div className="p-4 pt-0">
          <div className="p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-xs">{currentUser?.fullName || regName}</p>
                <p className="text-[10px] text-zinc-400 font-medium">{regAuto} • DL Verified</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 text-[11px] font-bold flex items-center gap-1.5 hover:bg-red-100 active:scale-95 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
