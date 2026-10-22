import React from "react";
import { useMockup } from "./MockupContext";
import { Home, Calendar, HelpCircle, User } from "lucide-react";

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
  const { flow, setStudentScreen, setDriverScreen, toggleLanguage, currentLanguage } = useMockup();

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
      {/* Top Language Toggle Pill */}
      <div className="fixed top-3 right-3 z-50">
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-full bg-zinc-900/95 text-amber-300 shadow-xl text-xs font-black border border-zinc-700/80 backdrop-blur-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition"
          title="Change Language (मराठी / English)"
        >
          <span>🌐</span>
          <span>{currentLanguage.startsWith("mr") ? "मराठी" : "EN"}</span>
        </button>
      </div>

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
