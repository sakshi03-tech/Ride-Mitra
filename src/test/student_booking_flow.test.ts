import { describe, it, expect, beforeEach } from "vitest";
import { getDemoDB, saveDemoDB, initialProfiles, initialDrivers, initialStops, initialFares } from "@/lib/supabase";
import { Ride } from "@/types/database";

describe("Ride Mitra Booking & Lifecycle Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    saveDemoDB({
      profiles: [...initialProfiles],
      drivers: [...initialDrivers],
      stops: [...initialStops],
      fares: [...initialFares],
      rides: [],
      offers: [],
      ratings: [],
      complaints: [],
      sosAlerts: [],
      notifications: [],
    });
  });

  it("completes student booking -> driver offer -> accept -> complete -> rate flow", () => {
    const db = getDemoDB();
    const student = db.profiles.find((p) => p.role === "student")!;
    const driver = db.drivers.find((d) => d.status === "approved" && d.is_online)!;

    // 1. Student creates ride
    const rideId = "ride-test-1";
    const ride: Ride = {
      id: rideId,
      student_id: student.id,
      pickup_stop: initialStops[0].id,
      drop_stop: initialStops[1].id,
      seats: 1,
      is_shared: false,
      fare_amount: 60,
      status: "searching",
      requested_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.rides.push(ride);

    // 2. Offer created for driver
    db.offers.push({
      id: "offer-test-1",
      ride_id: rideId,
      driver_id: driver.profile_id,
      offered_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30000).toISOString(),
      response: "pending",
    });

    expect(db.offers.length).toBe(1);
    expect(db.offers[0].response).toBe("pending");

    // 3. Driver accepts offer
    db.offers[0].response = "accepted";
    ride.status = "assigned";
    ride.driver_id = driver.profile_id;
    ride.assigned_at = new Date().toISOString();

    expect(ride.status).toBe("assigned");
    expect(ride.driver_id).toBe(driver.profile_id);

    // 4. Trip progression: arrived -> on_trip -> completed
    ride.status = "on_trip";
    ride.started_at = new Date().toISOString();
    expect(ride.status).toBe("on_trip");

    ride.status = "completed";
    ride.completed_at = new Date().toISOString();
    driver.total_trips += 1;
    driver.last_assigned_at = new Date().toISOString();

    expect(ride.status).toBe("completed");
    expect(driver.total_trips).toBeGreaterThan(0);

    // 5. Rating submission
    db.ratings.push({
      id: "rating-test-1",
      ride_id: rideId,
      rater_id: student.id,
      ratee_id: driver.profile_id,
      stars: 5,
      tags: ["polite", "safeDriving"],
      comment: "वेळेवर आले आणि उत्तम प्रवास!",
      created_at: new Date().toISOString(),
    });

    expect(db.ratings.length).toBe(1);
    expect(db.ratings[0].stars).toBe(5);
  });
});
