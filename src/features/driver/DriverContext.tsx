import React, { createContext, useContext, useState, useEffect } from "react";
import { Driver, Ride, RideOffer, Stop, Profile } from "@/types/database";
import { getDemoDB, saveDemoDB } from "@/lib/supabase";
import { updateRealRideStatus } from "@/lib/databaseService";
import { useAuth } from "@/features/auth/AuthContext";
import { soundService } from "@/lib/sound";

interface DriverContextType {
  driver: Driver | null;
  currentOffer: (RideOffer & { ride?: Ride & { pickup?: Stop; drop?: Stop; student?: Profile } }) | null;
  activeTrip: (Ride & { pickup?: Stop; drop?: Stop; student?: Profile }) | null;
  queuePosition: number;
  totalOnlineDrivers: number;
  offerCountdown: number;
  todayEarnings: number;
  weeklyEarnings: number;
  completedTripsCount: number;
  isOnline: boolean;
  toggleOnline: () => void;
  acceptOffer: () => Promise<{ success: boolean }>;
  declineOffer: (reason?: string) => Promise<{ success: boolean }>;
  markArrived: () => Promise<{ success: boolean }>;
  startTrip: () => Promise<{ success: boolean }>;
  completeTrip: () => Promise<{ success: boolean }>;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [currentOffer, setCurrentOffer] = useState<(RideOffer & { ride?: Ride & { pickup?: Stop; drop?: Stop; student?: Profile } }) | null>(null);
  const [activeTrip, setActiveTrip] = useState<(Ride & { pickup?: Stop; drop?: Stop; student?: Profile }) | null>(null);
  const [queuePosition, setQueuePosition] = useState<number>(1);
  const [totalOnlineDrivers, setTotalOnlineDrivers] = useState<number>(1);
  const [offerCountdown, setOfferCountdown] = useState<number>(30);
  const [todayEarnings, setTodayEarnings] = useState<number>(0);
  const [weeklyEarnings, setWeeklyEarnings] = useState<number>(0);
  const [completedTripsCount, setCompletedTripsCount] = useState<number>(0);

  const loadDriverState = () => {
    if (!user?.id) return;
    const db = getDemoDB();
    const d = db.drivers.find((item) => item.profile_id === user.id);
    if (!d) return;

    setDriver(d);

    // Calculate queue position among online approved drivers
    const onlineDrivers = db.drivers
      .filter((drv) => drv.status === "approved" && drv.is_online)
      .sort((a, b) => {
        const timeA = a.last_assigned_at ? new Date(a.last_assigned_at).getTime() : 0;
        const timeB = b.last_assigned_at ? new Date(b.last_assigned_at).getTime() : 0;
        return timeA - timeB;
      });

    setTotalOnlineDrivers(onlineDrivers.length);
    const myRank = onlineDrivers.findIndex((drv) => drv.profile_id === user.id);
    setQueuePosition(myRank !== -1 ? myRank + 1 : 1);

    // Check for pending offer
    const pendingOffer = db.offers.find(
      (o) =>
        o.driver_id === user.id &&
        o.response === "pending" &&
        new Date(o.expires_at).getTime() > Date.now()
    );

    if (pendingOffer) {
      const ride = db.rides.find((r) => r.id === pendingOffer.ride_id);
      if (ride && ride.status === "searching") {
        const pickup = db.stops.find((s) => s.id === ride.pickup_stop);
        const drop = db.stops.find((s) => s.id === ride.drop_stop);
        const student = db.profiles.find((p) => p.id === ride.student_id);
        setCurrentOffer({
          ...pendingOffer,
          ride: { ...ride, pickup, drop, student },
        });

        // Trigger sound alert
        soundService.startIncomingAlert();
      } else {
        setCurrentOffer(null);
        soundService.stopIncomingAlert();
      }
    } else {
      setCurrentOffer(null);
      soundService.stopIncomingAlert();
    }

    // Check for active assigned ride
    const currentRide = db.rides.find(
      (r) =>
        r.driver_id === user.id &&
        (r.status === "assigned" || r.status === "arriving" || r.status === "on_trip")
    );

    if (currentRide) {
      const pickup = db.stops.find((s) => s.id === currentRide.pickup_stop);
      const drop = db.stops.find((s) => s.id === currentRide.drop_stop);
      const student = db.profiles.find((p) => p.id === currentRide.student_id);
      setActiveTrip({ ...currentRide, pickup, drop, student });
    } else {
      setActiveTrip(null);
    }

    // Calculate earnings
    const completedRides = db.rides.filter(
      (r) => r.driver_id === user.id && r.status === "completed"
    );
    setCompletedTripsCount(completedRides.length);

    const now = new Date();
    const isToday = (dateStr: string) => {
      const d = new Date(dateStr);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    };

    const todaySum = completedRides
      .filter((r) => isToday(r.completed_at || r.requested_at))
      .reduce((sum, r) => sum + r.fare_amount, 0);
    setTodayEarnings(todaySum || d.total_trips * 50); // Fallback to seeded earnings if new demo

    const weekSum = completedRides.reduce((sum, r) => sum + r.fare_amount, 0);
    setWeeklyEarnings(weekSum || d.total_trips * 50 * 3);
  };

  useEffect(() => {
    loadDriverState();
    window.addEventListener("storage_db_updated", loadDriverState);
    return () => {
      window.removeEventListener("storage_db_updated", loadDriverState);
      soundService.stopIncomingAlert();
    };
  }, [user?.id]);

  // Countdown timer for pending offer
  useEffect(() => {
    if (!currentOffer) {
      setOfferCountdown(30);
      return;
    }

    const interval = setInterval(() => {
      const left = Math.max(
        0,
        Math.floor((new Date(currentOffer.expires_at).getTime() - Date.now()) / 1000)
      );
      setOfferCountdown(left);

      if (left <= 0) {
        clearInterval(interval);
        declineOffer("वेळ संपली (Timeout)");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentOffer]);

  // Wake Lock API to keep screen awake while online
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      if (driver?.is_online && "wakeLock" in navigator) {
        try {
          wakeLock = await (navigator as any).wakeLock.request("screen");
        } catch (e) {
          // ignore
        }
      }
    };
    requestWakeLock();
    return () => {
      if (wakeLock) wakeLock.release().catch(() => {});
    };
  }, [driver?.is_online]);

  const toggleOnline = () => {
    if (!driver || driver.status !== "approved") return;
    const db = getDemoDB();
    const d = db.drivers.find((item) => item.profile_id === driver.profile_id);
    if (d) {
      d.is_online = !d.is_online;
      d.last_online_at = d.is_online ? new Date().toISOString() : d.last_online_at;
      d.consecutive_declines = d.is_online ? 0 : d.consecutive_declines;
      saveDemoDB(db);
      loadDriverState();
    }
  };

  const acceptOffer = async () => {
    if (!currentOffer || !user?.id) return { success: false };
    soundService.stopIncomingAlert();

    const db = getDemoDB();
    const offer = db.offers.find((o) => o.id === currentOffer.id);
    const ride = db.rides.find((r) => r.id === currentOffer.ride_id);

    if (offer && ride) {
      offer.response = "accepted";
      offer.responded_at = new Date().toISOString();

      ride.status = "assigned";
      ride.driver_id = user.id;
      ride.assigned_at = new Date().toISOString();
      ride.updated_at = new Date().toISOString();

      // Expire other offers
      db.offers.forEach((o) => {
        if (o.ride_id === ride.id && o.id !== offer.id && o.response === "pending") {
          o.response = "expired";
        }
      });

      // Reset driver declines
      const d = db.drivers.find((drv) => drv.profile_id === user.id);
      if (d) {
        d.consecutive_declines = 0;
        d.last_assigned_at = new Date().toISOString();
      }

      // Notify student
      db.notifications.push({
        id: "notif-assigned-" + Date.now(),
        user_id: ride.student_id,
        title: "रिक्षा चालक मिळाला!",
        body: `चालक ${profile?.full_name} (${driver?.auto_number}) तुमच्याकडे येत आहेत.`,
        type: "ride_assigned",
        data: { ride_id: ride.id, driver_id: user.id },
        is_read: false,
        created_at: new Date().toISOString(),
      });

      saveDemoDB(db);
      loadDriverState();
      return { success: true };
    }
    return { success: false };
  };

  const declineOffer = async (reason?: string) => {
    if (!currentOffer || !user?.id) return { success: false };
    soundService.stopIncomingAlert();

    const db = getDemoDB();
    const offer = db.offers.find((o) => o.id === currentOffer.id);
    const ride = db.rides.find((r) => r.id === currentOffer.ride_id);

    if (offer) {
      offer.response = "declined";
      offer.responded_at = new Date().toISOString();

      const d = db.drivers.find((drv) => drv.profile_id === user.id);
      if (d) {
        d.consecutive_declines = (d.consecutive_declines || 0) + 1;
        d.last_assigned_at = new Date().toISOString();
        if (d.consecutive_declines >= 3) {
          d.is_online = false; // Auto offline after 3 strikes
        }
      }

      // Rotate offer to next online driver in fair queue
      const nextDriver = db.drivers
        .filter(
          (drv) =>
            drv.status === "approved" &&
            drv.is_online &&
            drv.profile_id !== user.id &&
            !db.offers.some((o) => o.ride_id === offer.ride_id && o.driver_id === drv.profile_id)
        )
        .sort((a, b) => {
          const timeA = a.last_assigned_at ? new Date(a.last_assigned_at).getTime() : 0;
          const timeB = b.last_assigned_at ? new Date(b.last_assigned_at).getTime() : 0;
          return timeA - timeB;
        })[0];

      if (nextDriver && ride && ride.status === "searching") {
        db.offers.push({
          id: "offer-" + Date.now(),
          ride_id: ride.id,
          driver_id: nextDriver.profile_id,
          offered_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30000).toISOString(),
          response: "pending",
        });
        nextDriver.last_assigned_at = new Date().toISOString();
      } else if (ride && ride.status === "searching") {
        ride.status = "no_driver_found";
      }

      saveDemoDB(db);
      loadDriverState();
      return { success: true };
    }
    return { success: false };
  };

  const markArrived = async () => {
    if (!activeTrip) return { success: false };
    const db = getDemoDB();
    const ride = db.rides.find((r) => r.id === activeTrip.id);
    if (ride) {
      ride.status = "arriving";
      ride.updated_at = new Date().toISOString();
      updateRealRideStatus(activeTrip.id, "arriving");
      saveDemoDB(db);
      loadDriverState();
      return { success: true };
    }
    return { success: false };
  };

  const startTrip = async () => {
    if (!activeTrip) return { success: false };
    const db = getDemoDB();
    const ride = db.rides.find((r) => r.id === activeTrip.id);
    if (ride) {
      ride.status = "on_trip";
      ride.started_at = new Date().toISOString();
      ride.updated_at = new Date().toISOString();
      updateRealRideStatus(activeTrip.id, "on_trip");
      saveDemoDB(db);
      loadDriverState();
      return { success: true };
    }
    return { success: false };
  };

  const completeTrip = async () => {
    if (!activeTrip || !user?.id) return { success: false };
    const db = getDemoDB();
    const ride = db.rides.find((r) => r.id === activeTrip.id);
    if (ride) {
      ride.status = "completed";
      ride.completed_at = new Date().toISOString();
      ride.updated_at = new Date().toISOString();
      updateRealRideStatus(activeTrip.id, "completed");

      // Update driver trips & cycle to back of queue
      const d = db.drivers.find((drv) => drv.profile_id === user.id);
      if (d) {
        d.total_trips = (d.total_trips || 0) + 1;
        d.last_assigned_at = new Date().toISOString();
      }

      saveDemoDB(db);
      loadDriverState();
      return { success: true };
    }
    return { success: false };
  };

  return (
    <DriverContext.Provider
      value={{
        driver,
        currentOffer,
        activeTrip,
        queuePosition,
        totalOnlineDrivers,
        offerCountdown,
        todayEarnings,
        weeklyEarnings,
        completedTripsCount,
        isOnline: driver?.is_online || false,
        toggleOnline,
        acceptOffer,
        declineOffer,
        markArrived,
        startTrip,
        completeTrip,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error("useDriver must be used within a DriverProvider");
  }
  return context;
};
