import React from "react";
import { MockupProvider, useMockup } from "./MockupContext";
import { MobileShell } from "./MobileShell";
import { StudentScreens } from "./StudentScreens";
import { DriverScreens } from "./DriverScreens";
import { ChatModal } from "./ChatModal";

const AppContent: React.FC = () => {
  const { flow, studentScreen, driverScreen } = useMockup();

  // Determine whether to show bottom nav and which tab is active
  let showBottomNav = false;
  let activeNavTab: "home" | "bookings" | "support" | "profile" = "home";

  if (flow === "student") {
    if (studentScreen === 3) {
      showBottomNav = true;
      activeNavTab = "home";
    } else if (studentScreen === 11) {
      showBottomNav = true;
      activeNavTab = "bookings";
    } else if (studentScreen === 12) {
      showBottomNav = true;
      activeNavTab = "profile";
    } else if (studentScreen === 13) {
      showBottomNav = true;
      activeNavTab = "support";
    }
  } else {
    if (driverScreen === 4) {
      showBottomNav = true;
      activeNavTab = "home";
    } else if (driverScreen === 8) {
      showBottomNav = true;
      activeNavTab = "bookings";
    }
  }

  return (
    <MobileShell
      showBottomNav={showBottomNav}
      activeNavTab={activeNavTab}
      themeColor={flow === "student" ? "blue" : "orange"}
    >
      {flow === "student" ? <StudentScreens /> : <DriverScreens />}
      <ChatModal />
    </MobileShell>
  );
};

export const InteractiveApp: React.FC = () => {
  return (
    <MockupProvider>
      <AppContent />
    </MockupProvider>
  );
};
