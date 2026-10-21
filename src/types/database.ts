export type UserRole = "student" | "driver" | "admin";
export type DriverStatus = "pending" | "approved" | "rejected" | "suspended";
export type RideStatus =
  | "searching"
  | "assigned"
  | "arriving"
  | "on_trip"
  | "completed"
  | "cancelled"
  | "no_driver_found";
export type OfferResponse = "pending" | "accepted" | "declined" | "expired";
export type ComplaintStatus = "open" | "in_review" | "resolved" | "rejected";
export type SosStatus = "active" | "acknowledged" | "resolved";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone: string;
  avatar_url?: string | null;
  language: "mr" | "en";
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentDetails {
  profile_id: string;
  college_id?: string | null;
  hostel_room?: string | null;
  reliability_score: number;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  profile_id: string;
  auto_number: string;
  licence_url?: string | null;
  rc_url?: string | null;
  seat_capacity: number;
  status: DriverStatus;
  rejection_reason?: string | null;
  is_online: boolean;
  last_online_at?: string | null;
  last_assigned_at?: string | null;
  queue_position: number;
  consecutive_declines: number;
  rating_avg: number;
  rating_count: number;
  total_trips: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Stop {
  id: string;
  name_en: string;
  name_mr: string;
  lat: number;
  lng: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Fare {
  id: string;
  from_stop: string;
  to_stop: string;
  base_fare: number;
  per_seat_fare: number;
  night_surcharge: number;
  valid_from: string;
  valid_to?: string | null;
}

export interface Ride {
  id: string;
  student_id: string;
  driver_id?: string | null;
  pickup_stop: string;
  drop_stop: string;
  seats: number;
  is_shared: boolean;
  fare_amount: number;
  status: RideStatus;
  scheduled_for?: string | null;
  requested_at: string;
  assigned_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  cancelled_by?: string | null;
  cancel_reason?: string | null;
  created_at: string;
  updated_at: string;
  pickup?: Stop;
  drop?: Stop;
  driver?: Driver & { profile?: Profile };
  student?: Profile;
}

export interface RideOffer {
  id: string;
  ride_id: string;
  driver_id: string;
  offered_at: string;
  expires_at: string;
  response: OfferResponse;
  responded_at?: string | null;
  ride?: Ride;
}

export interface Rating {
  id: string;
  ride_id: string;
  rater_id: string;
  ratee_id: string;
  stars: number;
  tags: string[];
  comment?: string | null;
  created_at: string;
}

export interface Complaint {
  id: string;
  ride_id: string;
  raised_by: string;
  against: string;
  category: string;
  description: string;
  status: ComplaintStatus;
  admin_notes?: string | null;
  resolution_message?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
  ride?: Ride;
  raised_by_profile?: Profile;
  against_profile?: Profile;
}

export interface SosAlert {
  id: string;
  ride_id: string;
  raised_by: string;
  lat?: number | null;
  lng?: number | null;
  status: SosStatus;
  handled_by?: string | null;
  handled_at?: string | null;
  created_at: string;
  ride?: Ride;
  raised_by_profile?: Profile;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface AppSetting {
  key: string;
  value: any;
  updated_at: string;
}
