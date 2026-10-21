import { createClient } from "@supabase/supabase-js";
import {
  Profile,
  Driver,
  Stop,
  Fare,
  Ride,
  RideOffer,
  Rating,
  Complaint,
  SosAlert,
  NotificationItem,
} from "../types/database";

// Real Supabase credentials from sakshi03-tech's Project
export const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://igrzsnestmlxuapyvflf.supabase.co";
export const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_CYAlZ_3Qcf4FtPSXynGDbw__lMiapp6";

// Live Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

// Local storage key for real-time reactivity and offline fallback
const STORAGE_KEY = "ride_mitra_realtime_db_v2";

export interface DemoDB {
  profiles: Profile[];
  drivers: Driver[];
  stops: Stop[];
  fares: Fare[];
  rides: Ride[];
  offers: RideOffer[];
  ratings: Rating[];
  complaints: Complaint[];
  sosAlerts: SosAlert[];
  notifications: NotificationItem[];
  auditLog?: Array<{ id: string; action: string; entity: string; entity_id: string; created_at: string }>;
}

export const initialStops: Stop[] = [
  {
    id: "11111111-1111-1111-1111-111111111101",
    name_en: "Lavel Highway Stop",
    name_mr: "लावेल हायवे थांबा",
    lat: 17.7289,
    lng: 73.4981,
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "11111111-1111-1111-1111-111111111102",
    name_en: "GIT College Main Gate",
    name_mr: "जीआयटी मुख्य प्रवेशद्वार",
    lat: 17.7425,
    lng: 73.5132,
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "11111111-1111-1111-1111-111111111103",
    name_en: "GIT Boys & Girls Hostel",
    name_mr: "जीआयटी हॉस्टेल संकुल",
    lat: 17.745,
    lng: 73.5155,
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: "11111111-1111-1111-1111-111111111104",
    name_en: "Lavel Bazaar / ST Stand",
    name_mr: "लावेल बाजार / एसटी बस स्टॉप",
    lat: 17.727,
    lng: 73.496,
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString(),
  },
];

export const initialFares: Fare[] = [
  {
    id: "fare-1",
    from_stop: "11111111-1111-1111-1111-111111111101",
    to_stop: "11111111-1111-1111-1111-111111111102",
    base_fare: 30,
    per_seat_fare: 20,
    night_surcharge: 15,
    valid_from: new Date().toISOString(),
  },
  {
    id: "fare-2",
    from_stop: "11111111-1111-1111-1111-111111111101",
    to_stop: "11111111-1111-1111-1111-111111111103",
    base_fare: 40,
    per_seat_fare: 25,
    night_surcharge: 15,
    valid_from: new Date().toISOString(),
  },
  {
    id: "fare-3",
    from_stop: "11111111-1111-1111-1111-111111111102",
    to_stop: "11111111-1111-1111-1111-111111111103",
    base_fare: 30,
    per_seat_fare: 10,
    night_surcharge: 10,
    valid_from: new Date().toISOString(),
  },
];

export const initialProfiles: Profile[] = [
  {
    id: "admin-1",
    role: "admin",
    full_name: "प्रा. जोशी सर (GIT Admin)",
    phone: "9876543210",
    language: "mr",
    is_blocked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "driver-1",
    role: "driver",
    full_name: "Suresh Patil",
    phone: "9876543210",
    language: "mr",
    is_blocked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "driver-2",
    role: "driver",
    full_name: "Prakash Mane",
    phone: "9822114455",
    language: "mr",
    is_blocked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "student-1",
    role: "student",
    full_name: "Student",
    phone: "9123456789",
    language: "mr",
    is_blocked: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const initialDrivers: Driver[] = [
  {
    profile_id: "driver-1",
    auto_number: "MH 08 AB 1234",
    seat_capacity: 3,
    status: "approved",
    is_online: true,
    last_online_at: new Date().toISOString(),
    last_assigned_at: new Date(Date.now() - 3600000).toISOString(),
    queue_position: 1,
    consecutive_declines: 0,
    rating_avg: 4.8,
    rating_count: 52,
    total_trips: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    profile_id: "driver-2",
    auto_number: "MH 08 BF 5678",
    seat_capacity: 3,
    status: "approved",
    is_online: true,
    last_online_at: new Date().toISOString(),
    last_assigned_at: new Date(Date.now() - 1800000).toISOString(),
    queue_position: 2,
    consecutive_declines: 0,
    rating_avg: 4.6,
    rating_count: 38,
    total_trips: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Asynchronous background sync to real Supabase tables
export async function syncWithSupabaseRemote(tableName: string, data: any) {
  try {
    await supabase.from(tableName).upsert(data);
  } catch (err) {
    // Silently continue if network offline or table not yet created
    console.warn(`Supabase sync for ${tableName}:`, err);
  }
}

export function getDemoDB(): DemoDB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to parse storage", err);
  }

  const defaultDb: DemoDB = {
    profiles: initialProfiles,
    drivers: initialDrivers,
    stops: initialStops,
    fares: initialFares,
    rides: [],
    offers: [],
    ratings: [],
    complaints: [],
    sosAlerts: [],
    notifications: [],
  };
  saveDemoDB(defaultDb);
  return defaultDb;
}

export function saveDemoDB(db: DemoDB): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new Event("storage_db_updated"));

    // Async sync to live Supabase backend
    if (!isDemoMode && db.rides.length > 0) {
      const latestRide = db.rides[db.rides.length - 1];
      syncWithSupabaseRemote("rides", {
        id: latestRide.id,
        pickup_stop: latestRide.pickup_stop,
        drop_stop: latestRide.drop_stop,
        fare_amount: latestRide.fare_amount,
        status: latestRide.status,
      });
    }
  } catch (err) {
    console.error("Failed to persist db", err);
  }
}
