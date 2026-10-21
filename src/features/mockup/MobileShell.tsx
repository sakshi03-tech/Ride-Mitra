import React from "react";
import { useMockup } from "./MockupContext";
import { Wifi, Battery, Signal, Home, Calendar, HelpCircle, User, Smartphone, Maximize2 } from "lucide-react";

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
  const { flow, setFlow, studentScreen, setStudentScreen, driverScreen, setDriverScreen, deviceView, setDeviceView } = useMockup();

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

  const activeColor = themeColor === "blue" ? "text-blue-600" : "text-orange-500";
  const inactiveColor = "text-zinc-400 hover:text-zinc-600";

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-start py-4 px-2 sm:px-4">
      {/* Top Demo Bar / Quick Switcher */}
      <header className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-2xl mb-4 shadow-lg text-white">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center font-black text-black text-sm">
            RM
          </div>
          <span className="font-extrabold text-sm tracking-tight text-white">
            Ride Mitra • Pixel-Perfect UI
          </span>
        </div>

        {/* Role Toggle */}
        <div className="flex items-center bg-zinc-800 p-1 rounded-xl border border-zinc-700 text-xs font-bold">
          <button
            onClick={() => {
              setFlow("student");
              setStudentScreen(1);
            }}
            className={`px-3 py-1.5 rounded-lg transition ${
              flow === "student" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            🎓 Student Flow (13 Screens)
          </button>
          <button
            onClick={() => {
              setFlow("driver");
              setDriverScreen(1);
            }}
            className={`px-3 py-1.5 rounded-lg transition ${
              flow === "driver" ? "bg-orange-500 text-white shadow-sm" : "text-zinc-400 hover:text-white"
            }`}
          >
            🛺 Driver Flow (8 Screens)
          </button>
        </div>

        {/* Device View Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDeviceView(deviceView === "mobile" ? "responsive" : "mobile")}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-300"
            title="Toggle Device Frame"
          >
            {deviceView === "mobile" ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Screen Selection Carousel Pill Bar */}
      <div className="w-full max-w-4xl overflow-x-auto pb-3 mb-2 flex items-center gap-1.5 scrollbar-thin">
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
            ].map((title, idx) => {
              const screenNum = idx + 1;
              const isActive = studentScreen === screenNum;
              return (
                <button
                  key={screenNum}
                  onClick={() => setStudentScreen(screenNum)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition border ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-500 shadow-md scale-105"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {title}
                </button>
              );
            })
          : [
              "1. Welcome",
              "2. Driver Login",
              "3. Driver Registration",
              "4. Driver Home",
              "5. Ride Details",
              "6. On Trip",
              "7. Trip Completed",
              "8. Driver Earnings",
            ].map((title, idx) => {
              const screenNum = idx + 1;
              const isActive = driverScreen === screenNum;
              return (
                <button
                  key={screenNum}
                  onClick={() => setDriverScreen(screenNum)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap transition border ${
                    isActive
                      ? "bg-orange-500 text-white border-orange-400 shadow-md scale-105"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {title}
                </button>
              );
            })}
      </div>

      {/* Mobile Device Frame */}
      <div
        className={`relative w-full ${
          deviceView === "mobile"
            ? "max-w-[390px] h-[844px] rounded-[48px] border-[10px] border-zinc-800 shadow-2xl ring-1 ring-zinc-700/50"
            : "max-w-md min-h-[844px] rounded-3xl border-2 border-zinc-800 shadow-xl"
        } bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* iOS Dynamic Island & Status Bar */}
        <div className="relative w-full h-11 flex items-center justify-between px-7 select-none z-30 pt-1 text-black dark:text-white">
          <span className="text-[13px] font-bold tracking-tight">9:41</span>
          {/* Dynamic Island Pill */}
          <div className="w-24 h-4 bg-black rounded-full" />
          <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Content Container */}
        <div className="flex-1 overflow-y-auto flex flex-col relative bg-zinc-50 dark:bg-zinc-950">
          {children}
        </div>

        {/* Bottom Navigation Bar (When visible) */}
        {showBottomNav && (
          <nav className="w-full bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around py-2.5 px-2 z-20 shadow-md">
            <button
              onClick={() => handleNavClick("home")}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeNavTab === "home" ? activeColor : inactiveColor
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => handleNavClick("bookings")}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeNavTab === "bookings" ? activeColor : inactiveColor
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Bookings</span>
            </button>
            <button
              onClick={() => handleNavClick("support")}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeNavTab === "support" ? activeColor : inactiveColor
              }`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>Support</span>
            </button>
            <button
              onClick={() => handleNavClick("profile")}
              className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                activeNavTab === "profile" ? activeColor : inactiveColor
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </nav>
        )}

        {/* Bottom iOS Home Indicator */}
        <div className="w-full py-2 flex justify-center bg-white dark:bg-zinc-900">
          <div className="w-32 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
