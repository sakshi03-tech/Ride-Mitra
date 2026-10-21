import React, { createContext, useContext, useState, useEffect } from "react";
import { Stop, Fare, Ride, RideOffer, Driver, Profile } from "@/types/database";
import { getDemoDB, saveDemoDB, initialStops, initialFares } from "@/lib/supabase";
import { fetchRealStops, fetchRealFares, createRealRide, updateRealRideStatus } from "@/lib/databaseService";
import { useAuth } from "@/features/auth/AuthContext";

interface BookingContextType {
  stops: Stop[];
  fares: Fare[];
  activeRide: Ride | null;
  ridesHistory: Ride[];
  pickupStopId: string;
  dropStopId: string;
  seats: number;
  isShared: boolean;
  scheduledTime: string;
  calculatedFare: number;
  isSearching: boolean;
  setPickupStopId: (id: string) => void;
  setDropStopId: (id: string) => void;
  setSeats: (n: number) => void;
  setIsShared: (b: boolean) => void;
  setScheduledTime: (t: string) => void;
  bookRide: () => Promise<{ success: boolean; rideId?: string; error?: string }>;
  cancelActiveRide: (reason?: string) => Promise<{ success: boolean }>;
  raiseSos: () => Promise<{ success: boolean }>;
  rateTrip: (stars: number, tags: string[], comment?: string) => Promise<{ success: boolean }>;
  refreshRides: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stops, setStops] = useState<Stop[]>(initialStops);
  const [fares, setFares] = useState<Fare[]>(initialFares);
  const [pickupStopId, setPickupStopId] = useState<string>(initialStops[0].id);
  const [dropStopId, setDropStopId] = useState<string>(initialStops[1].id);
  const [seats, setSeats] = useState<number>(1);
  const [isShared, setIsShared] = useState<boolean>(false);
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [calculatedFare, setCalculatedFare] = useState<number>(60);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [ridesHistory, setRidesHistory] = useState<Ride[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Load stops, fares and rides
  const loadData = () => {
    const db = getDemoDB();
    setStops(db.stops);
    setFares(db.fares);

    fetchRealStops().then((real) => {
      if (real && real.length > 0) setStops(real as any);
    });
    fetchRealFares().then((real) => {
      if (real && real.length > 0) setFares(real as any);
    });

    if (user?.id) {
      const userRides = db.rides.filter((r) => r.student_id === user.id);
      setRidesHistory(userRides.sort((a, b) => (b.requested_at > a.requested_at ? 1 : -1)));

      const active = userRides.find(
        (r) => r.status === "searching" || r.status === "assigned" || r.status === "arriving" || r.status === "on_trip"
      );
      if (active) {
        // Hydrate pickup, drop, driver
        const pickup = db.stops.find((s) => s.id === active.pickup_stop);
        const drop = db.stops.find((s) => s.id === active.drop_stop);
        let driverObj: (Driver & { profile?: Profile }) | undefined = undefined;
        if (active.driver_id) {
          const d = db.drivers.find((drv) => drv.profile_id === active.driver_id);
          const p = db.profiles.find((prof) => prof.id === active.driver_id);
          if (d) driverObj = { ...d, profile: p };
        }
        setActiveRide({ ...active, pickup, drop, driver: driverObj });
        setIsSearching(active.status === "searching");
      } else {
        setActiveRide(null);
        setIsSearching(false);
      }
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage_db_updated", loadData);
    return () => window.removeEventListener("storage_db_updated", loadData);
  }, [user?.id]);

  // Reactive Fare Calculation
  useEffect(() => {
    if (!pickupStopId || !dropStopId || pickupStopId === dropStopId) {
      setCalculatedFare(0);
      return;
    }

    const fareEntry = fares.find(
      (f) =>
        (f.from_stop === pickupStopId && f.to_stop === dropStopId) ||
        (f.from_stop === dropStopId && f.to_stop === pickupStopId)
    );

    let fare = 50; // fallback
    if (fareEntry) {
      fare = isShared ? fareEntry.per_seat_fare * seats : fareEntry.base_fare;
    } else {
      fare = isShared ? 20 * seats : 60;
    }
    setCalculatedFare(fare);
  }, [pickupStopId, dropStopId, seats, isShared, fares]);

  const bookRide = async () => {
    if (!user?.id) {
      return { success: false, error: "कृपया आधी लॉगिन करा" };
    }
    if (pickupStopId === dropStopId) {
      return { success: false, error: "पिकअप आणि ड्रॉप वेगळे असावेत" };
    }

    const db = getDemoDB();
    const rideId = "ride-" + Date.now();

    const newRide: Ride = {
      id: rideId,
      student_id: user.id,
      pickup_stop: pickupStopId,
      drop_stop: dropStopId,
      seats,
      is_shared: isShared,
      fare_amount: calculatedFare,
      status: "searching",
      scheduled_for: scheduledTime || undefined,
      requested_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Find next available online approved driver (Fair rotation queue)
    const eligibleDrivers = db.drivers
      .filter((d) => d.status === "approved" && d.is_online)
      .sort((a, b) => {
        const timeA = a.last_assigned_at ? new Date(a.last_assigned_at).getTime() : 0;
        const timeB = b.last_assigned_at ? new Date(b.last_assigned_at).getTime() : 0;
        return timeA - timeB;
      });

    const chosenDriver = eligibleDrivers[0];

    db.rides.push(newRide);
    createRealRide({
      student_id: user.id,
      pickup_stop: pickupStopId,
      drop_stop: dropStopId,
      seats,
      is_shared: isShared,
      fare_amount: calculatedFare,
    });

    if (chosenDriver) {
      // Create offer for this driver (30s expiry)
      const offer: RideOffer = {
        id: "offer-" + Date.now(),
        ride_id: rideId,
        driver_id: chosenDriver.profile_id,
        offered_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30000).toISOString(),
        response: "pending",
      };
      db.offers.push(offer);

      // Update driver last_assigned_at
      chosenDriver.last_assigned_at = new Date().toISOString();

      // Add driver notification
      db.notifications.push({
        id: "notif-" + Date.now(),
        user_id: chosenDriver.profile_id,
        title: "नवीन रिक्षा भाडे आले आहे! (₹" + calculatedFare + ")",
        body: "पिकअपसाठी ३० सेकंदात स्वीकारा.",
        type: "ride_offer",
        data: { ride_id: rideId, fare: calculatedFare },
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }

    saveDemoDB(db);
    loadData();

    return { success: true, rideId };
  };

  const cancelActiveRide = async (reason?: string) => {
    if (!activeRide) return { success: false };
    const db = getDemoDB();
    const ride = db.rides.find((r) => r.id === activeRide.id);
    if (ride) {
      ride.status = "cancelled";
      ride.cancelled_by = user?.id;
      ride.cancel_reason = reason || "प्रवाशाने रद्द केले";
      ride.updated_at = new Date().toISOString();
      updateRealRideStatus(activeRide.id, "cancelled");

      // Expire offers
      db.offers.forEach((o) => {
        if (o.ride_id === ride.id && o.response === "pending") {
          o.response = "expired";
        }
      });

      saveDemoDB(db);
      loadData();
    }
    return { success: true };
  };

  const raiseSos = async () => {
    if (!activeRide) return { success: false };
    const db = getDemoDB();
    db.sosAlerts.push({
      id: "sos-" + Date.now(),
      ride_id: activeRide.id,
      raised_by: user?.id || "unknown",
      lat: 17.738,
      lng: 73.506,
      status: "active",
      created_at: new Date().toISOString(),
    });

    // Notify admins
    const admins = db.profiles.filter((p) => p.role === "admin");
    admins.forEach((admin) => {
      db.notifications.push({
        id: "notif-sos-" + Date.now(),
        user_id: admin.id,
        title: "🚨 आणीबाणी SOS इशारा!",
        body: `प्रवासी ${user?.phone} यांनी प्रवासादरम्यान SOS दाबली आहे!`,
        type: "sos_alert",
        data: { ride_id: activeRide.id },
        is_read: false,
        created_at: new Date().toISOString(),
      });
    });

    saveDemoDB(db);
    return { success: true };
  };

  const rateTrip = async (stars: number, tags: string[], comment?: string) => {
    if (!activeRide || !activeRide.driver_id || !user?.id) return { success: false };
    const db = getDemoDB();
    db.ratings.push({
      id: "rating-" + Date.now(),
      ride_id: activeRide.id,
      rater_id: user.id,
      ratee_id: activeRide.driver_id,
      stars,
      tags,
      comment,
      created_at: new Date().toISOString(),
    });

    // Recalculate driver rating
    const driverRatings = db.ratings.filter((r) => r.ratee_id === activeRide.driver_id);
    const sum = driverRatings.reduce((acc, curr) => acc + curr.stars, 0);
    const avg = Number((sum / driverRatings.length).toFixed(2));

    const driver = db.drivers.find((d) => d.profile_id === activeRide.driver_id);
    if (driver) {
      driver.rating_avg = avg;
      driver.rating_count = driverRatings.length;
    }

    saveDemoDB(db);
    loadData();
    return { success: true };
  };

  return (
    <BookingContext.Provider
      value={{
        stops,
        fares,
        activeRide,
        ridesHistory,
        pickupStopId,
        dropStopId,
        seats,
        isShared,
        scheduledTime,
        calculatedFare,
        isSearching,
        setPickupStopId,
        setDropStopId,
        setSeats,
        setIsShared,
        setScheduledTime,
        bookRide,
        cancelActiveRide,
        raiseSos,
        rateTrip,
        refreshRides: loadData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
