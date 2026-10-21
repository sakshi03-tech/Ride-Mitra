-- 001_initial_schema.sql
-- Ride Mitra Database Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Custom Enums
create type user_role as enum ('student', 'driver', 'admin');
create type driver_status as enum ('pending', 'approved', 'rejected', 'suspended');
create type ride_status as enum ('searching', 'assigned', 'arriving', 'on_trip', 'completed', 'cancelled', 'no_driver_found');
create type offer_response as enum ('pending', 'accepted', 'declined', 'expired');
create type complaint_status as enum ('open', 'in_review', 'resolved', 'rejected');
create type sos_status as enum ('active', 'acknowledged', 'resolved');

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'student',
  full_name text not null,
  phone text not null unique,
  avatar_url text,
  language text not null default 'mr' check (language in ('mr', 'en')),
  is_blocked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Student Details
create table if not exists public.student_details (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  college_id text,
  hostel_room text,
  reliability_score numeric(4, 2) not null default 100.00 check (reliability_score >= 0 and reliability_score <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Drivers Table
create table if not exists public.drivers (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  auto_number text not null unique,
  licence_url text,
  rc_url text,
  seat_capacity int not null default 3 check (seat_capacity between 1 and 6),
  status driver_status not null default 'pending',
  rejection_reason text,
  is_online boolean not null default false,
  last_online_at timestamptz,
  last_assigned_at timestamptz,
  queue_position int not null default 0,
  consecutive_declines int not null default 0,
  rating_avg numeric(3, 2) not null default 5.00 check (rating_avg >= 1.00 and rating_avg <= 5.00),
  rating_count int not null default 0,
  total_trips int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Driver Live Locations
create table if not exists public.driver_locations (
  driver_id uuid primary key references public.drivers(profile_id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  heading double precision,
  updated_at timestamptz not null default now()
);

-- 5. Stops Table (Fixed Corridor Lavel ↔ GIT / Hostel)
create table if not exists public.stops (
  id uuid primary key default uuid_generate_v4(),
  name_en text not null,
  name_mr text not null,
  lat double precision not null,
  lng double precision not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 6. Fares Table
create table if not exists public.fares (
  id uuid primary key default uuid_generate_v4(),
  from_stop uuid not null references public.stops(id) on delete cascade,
  to_stop uuid not null references public.stops(id) on delete cascade,
  base_fare numeric(8, 2) not null,
  per_seat_fare numeric(8, 2) not null,
  night_surcharge numeric(8, 2) not null default 0.00,
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  created_at timestamptz not null default now(),
  constraint unique_fare_pair unique (from_stop, to_stop, valid_from)
);

-- 7. Rides Table
create table if not exists public.rides (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  driver_id uuid references public.drivers(profile_id) on delete set null,
  pickup_stop uuid not null references public.stops(id),
  drop_stop uuid not null references public.stops(id),
  seats int not null default 1 check (seats between 1 and 4),
  is_shared boolean not null default false,
  fare_amount numeric(8, 2) not null check (fare_amount >= 0),
  status ride_status not null default 'searching',
  scheduled_for timestamptz,
  requested_at timestamptz not null default now(),
  assigned_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_by uuid references public.profiles(id),
  cancel_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. Ride Passengers (For Shared Rides)
create table if not exists public.ride_passengers (
  id uuid primary key default uuid_generate_v4(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  seats int not null default 1 check (seats between 1 and 4),
  fare_share numeric(8, 2) not null check (fare_share >= 0),
  created_at timestamptz not null default now(),
  constraint unique_ride_passenger unique (ride_id, student_id)
);

-- 9. Ride Offers (Fair Rotation Offer Queue)
create table if not exists public.ride_offers (
  id uuid primary key default uuid_generate_v4(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  driver_id uuid not null references public.drivers(profile_id) on delete cascade,
  offered_at timestamptz not null default now(),
  expires_at timestamptz not null,
  response offer_response not null default 'pending',
  responded_at timestamptz,
  constraint unique_ride_driver_offer unique (ride_id, driver_id)
);

-- 10. Ratings
create table if not exists public.ratings (
  id uuid primary key default uuid_generate_v4(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  rater_id uuid not null references public.profiles(id) on delete cascade,
  ratee_id uuid not null references public.profiles(id) on delete cascade,
  stars int not null check (stars between 1 and 5),
  tags text[] default array[]::text[],
  comment text,
  created_at timestamptz not null default now(),
  constraint unique_ride_rater unique (ride_id, rater_id)
);

-- 11. Complaints
create table if not exists public.complaints (
  id uuid primary key default uuid_generate_v4(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  raised_by uuid not null references public.profiles(id) on delete cascade,
  against uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  description text not null,
  status complaint_status not null default 'open',
  admin_notes text,
  resolution_message text,
  resolved_by uuid references public.profiles(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 12. SOS Alerts
create table if not exists public.sos_alerts (
  id uuid primary key default uuid_generate_v4(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  raised_by uuid not null references public.profiles(id) on delete cascade,
  lat double precision,
  lng double precision,
  status sos_status not null default 'active',
  handled_by uuid references public.profiles(id),
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

-- 13. Notifications
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null,
  data jsonb default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 14. Push Subscriptions
create table if not exists public.push_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  endpoint text not null,
  keys jsonb not null,
  user_agent text,
  created_at timestamptz not null default now(),
  constraint unique_user_endpoint unique (user_id, endpoint)
);

-- 15. App Settings
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- 16. Audit Log
create table if not exists public.audit_log (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Performance Indexes
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_phone on public.profiles(phone);
create index if not exists idx_drivers_status_online on public.drivers(status, is_online);
create index if not exists idx_drivers_last_assigned on public.drivers(last_assigned_at asc nulls first);
create index if not exists idx_rides_status on public.rides(status);
create index if not exists idx_rides_student on public.rides(student_id);
create index if not exists idx_rides_driver on public.rides(driver_id);
create index if not exists idx_ride_offers_status on public.ride_offers(response, expires_at);
create index if not exists idx_notifications_user_unread on public.notifications(user_id, is_read);
create index if not exists idx_fares_lookup on public.fares(from_stop, to_stop);
