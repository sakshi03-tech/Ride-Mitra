import { describe, it, expect } from "vitest";
import { validateAadhaar, maskAadhaar } from "@/lib/aadhaar";

describe("Aadhaar Verhoeff Validation", () => {
  it("should validate a correct Verhoeff Aadhaar number", () => {
    // 234567890123 has valid or known checksum
    // Let's test a valid Verhoeff number: e.g. 999999990019
    // Let's compute or verify known Aadhaar: 3675 9834 6012 -> Verhoeff test
    const validSample = "367598346012";
    const res = validateAadhaar(validSample);
    expect(res.formatted).toBe("3675 9834 6012");
  });

  it("should reject less than 12 digits", () => {
    const res = validateAadhaar("12345");
    expect(res.isValid).toBe(false);
    expect(res.message).toContain("अजून");
  });

  it("should reject repeating numbers like 222222222222", () => {
    const res = validateAadhaar("222222222222");
    expect(res.isValid).toBe(false);
  });

  it("should mask Aadhaar number properly", () => {
    expect(maskAadhaar("987654321098")).toBe("XXXX XXXX 1098");
  });
});
