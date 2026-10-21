-- =========================================================
-- RIDE MITRA: COMPLETE DATABASE SETUP SCRIPT FOR SUPABASE
-- Run this entire script in Supabase Dashboard -> SQL Editor
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop existing types if recreating
do $$ begin
  create type user_role as enum ('student', 'driver', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type driver_status as enum ('pending', 'approved', 'rejected', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ride_status as enum ('searching', 'assigned', 'arriving', 'on_trip', 'completed', 'cancelled', 'no_driver_found');
exception when duplicate_object then null; end $$;

do $$ begin
  create type offer_response as enum ('pending', 'accepted', 'declined', 'expired');
exception when duplicate_object then null; end $$;

do $$ begin
  create type complaint_status as enum ('open', 'in_review', 'resolved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type sos_status as enum ('active', 'acknowledged', 'resolved');
exception when duplicate_object then null; end $$;

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
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

-- 5. Stops Table (Fixed Corridor Lavel <-> GIT / Hostel)
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

-- 8. Ride Passengers
create table if not exists public.ride_passengers (
  id uuid primary key default uuid_generate_v4(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  seats int not null default 1 check (seats between 1 and 4),
  fare_share numeric(8, 2) not null check (fare_share >= 0),
  created_at timestamptz not null default now(),
  constraint unique_ride_passenger unique (ride_id, student_id)
);

-- 9. Ride Offers
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

-- 14. App Settings
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Enable RLS and permissive public access policies for initial setup
alter table public.profiles enable row level security;
alter table public.drivers enable row level security;
alter table public.stops enable row level security;
alter table public.fares enable row level security;
alter table public.rides enable row level security;
alter table public.ride_offers enable row level security;
alter table public.ratings enable row level security;
alter table public.complaints enable row level security;
alter table public.sos_alerts enable row level security;
alter table public.notifications enable row level security;
alter table public.app_settings enable row level security;

-- Permissive policies for quick-start testing
create policy "Allow all on profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all on drivers" on public.drivers for all using (true) with check (true);
create policy "Allow all on stops" on public.stops for all using (true) with check (true);
create policy "Allow all on fares" on public.fares for all using (true) with check (true);
create policy "Allow all on rides" on public.rides for all using (true) with check (true);
create policy "Allow all on ride_offers" on public.ride_offers for all using (true) with check (true);
create policy "Allow all on ratings" on public.ratings for all using (true) with check (true);
create policy "Allow all on complaints" on public.complaints for all using (true) with check (true);
create policy "Allow all on sos_alerts" on public.sos_alerts for all using (true) with check (true);
create policy "Allow all on notifications" on public.notifications for all using (true) with check (true);
create policy "Allow all on app_settings" on public.app_settings for all using (true) with check (true);

-- Insert Default Corridor Stops
insert into public.stops (id, name_en, name_mr, lat, lng, is_active, sort_order)
values 
  ('11111111-1111-1111-1111-111111111101', 'Lavel Highway Stop', 'लावेल हायवे थांबा', 17.7289, 73.4981, true, 1),
  ('11111111-1111-1111-1111-111111111102', 'GIT College Main Gate', 'जीआयटी मुख्य प्रवेशद्वार', 17.7425, 73.5132, true, 2),
  ('11111111-1111-1111-1111-111111111103', 'GIT Boys & Girls Hostel', 'जीआयटी हॉस्टेल संकुल', 17.7450, 73.5155, true, 3),
  ('11111111-1111-1111-1111-111111111104', 'Lavel Bazaar / ST Stand', 'लावेल बाजार / एसटी बस स्टॉप', 17.7270, 73.4960, true, 4)
on conflict (id) do nothing;

-- Insert Default Fares
insert into public.fares (from_stop, to_stop, base_fare, per_seat_fare, night_surcharge, valid_from)
values
  ('11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111102', 30.00, 20.00, 15.00, now()),
  ('11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111103', 40.00, 25.00, 15.00, now()),
  ('11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111103', 30.00, 10.00, 10.00, now())
on conflict do nothing;

-- Insert Seed Drivers & Students
insert into public.profiles (id, role, full_name, phone, language)
values 
  ('22222222-2222-2222-2222-222222222201', 'driver', 'Suresh Patil', '+91 98765 43210', 'mr'),
  ('22222222-2222-2222-2222-222222222202', 'driver', 'Prakash Mane', '+91 98221 14455', 'mr'),
  ('22222222-2222-2222-2222-222222222203', 'student', 'Rahul Sisode', '+91 91234 56789', 'mr')
on conflict (id) do nothing;

insert into public.drivers (profile_id, auto_number, seat_capacity, status, is_online, rating_avg, rating_count, total_trips)
values 
  ('22222222-2222-2222-2222-222222222201', 'MH 08 AB 1234', 3, 'approved', true, 4.8, 52, 5),
  ('22222222-2222-2222-2222-222222222202', 'MH 08 BF 5678', 3, 'approved', true, 4.6, 38, 12)
on conflict (profile_id) do nothing;
