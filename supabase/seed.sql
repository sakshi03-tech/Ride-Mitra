-- supabase/seed.sql
-- Seed data for Ride Mitra corridor: Lavel Stop ↔ Gharda Institute of Technology (GIT) & Hostel

-- 1. Fixed Corridor Stops (Accurate Lavel / Khed coordinates)
insert into public.stops (id, name_en, name_mr, lat, lng, is_active, sort_order)
values 
  ('11111111-1111-1111-1111-111111111101', 'Lavel Highway Stop', 'लावेल हायवे थांबा', 17.7289, 73.4981, true, 1),
  ('11111111-1111-1111-1111-111111111102', 'GIT College Main Gate', 'जीआयटी मुख्य प्रवेशद्वार', 17.7425, 73.5132, true, 2),
  ('11111111-1111-1111-1111-111111111103', 'GIT Boys & Girls Hostel', 'जीआयटी हॉस्टेल संकुल', 17.7450, 73.5155, true, 3),
  ('11111111-1111-1111-1111-111111111104', 'Lavel Bazaar / ST Stand', 'लावेल बाजार / एसटी बस स्टॉप', 17.7270, 73.4960, true, 4)
on conflict (id) do nothing;

-- 2. Fixed Fare Matrix (Standard Rates in INR)
insert into public.fares (from_stop, to_stop, base_fare, per_seat_fare, night_surcharge, valid_from)
values
  -- Lavel Stop <-> GIT College
  ('11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111102', 60.00, 20.00, 15.00, now()),
  -- Lavel Stop <-> GIT Hostel
  ('11111111-1111-1111-1111-111111111101', '11111111-1111-1111-1111-111111111103', 70.00, 25.00, 15.00, now()),
  -- GIT College <-> GIT Hostel
  ('11111111-1111-1111-1111-111111111102', '11111111-1111-1111-1111-111111111103', 30.00, 10.00, 10.00, now()),
  -- Lavel Bazaar <-> GIT College
  ('11111111-1111-1111-1111-111111111104', '11111111-1111-1111-1111-111111111102', 60.00, 20.00, 15.00, now())
on conflict do nothing;

-- 3. App Settings
insert into public.app_settings (key, value)
values
  ('request_timeout_seconds', '30'::jsonb),
  ('max_decline_strikes', '3'::jsonb),
  ('cancellation_grace_seconds', '120'::jsonb),
  ('announcement_banner', '{"active": true, "message_mr": "रिक्षा मित्र पायलट चाचणी सुरू आहे! आपले सहकार्य हवे.", "message_en": "Ride Mitra pilot is live in Lavel! Fixed fares guaranteed."}'::jsonb),
  ('emergency_numbers', '{"police": "112", "git_security": "+91 2356 262795", "ambulance": "108"}'::jsonb)
on conflict (key) do update set value = excluded.value;
