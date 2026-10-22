import React, { useState, useEffect } from "react";
import { useMockup } from "./MockupContext";
import { getDemoDB, saveDemoDB } from "@/lib/supabase";
import {
  ShieldAlert,
  Car,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  Mail,
  ArrowLeft,
  Search,
  Activity,
  Banknote,
  AlertCircle,
  TrendingUp,
  MapPin,
  ExternalLink,
  Eye,
  Check,
  X,
  LogOut,
  Globe,
  UserCheck,
} from "lucide-react";

export const AdminScreens: React.FC = () => {
  const {
    adminScreen,
    setAdminScreen,
    setFlow,
    loginAdmin,
    currentUser,
    logout,
    currentLanguage,
    toggleLanguage,
    adminApproveDriver,
    adminRejectDriver,
    adminSuspendDriver,
    realStops,
    realFares,
    driverDocs,
  } = useMockup();

  // Screen 1: Admin Login state
  const [adminPassword, setAdminPassword] = useState("");
  const [adminEmail, setAdminEmail] = useState("admin@ridemitra.com");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Screen 2: Dashboard Tabs
  const [adminTab, setAdminTab] = useState<
    "drivers" | "overview" | "fares" | "complaints" | "analytics"
  >("drivers");

  // Document Modal Preview
  const [previewDoc, setPreviewDoc] = useState<{
    title: string;
    url: string;
    docType: string;
    number?: string;
  } | null>(null);

  // Database state
  const [demoDb, setDemoDb] = useState(getDemoDB());

  const refreshData = () => {
    setDemoDb(getDemoDB());
  };

  useEffect(() => {
    window.addEventListener("storage_db_updated", refreshData);
    return () => window.removeEventListener("storage_db_updated", refreshData);
  }, []);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    const success = await loginAdmin(adminPassword || "admin123");
    setIsLoggingIn(false);
    if (!success) {
      setLoginError("चुकीचा पासवर्ड. 'admin123' किंवा '1234' वापरा.");
    }
  };

  const handleQuickLogin = async () => {
    setIsLoggingIn(true);
    await loginAdmin("admin123");
    setIsLoggingIn(false);
  };

  /* =========================================================================
   * SCREEN 1: ADMIN LOGIN
   * ========================================================================= */
  if (adminScreen === 1 && (!currentUser || currentUser.role !== "admin")) {
    return (
      <div className="flex-1 flex flex-col p-6 bg-zinc-950 text-white min-h-[750px] overflow-y-auto">
        {/* Top Back Arrow */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              setFlow("student");
            }}
            className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 rounded-full bg-zinc-800 text-xs font-bold text-amber-400 border border-zinc-700 flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{currentLanguage.startsWith("mr") ? "मराठी" : "English"}</span>
          </button>
        </div>

        <div className="flex flex-col items-center text-center space-y-2 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-3xl font-black shadow-xl">
            🛡️
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Admin Portal (प्रशासक)
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs">
            Gharda Institute of Technology (GIT) & Auto Association Administration
          </p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 block">
              Admin Email / Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@ridemitra.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-800 bg-zinc-900 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 block">
              Passcode or Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password (e.g. admin123 or 1234)"
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-800 bg-zinc-900 text-xs text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <p className="text-[10px] text-zinc-500 pt-1">
              Valid default credentials: <span className="font-mono text-amber-400 font-bold">admin123</span> / <span className="font-mono text-amber-400 font-bold">1234</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full h-12 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-black font-extrabold rounded-xl text-sm shadow-xl transition active:scale-[0.98] mt-2"
          >
            {isLoggingIn ? "पडताळणी करत आहे..." : "प्रशासक लॉगिन (Admin Login)"}
          </button>

          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full h-11 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl text-xs transition border border-zinc-700"
          >
            ⚡ १-क्लिक जलद लॉगिन (Quick 1-Click Access)
          </button>
        </form>

        <div className="mt-auto pt-6 text-center border-t border-zinc-800">
          <p className="text-[11px] text-zinc-500">
            Ride Mitra Platform • Git College Lavel Auto Consortium
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================================
   * SCREEN 2: ADMIN MANAGEMENT DASHBOARD
   * ========================================================================= */
  const pendingDrivers = demoDb.drivers.filter((d) => d.status === "pending");
  const approvedDrivers = demoDb.drivers.filter((d) => d.status === "approved");

  return (
    <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-[750px] overflow-y-auto">
      {/* Admin Header */}
      <div className="p-4 bg-zinc-900 text-white border-b border-zinc-800 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black text-sm">
            🛡️
          </div>
          <div>
            <h3 className="font-black text-sm leading-tight text-white">Ride Mitra Admin</h3>
            <p className="text-[10px] text-amber-400 font-bold">GIT Lavel Corridor Management</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 text-[11px] font-bold text-amber-400 border border-zinc-700 flex items-center gap-1"
          >
            <Globe className="w-3 h-3" />
            <span>{currentLanguage.startsWith("mr") ? "मराठी" : "EN"}</span>
          </button>
          <button
            onClick={() => {
              logout();
              setFlow("student");
            }}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
            title="लॉगआउट"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-1.5 p-2 bg-zinc-100 dark:bg-zinc-900 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 text-xs font-bold">
        {[
          { id: "drivers", label: `चालक पडताळणी (${pendingDrivers.length > 0 ? "!" : ""}${demoDb.drivers.length})`, icon: Car },
          { id: "overview", label: "डॅशबोर्ड", icon: Activity },
          { id: "fares", label: "थांबे व भाडे", icon: Banknote },
          { id: "complaints", label: "तक्रारी व SOS", icon: AlertCircle },
          { id: "analytics", label: "आकडेवारी", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition ${
                isActive
                  ? "bg-amber-400 text-black shadow-sm font-extrabold"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4">
        {/* =========================================================================
         * TAB: DRIVERS & DOCUMENT VERIFICATION (Aadhaar, DL, RC)
         * ========================================================================= */}
        {adminTab === "drivers" && (
          <div className="space-y-4">
            {/* Pending Verifications Alert */}
            {pendingDrivers.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400/60 text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <h4 className="font-extrabold text-xs">
                    {pendingDrivers.length} चालकांची पडताळणी प्रलंबित (Pending Verification)
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                  कृपया ड्रायव्हिंग लायसन्स, वाहन आरसी आणि आधार कार्ड तपासून मंजुरी द्या.
                </p>
              </div>
            )}

            {/* Drivers List */}
            <div className="space-y-3">
              {demoDb.drivers.map((drv) => {
                const prof = demoDb.profiles.find((p) => p.id === drv.profile_id);
                const isPending = drv.status === "pending";

                return (
                  <div
                    key={drv.profile_id}
                    className={`p-4 rounded-2xl border-2 transition ${
                      isPending
                        ? "border-amber-400 bg-white dark:bg-zinc-900 shadow-md"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-950/80 text-orange-600 flex items-center justify-center text-xl font-bold">
                          🛺
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                              {prof?.full_name || "Auto Driver"}
                            </h4>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                drv.status === "approved"
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                  : drv.status === "pending"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse"
                                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                              }`}
                            >
                              {drv.status === "approved" ? "✓ मंजूर (Approved)" : drv.status === "pending" ? "प्रलंबित (Pending)" : "निलंबित (Suspended)"}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 font-mono">
                            {drv.auto_number} • फोन: {prof?.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Document Badges & Viewers */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        सादर केलेली कागदपत्रे (Submitted Documents):
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* 1. Aadhaar Card Verification */}
                        <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-1">
                                🪪 आधार कार्ड (Aadhaar)
                              </span>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                                ✓ व्हेरिफाय
                              </span>
                            </div>
                            <p className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-100">
                              {drv.aadhaar_number || "3675 9834 6012"}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setPreviewDoc({
                                title: "Aadhaar Card (आधार कार्ड)",
                                url: drv.aadhaar_url || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80",
                                docType: "Aadhaar Card",
                                number: drv.aadhaar_number || "3675 9834 6012",
                              })
                            }
                            className="mt-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline self-start"
                          >
                            <Eye className="w-3 h-3" />
                            <span>कागदपत्र पाहा (Preview)</span>
                          </button>
                        </div>

                        {/* 2. Driving Licence */}
                        <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-1">
                                📜 ड्रायव्हिंग लायसन्स (DL)
                              </span>
                              <span className="text-[9px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                                वैध
                              </span>
                            </div>
                            <p className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-100 uppercase">
                              {drv.dl_number || "MH08 20210012345"}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setPreviewDoc({
                                title: "Driving Licence (वाहन परवाना)",
                                url: drv.licence_url || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
                                docType: "Driving Licence",
                                number: drv.dl_number || "MH08 20210012345",
                              })
                            }
                            className="mt-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline self-start"
                          >
                            <Eye className="w-3 h-3" />
                            <span>कागदपत्र पाहा (Preview)</span>
                          </button>
                        </div>

                        {/* 3. Vehicle RC */}
                        <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-1">
                                📑 वाहन आरसी (RC Book)
                              </span>
                              <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                                पास
                              </span>
                            </div>
                            <p className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-100 uppercase">
                              {drv.auto_number}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setPreviewDoc({
                                title: "Vehicle RC Book (रिक्षा नोंदणी प्रत)",
                                url: drv.rc_url || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80",
                                docType: "Vehicle RC",
                                number: drv.auto_number,
                              })
                            }
                            className="mt-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline self-start"
                          >
                            <Eye className="w-3 h-3" />
                            <span>कागदपत्र पाहा (Preview)</span>
                          </button>
                        </div>
                      </div>

                      {/* Approval Action Buttons */}
                      <div className="pt-2 flex items-center justify-end gap-2">
                        {isPending ? (
                          <>
                            <button
                              onClick={() => {
                                adminRejectDriver(drv.profile_id);
                                refreshData();
                              }}
                              className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              नाकारा (Reject)
                            </button>
                            <button
                              onClick={() => {
                                adminApproveDriver(drv.profile_id);
                                refreshData();
                              }}
                              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>मंजूर करा (Approve Driver)</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              adminSuspendDriver(drv.profile_id);
                              refreshData();
                            }}
                            className="px-3 py-1 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            {drv.status === "suspended" ? "सक्रिय करा (Activate)" : "निलंबित करा (Suspend)"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
         * TAB: OVERVIEW & LIVE MONITORING
         * ========================================================================= */}
        {adminTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-[11px] font-bold text-zinc-400 block">सक्रिय चालक (Online)</span>
                <span className="text-3xl font-black text-amber-500 mt-1 block">
                  {demoDb.drivers.filter((d) => d.status === "approved" && d.is_online).length || 2}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">लावेल कॉरिडॉरवर सज्ज</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-[11px] font-bold text-zinc-400 block">एकूण फेऱ्या (Trips)</span>
                <span className="text-3xl font-black text-zinc-900 dark:text-white mt-1 block">
                  {demoDb.rides.length || 24}
                </span>
                <span className="text-[10px] text-zinc-400 font-bold">आजच्या एकूण फेऱ्या</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-[11px] font-bold text-zinc-400 block">यशस्वी दर (Rate)</span>
                <span className="text-3xl font-black text-emerald-600 mt-1 block">98%</span>
                <span className="text-[10px] text-emerald-600 font-bold">शून्य वाद / फिक्स दर</span>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <span className="text-[11px] font-bold text-zinc-400 block">मंजूर चालक</span>
                <span className="text-3xl font-black text-blue-600 mt-1 block">
                  {approvedDrivers.length}
                </span>
                <span className="text-[10px] text-blue-600 font-bold">आधार व लायसन्स पडताळलेले</span>
              </div>
            </div>

            {/* Fair-turn Queue Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5">
                <span>🛺</span>
                <span>फेरीची समान संधी (Fair-Turn Queue)</span>
              </h4>
              <div className="space-y-2">
                {approvedDrivers.map((d, idx) => {
                  const prof = demoDb.profiles.find((p) => p.id === d.profile_id);
                  return (
                    <div
                      key={d.profile_id}
                      className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between text-xs font-bold"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] flex items-center justify-center font-black">
                          {idx + 1}
                        </span>
                        <span>{prof?.full_name}</span>
                        <span className="text-zinc-400 font-mono text-[11px]">({d.auto_number})</span>
                      </div>
                      <span className="text-[11px] text-emerald-600 font-bold">Queue #{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
         * TAB: STOPS & FARES
         * ========================================================================= */}
        {adminTab === "fares" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>कॉरिडॉर थांबे (Fixed Stops)</span>
              </h4>
              <div className="space-y-2">
                {(realStops.length > 0 ? realStops : demoDb.stops).map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-xs text-zinc-900 dark:text-white">{s.name_mr}</p>
                      <p className="text-[10px] text-zinc-500">{s.name_en}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                      सक्रिय (Active)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white mb-3 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span>नक्की फिक्स भाडे दर (Fixed Fare Matrix)</span>
              </h4>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold">लावेल स्टॉप ↔ GIT कॉलेज (Private Ride):</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300 font-mono text-sm">₹30</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">शेअरिंग दर (Per Seat Share):</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300 font-mono text-sm">₹10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">रात्रीचा जास्तीचा अधिभार (Night Surcharge):</span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-300 font-mono text-sm">₹10</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
         * TAB: COMPLAINTS & SOS ALERTS
         * ========================================================================= */}
        {adminTab === "complaints" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white mb-2 flex items-center gap-1.5 text-red-500">
                <ShieldAlert className="w-4 h-4" />
                <span>आपत्कालीन SOS इशारा व्यवस्था (SOS Alerts)</span>
              </h4>
              <p className="text-xs text-zinc-500 mb-3">
                सध्या कोणताही सक्रिय आपत्कालीन इशारा नाही. सर्व फेऱ्या सुरक्षितपणे पार पडत आहेत.
              </p>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs">
                <p className="font-bold text-zinc-800 dark:text-zinc-200">
                  पोलीस मदत कक्ष (Police Helpline): <span className="font-mono text-red-500">112</span>
                </p>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                  GIT कॉलेज सुरक्षा कक्ष: <span className="font-mono text-blue-500">02356-260100</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
         * TAB: ANALYTICS
         * ========================================================================= */}
        {adminTab === "analytics" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h4 className="font-extrabold text-xs text-zinc-900 dark:text-white mb-3">
                कॉरिडॉर ट्रॅफिक विश्लेषण (Corridor Peak Hours)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>सकाळी ०८:०० - १०:०० (कॉलेज वेळ)</span>
                  <span className="font-extrabold text-amber-500">४५% फेऱ्या</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full w-[45%]" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span>संध्याकाळी ०५:०० - ०७:०० (सुटण्याची वेळ)</span>
                  <span className="font-extrabold text-orange-500">३५% फेऱ्या</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full w-[35%]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
       * DOCUMENT PREVIEW MODAL
       * ========================================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-white shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-sm">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="aspect-[4/3] rounded-2xl bg-zinc-800 overflow-hidden relative border border-zinc-700">
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-black/70 backdrop-blur-md text-[11px] font-mono">
                  नंबर / ID: <span className="text-amber-400 font-bold">{previewDoc.number}</span>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400">
                सदर कागदपत्राची डिजिटल प्रत रिक्षा मित्र डेटाबेसमध्ये सुरक्षितरीत्या जतन केलेली आहे.
              </p>
            </div>

            <button
              onClick={() => setPreviewDoc(null)}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs"
            >
              बंद करा (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
