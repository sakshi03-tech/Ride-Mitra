import React, { useState } from "react";
import { useMockup } from "./MockupContext";
import { Home, Calendar, HelpCircle, User, SlidersHorizontal, X } from "lucide-react";

interface MobileShellProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  activeNavTab?: "home" | "bookings" | "support" | "profile";
  themeColor?: "blue" | "orange";
}

export const MobileShell: React.FC<MobileShellProps> = ({
  children,
  showBottomNav = false,
  activeNavTab = "home",
  themeColor = "blue",
}) => {
  const { flow, setFlow, studentScreen, setStudentScreen, driverScreen, setDriverScreen } = useMockup();
  const [showDevPanel, setShowDevPanel] = useState(false);

  const handleNavClick = (tab: "home" | "bookings" | "support" | "profile") => {
    if (flow === "student") {
      if (tab === "home") setStudentScreen(3);
      else if (tab === "bookings") setStudentScreen(11);
      else if (tab === "support") setStudentScreen(13);
      else if (tab === "profile") setStudentScreen(12);
    } else {
      if (tab === "home") setDriverScreen(4);
      else if (tab === "bookings") setDriverScreen(8); // Earnings/trips
      else if (tab === "support") setDriverScreen(4);
      else if (tab === "profile") setDriverScreen(3);
    }
  };

  const activeColor = themeColor === "blue" ? "text-blue-600 font-extrabold" : "text-orange-500 font-extrabold";
  const inactiveColor = "text-zinc-400 hover:text-zinc-600";

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col justify-start items-center">
      {/* Floating Navigator Pill for quick role switching and screen selection */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
        <button
          onClick={useMockup().toggleLanguage}
          className="px-2.5 py-1.5 rounded-full bg-zinc-900/90 text-amber-300 shadow-xl text-xs font-bold border border-zinc-700/80 backdrop-blur-md flex items-center gap-1 hover:scale-105 active:scale-95 transition"
          title="Change Language"
        >
          <span>🌐</span>
          <span>{useMockup().currentLanguage.startsWith("mr") ? "मराठी" : "EN"}</span>
        </button>

        <button
          onClick={() => setShowDevPanel(!showDevPanel)}
          className="px-3.5 py-1.5 rounded-full bg-zinc-900/90 text-white shadow-xl text-xs font-bold border border-zinc-700/80 backdrop-blur-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition"
          title="Switch Role or Screen"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {flow === "student" ? "🎓 Student" : flow === "driver" ? "🛺 Driver" : "🛡️ Admin"}
          </span>
        </button>
      </div>

      {/* Dev Switcher Drawer Modal */}
      {showDevPanel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <h3 className="font-extrabold text-sm">Ride Mitra Navigator</h3>
              </div>
              <button
                onClick={() => setShowDevPanel(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Role Switch */}
            <div className="grid grid-cols-3 p-1 bg-zinc-800 rounded-xl text-xs font-bold">
              <button
                onClick={() => {
                  setFlow("student");
                  setStudentScreen(1);
                  setShowDevPanel(false);
                }}
                className={`py-2 rounded-lg transition ${
                  flow === "student" ? "bg-blue-600 text-white" : "text-zinc-400"
                }`}
              >
                🎓 Student
              </button>
              <button
                onClick={() => {
                  setFlow("driver");
                  setDriverScreen(1);
                  setShowDevPanel(false);
                }}
                className={`py-2 rounded-lg transition ${
                  flow === "driver" ? "bg-orange-500 text-white" : "text-zinc-400"
                }`}
              >
                🛺 Driver
              </button>
              <button
                onClick={() => {
                  setFlow("admin");
                  setShowDevPanel(false);
                }}
                className={`py-2 rounded-lg transition ${
                  flow === "admin" ? "bg-amber-400 text-black font-extrabold" : "text-zinc-400"
                }`}
              >
                🛡️ Admin
              </button>
            </div>

            {/* Quick Screen Jump */}
            <div>
              <p className="text-[11px] font-bold text-zinc-400 mb-2 uppercase">Jump to Screen:</p>
              <div className="grid grid-cols-2 gap-1.5 max-h-60 overflow-y-auto pr-1">
                {flow === "student"
                  ? [
                      "1. Welcome",
                      "2. Login/Sign Up",
                      "3. Home Screen",
                      "4. Available Autos",
                      "5. Confirm Booking",
                      "6. Booking Success",
                      "7. Live Tracking",
                      "8. Trip In Progress",
                      "9. Trip Completed",
                      "10. Rate Driver",
                      "11. My Bookings",
                      "12. Profile",
                      "13. Support",
                    ].map((name, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setStudentScreen(i + 1);
                          setShowDevPanel(false);
                        }}
                        className={`p-2 rounded-xl text-left text-xs font-semibold border ${
                          studentScreen === i + 1
                            ? "bg-blue-600 border-blue-500 text-white font-bold"
                            : "bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800"
                        }`}
                      >
                        {name}
                      </button>
                    ))
                  : flow === "driver"
                  ? [
                      "1. Welcome",
                      "2. Driver Login",
                      "3. Driver Registration",
                      "4. Driver Home",
                      "5. Ride Details",
                      "6. On Trip",
                      "7. Trip Completed",
                      "8. Driver Earnings",
                    ].map((name, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDriverScreen(i + 1);
                          setShowDevPanel(false);
                        }}
                        className={`p-2 rounded-xl text-left text-xs font-semibold border ${
                          driverScreen === i + 1
                            ? "bg-orange-500 border-orange-400 text-white font-bold"
                            : "bg-zinc-800/80 border-zinc-700/60 text-zinc-300 hover:bg-zinc-800"
                        }`}
                      >
                        {name}
                      </button>
                    ))
                  : [
                      "1. Admin Login",
                      "2. Drivers & Aadhaar Verification",
                      "3. Stops & Fares",
                      "4. Overview & Analytics",
                    ].map((name, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setShowDevPanel(false);
                        }}
                        className="p-2 rounded-xl text-left text-xs font-semibold border bg-zinc-800/80 border-zinc-700/60 text-amber-300 hover:bg-zinc-800"
                      >
                        {name}
                      </button>
                    ))}
              </div>
            </div>

            {/* Quick Share & APK Download Actions */}
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <p className="text-[11px] font-bold text-zinc-400 uppercase">Share & Download App:</p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/RideMitra.apk"
                  download="RideMitra.apk"
                  className="py-2.5 px-3 rounded-xl bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-500 shadow-md transition"
                >
                  <span>⬇️ Download APK</span>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    "रिक्षा मित्र (Ride Mitra) ॲप डाउनलोड करा - लावेल ↔ जीआयटी कॉलेज कॉरिडॉर रिक्षा बुकिंग: " +
                      window.location.origin
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-700 shadow-md transition"
                >
                  <span>💬 WhatsApp वर पाठवा</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main App Container (Natural Mobile Screen - No Fake Phone Bezel) */}
      <div className="w-full max-w-md min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col shadow-2xl relative overflow-x-hidden">
        {/* Screen Content */}
        <div className="flex-1 flex flex-col relative bg-zinc-50 dark:bg-zinc-950">
          {children}
        </div>

        {/* Bottom Navigation Bar */}
        {showBottomNav && (
          <nav className="w-full sticky bottom-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around py-2.5 px-2 z-30 shadow-lg">
            <button
              onClick={() => handleNavClick("home")}
              className={`flex flex-col items-center gap-1 text-[10px] ${
                activeNavTab === "home" ? activeColor : inactiveColor
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => handleNavClick("bookings")}
              className={`flex flex-col items-center gap-1 text-[10px] ${
                activeNavTab === "bookings" ? activeColor : inactiveColor
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Bookings</span>
            </button>
            <button
              onClick={() => handleNavClick("support")}
              className={`flex flex-col items-center gap-1 text-[10px] ${
                activeNavTab === "support" ? activeColor : inactiveColor
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>Support</span>
            </button>
            <button
              onClick={() => handleNavClick("profile")}
              className={`flex flex-col items-center gap-1 text-[10px] ${
                activeNavTab === "profile" ? activeColor : inactiveColor
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};
