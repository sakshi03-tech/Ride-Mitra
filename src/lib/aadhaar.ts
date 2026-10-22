/**
 * Aadhaar Number Validation using the Verhoeff Algorithm.
 *
 * Aadhaar is a 12-digit unique identity number issued by UIDAI.
 * The 12th digit is a checksum computed using the Verhoeff algorithm.
 */

// The multiplication table (d)
const d: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

// The permutation table (p)
const p: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

// Validates that an Aadhaar number satisfies UIDAI requirements:
// 1. Exactly 12 numeric digits
// 2. Does not start with 0 or 1
// 3. Not all identical digits (e.g. 2222 2222 2222)
// 4. Correct Verhoeff checksum
export function validateAadhaar(aadhaar: string): {
  isValid: boolean;
  message: string;
  formatted: string;
} {
  const clean = aadhaar.replace(/\D/g, "");

  // Format with spaces: 1234 5678 9012
  const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1 ").trim();

  if (clean.length === 0) {
    return {
      isValid: false,
      message: "कृपया १२ अंकी आधार नंबर टाका (Enter 12-digit Aadhaar number)",
      formatted: "",
    };
  }

  if (clean.length < 12) {
    return {
      isValid: false,
      message: `अजून ${12 - clean.length} अंक आवश्यक आहेत (${clean.length}/12 digits entered)`,
      formatted,
    };
  }

  if (clean.length > 12) {
    return {
      isValid: false,
      message: "आधार नंबर फक्त १२ अंकांचा असावा (Aadhaar must be exactly 12 digits)",
      formatted: formatted.slice(0, 14),
    };
  }

  // First digit cannot be 0 or 1 according to UIDAI standard
  if (clean.startsWith("0") || clean.startsWith("1")) {
    return {
      isValid: false,
      message: "आधार नंबर ० किंवा १ ने सुरू होत नाही (Aadhaar cannot start with 0 or 1)",
      formatted,
    };
  }

  // Check repeating digits like 222222222222
  if (/^(\d)\1{11}$/.test(clean)) {
    return {
      isValid: false,
      message: "अवैध आधार नंबर (Invalid repeating digits)",
      formatted,
    };
  }

  // Verhoeff validation
  let c = 0;
  const reversedDigits = clean.split("").reverse().map(Number);

  for (let i = 0; i < reversedDigits.length; i++) {
    c = d[c][p[i % 8][reversedDigits[i]]];
  }

  if (c === 0) {
    return {
      isValid: true,
      message: "आधार नंबर बरोबर आहे (Valid Aadhaar number verified ✓)",
      formatted,
    };
  } else {
    // If Verhoeff fails but it's a 12-digit valid format, we provide clear guidance
    // Note: To be user-friendly in production test environments, we can distinguish
    return {
      isValid: false,
      message: "आधार चेकसम अवैध आहे. कृपया नंबर तपासा (Invalid Aadhaar checksum)",
      formatted,
    };
  }
}

/**
 * Masks Aadhaar number for privacy (shows only last 4 digits)
 * e.g. "XXXX XXXX 1234"
 */
export function maskAadhaar(aadhaar: string): string {
  const clean = aadhaar.replace(/\D/g, "");
  if (clean.length < 4) return clean;
  const last4 = clean.slice(-4);
  return `XXXX XXXX ${last4}`;
}
