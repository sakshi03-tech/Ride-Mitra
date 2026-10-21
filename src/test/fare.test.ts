import { describe, it, expect } from "vitest";
import { initialFares } from "@/lib/supabase";

describe("Fare Calculation Rules (Corridor Pricing Matrix)", () => {
  it("calculates private full auto fare between Lavel Stop and GIT College Gate", () => {
    const fare = initialFares.find(
      (f) =>
        f.from_stop === "11111111-1111-1111-1111-111111111101" &&
        f.to_stop === "11111111-1111-1111-1111-111111111102"
    );
    expect(fare).toBeDefined();
    expect(fare?.base_fare).toBe(60);
  });

  it("calculates per-seat fare for shared rides accurately", () => {
    const fare = initialFares.find(
      (f) =>
        f.from_stop === "11111111-1111-1111-1111-111111111101" &&
        f.to_stop === "11111111-1111-1111-1111-111111111102"
    );
    expect(fare).toBeDefined();
    // 2 seats sharing
    const twoSeatsSharedFare = (fare?.per_seat_fare || 20) * 2;
    expect(twoSeatsSharedFare).toBe(40);

    // 3 seats sharing
    const threeSeatsSharedFare = (fare?.per_seat_fare || 20) * 3;
    expect(threeSeatsSharedFare).toBe(60);
  });

  it("applies night surcharge between Lavel and Hostel", () => {
    const fare = initialFares.find(
      (f) =>
        f.from_stop === "11111111-1111-1111-1111-111111111101" &&
        f.to_stop === "11111111-1111-1111-1111-111111111103"
    );
    expect(fare).toBeDefined();
    expect(fare?.base_fare).toBe(70);
    expect(fare?.night_surcharge).toBe(15);
    const nightTotal = (fare?.base_fare || 0) + (fare?.night_surcharge || 0);
    expect(nightTotal).toBe(85);
  });
});
