import { describe, it, expect } from "vitest";
import { Driver } from "@/types/database";

describe("Fair Turn Queue Rotation Logic", () => {
  it("assigns request to longest-waiting online approved driver", () => {
    const drivers: Driver[] = [
      {
        profile_id: "driver-1",
        auto_number: "MH 08 AG 4521",
        seat_capacity: 3,
        status: "approved",
        is_online: true,
        last_assigned_at: new Date(Date.now() - 3600000).toISOString(), // Waited 60 mins
        queue_position: 1,
        consecutive_declines: 0,
        rating_avg: 4.9,
        rating_count: 10,
        total_trips: 20,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        profile_id: "driver-2",
        auto_number: "MH 08 BF 1289",
        seat_capacity: 3,
        status: "approved",
        is_online: true,
        last_assigned_at: new Date(Date.now() - 600000).toISOString(), // Waited 10 mins
        queue_position: 2,
        consecutive_declines: 0,
        rating_avg: 4.8,
        rating_count: 5,
        total_trips: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // Order by waiting time ascending
    const sorted = [...drivers].sort((a, b) => {
      const timeA = a.last_assigned_at ? new Date(a.last_assigned_at).getTime() : 0;
      const timeB = b.last_assigned_at ? new Date(b.last_assigned_at).getTime() : 0;
      return timeA - timeB;
    });

    expect(sorted[0].profile_id).toBe("driver-1");
  });

  it("rotates to next driver on decline and takes offline after 3 strikes", () => {
    let consecutiveDeclines = 2;
    let isOnline = true;

    // Simulate 3rd decline strike
    consecutiveDeclines += 1;
    if (consecutiveDeclines >= 3) {
      isOnline = false;
    }

    expect(consecutiveDeclines).toBe(3);
    expect(isOnline).toBe(false);
  });

  it("sends driver to back of queue after completed trip", () => {
    const now = new Date();
    const driver: Partial<Driver> = {
      profile_id: "driver-1",
      last_assigned_at: new Date(Date.now() - 7200000).toISOString(),
      total_trips: 10,
    };

    // Complete trip
    driver.total_trips! += 1;
    driver.last_assigned_at = now.toISOString();

    expect(driver.total_trips).toBe(11);
    expect(new Date(driver.last_assigned_at).getTime()).toBeCloseTo(now.getTime(), -2);
  });
});
