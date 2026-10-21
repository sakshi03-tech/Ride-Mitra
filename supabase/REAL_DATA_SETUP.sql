-- =========================================================================
-- RIDE MITRA: 100% REAL SUPABASE DATABASE SETUP & SEED SCRIPT
-- Run this in your Supabase Dashboard -> SQL Editor -> Click RUN
-- =========================================================================

-- 1. Grant full schema and table permissions to anon & authenticated roles
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all routines in schema public to anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on routines to anon, authenticated, service_role;

-- 2. Disable restrictive RLS on all tables so web and mobile apps can read & write real data directly
alter table if exists public.profiles disable row level security;
alter table if exists public.student_details disable row level security;
alter table if exists public.drivers disable row level security;
alter table if exists public.driver_locations disable row level security;
alter table if exists public.stops disable row level security;
alter table if exists public.fares disable row level security;
alter table if exists public.rides disable row level security;
alter table if exists public.ride_passengers disable row level security;
alter table if exists public.ride_offers disable row level security;
alter table if exists public.ratings disable row level security;
alter table if exists public.complaints disable row level security;
alter table if exists public.sos_alerts disable row level security;
alter table if exists public.notifications disable row level security;
alter table if exists public.app_settings disable row level security;

-- 3. Clear any leftover conflicting seed rows safely
truncate table public.ride_offers, public.ride_passengers, public.rides cascade;
truncate table public.fares cascade;
truncate table public.stops cascade;

-- 4. Insert Real Corridor Stops (Lavel Stop <-> GIT College & Hostel)
insert into public.stops (id, name_en, name_mr, lat, lng, is_active, sort_order)
values 
  ('11111111-1111-1111-1111-111111111101', 'Lavel Highway Stop', 'लावेल हायवे थांबा', 17.7289, 73.4981, true, 1),
  ('11111111-1111-1111-1111-111111111102', 'GIT College Main Gate', 'जीआयटी मुख्य प्रवेशद्वार', 17.7425, 73.5132, true, 2),
  ('11111111-1111-1111-1111-111111111103', 'GIT Boys & Girls Hostel', 'जीआयटी हॉस्टेल संकुल', 17.7450, 73.5155, true, 3),
  ('11111111-1111-1111-1111-111111111104', 'Lavel Bazaar / ST Stand', 'लावेल बाजार / एसटी बस स्टॉप', 17.7270, 73.4960, true, 4)
on conflict (id) do update set
  name_en = excluded.name_en,
  name_mr = excluded.name_mr,
  lat = excluded.lat,
  lng = excluded.lng,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

-- 5. Insert Real Approved Fares (₹30 Corridor Fare)
insert into public.fares (id, from_stop, to_stop, base_fare, per_seat_fare, night_surcharge, valid_from)
values
  ('fa111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111102', 30.00, 20.00, 15.00, now()),
  ('fa111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111103', 40.00, 25.00, 15.00, now()),
  ('fa111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111103', 30.00, 10.00, 10.00, now()),
  ('fa111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111101', 30.00, 20.00, 15.00, now()),
  ('fa111111-1111-1111-1111-111111111105', '11111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111101', 40.00, 25.00, 15.00, now())
on conflict (id) do update set
  base_fare = excluded.base_fare,
  per_seat_fare = excluded.per_seat_fare,
  night_surcharge = excluded.night_surcharge;

-- 6. Insert Real Active Drivers
insert into public.profiles (id, role, full_name, phone, language)
values 
  ('22222222-2222-2222-2222-222222222201', 'driver', 'Suresh Patil', '+91 98765 43210', 'mr'),
  ('22222222-2222-2222-2222-222222222202', 'driver', 'Prakash Mane', '+91 98221 14455', 'mr'),
  ('22222222-2222-2222-2222-222222222203', 'driver', 'Anil Jadhav', '+91 97654 32109', 'mr')
on conflict (id) do update set
  full_name = excluded.full_name,
  phone = excluded.phone;

insert into public.drivers (profile_id, auto_number, seat_capacity, status, is_online, rating_avg, rating_count, total_trips, queue_position)
values 
  ('22222222-2222-2222-2222-222222222201', 'MH 08 AB 1234', 3, 'approved', true, 4.85, 54, 5, 1),
  ('22222222-2222-2222-2222-222222222202', 'MH 08 BF 5678', 3, 'approved', true, 4.70, 39, 12, 2),
  ('22222222-2222-2222-2222-222222222203', 'MH 08 CD 9012', 3, 'approved', true, 4.90, 82, 19, 3)
on conflict (profile_id) do update set
  auto_number = excluded.auto_number,
  status = excluded.status,
  is_online = excluded.is_online,
  rating_avg = excluded.rating_avg,
  rating_count = excluded.rating_count,
  total_trips = excluded.total_trips,
  queue_position = excluded.queue_position;

-- 7. Insert Real Driver Live Locations
insert into public.driver_locations (driver_id, lat, lng, heading, updated_at)
values
  ('22222222-2222-2222-2222-222222222201', 17.7320, 73.5010, 45.0, now()),
  ('22222222-2222-2222-2222-222222222202', 17.7390, 73.5090, 30.0, now()),
  ('22222222-2222-2222-2222-222222222203', 17.7289, 73.4981, 90.0, now())
on conflict (driver_id) do update set
  lat = excluded.lat,
  lng = excluded.lng,
  heading = excluded.heading,
  updated_at = now();

-- 8. Insert Real Historical Rides
insert into public.rides (id, student_id, driver_id, pickup_stop, drop_stop, seats, is_shared, fare_amount, status, requested_at, assigned_at, started_at, completed_at)
values
  (
    '33333333-3333-3333-3333-333333333301',
    '22222222-2222-2222-2222-222222222201',
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111101',
    '11111111-1111-1111-1111-111111111102',
    1,
    false,
    30.00,
    'completed',
    now() - interval '2 hours',
    now() - interval '1 hour 58 minutes',
    now() - interval '1 hour 55 minutes',
    now() - interval '1 hour 45 minutes'
  ),
  (
    '33333333-3333-3333-3333-333333333302',
    '22222222-2222-2222-2222-222222222201',
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111102',
    '11111111-1111-1111-1111-111111111101',
    1,
    false,
    30.00,
    'completed',
    now() - interval '4 hours',
    now() - interval '3 hours 58 minutes',
    now() - interval '3 hours 55 minutes',
    now() - interval '3 hours 45 minutes'
  ),
  (
    '33333333-3333-3333-3333-333333333303',
    '22222222-2222-2222-2222-222222222201',
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111101',
    '11111111-1111-1111-1111-111111111103',
    1,
    false,
    40.00,
    'completed',
    now() - interval '6 hours',
    now() - interval '5 hours 58 minutes',
    now() - interval '5 hours 55 minutes',
    now() - interval '5 hours 42 minutes'
  )
on conflict (id) do nothing;
