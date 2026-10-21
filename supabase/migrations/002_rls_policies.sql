-- 002_rls_policies.sql
-- Row Level Security (RLS) for Ride Mitra

-- 1. Helper function: is_admin
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_blocked = false
  );
$$;

-- 2. Helper function: is_driver
create or replace function public.is_driver()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'driver' and is_blocked = false
  );
$$;

-- Enable RLS on EVERY table
alter table public.profiles enable row level security;
alter table public.student_details enable row level security;
alter table public.drivers enable row level security;
alter table public.driver_locations enable row level security;
alter table public.stops enable row level security;
alter table public.fares enable row level security;
alter table public.rides enable row level security;
alter table public.ride_passengers enable row level security;
alter table public.ride_offers enable row level security;
alter table public.ratings enable row level security;
alter table public.complaints enable row level security;
alter table public.sos_alerts enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.app_settings enable row level security;
alter table public.audit_log enable row level security;

---------------------------------------------------------
-- PROFILES POLICIES
---------------------------------------------------------
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id or public.is_admin());

---------------------------------------------------------
-- STUDENT DETAILS POLICIES
---------------------------------------------------------
create policy "Students can view own details"
  on public.student_details for select
  using (auth.uid() = profile_id or public.is_admin());

create policy "Students can upsert own details"
  on public.student_details for insert
  with check (auth.uid() = profile_id or public.is_admin());

create policy "Students can update own details"
  on public.student_details for update
  using (auth.uid() = profile_id or public.is_admin())
  with check (auth.uid() = profile_id or public.is_admin());

---------------------------------------------------------
-- DRIVERS POLICIES
---------------------------------------------------------
create policy "Drivers can view own driver row"
  on public.drivers for select
  using (auth.uid() = profile_id or public.is_admin());

create policy "Drivers can register own profile"
  on public.drivers for insert
  with check (auth.uid() = profile_id);

create policy "Drivers can update own non-status fields or admin full update"
  on public.drivers for update
  using (auth.uid() = profile_id or public.is_admin())
  with check (
    public.is_admin() or 
    (auth.uid() = profile_id and status = (select d.status from public.drivers d where d.profile_id = auth.uid()))
  );

---------------------------------------------------------
-- DRIVER LOCATIONS POLICIES
---------------------------------------------------------
create policy "Drivers can update own location"
  on public.driver_locations for all
  using (auth.uid() = driver_id or public.is_admin())
  with check (auth.uid() = driver_id or public.is_admin());

create policy "Passengers can view assigned driver location"
  on public.driver_locations for select
  using (
    exists (
      select 1 from public.rides r
      where r.driver_id = driver_locations.driver_id
        and r.status in ('assigned', 'arriving', 'on_trip')
        and (r.student_id = auth.uid() or exists (
          select 1 from public.ride_passengers rp where rp.ride_id = r.id and rp.student_id = auth.uid()
        ))
    )
  );

---------------------------------------------------------
-- STOPS POLICIES (Public read active stops, admin manage)
---------------------------------------------------------
create policy "Public can view active stops"
  on public.stops for select
  using (is_active = true or public.is_admin());

create policy "Admin can manage stops"
  on public.stops for all
  using (public.is_admin())
  with check (public.is_admin());

---------------------------------------------------------
-- FARES POLICIES (Public read valid fares, admin manage)
---------------------------------------------------------
create policy "Public can view active fares"
  on public.fares for select
  using (valid_to is null or valid_to > now() or public.is_admin());

create policy "Admin can manage fares"
  on public.fares for all
  using (public.is_admin())
  with check (public.is_admin());

---------------------------------------------------------
-- RIDES POLICIES
---------------------------------------------------------
create policy "Students can view own rides"
  on public.rides for select
  using (
    student_id = auth.uid() 
    or driver_id = auth.uid() 
    or public.is_admin()
    or exists (
      select 1 from public.ride_passengers rp where rp.ride_id = rides.id and rp.student_id = auth.uid()
    )
    or exists (
      select 1 from public.ride_offers ro where ro.ride_id = rides.id and ro.driver_id = auth.uid()
    )
  );

create policy "Student or RPC can create rides"
  on public.rides for insert
  with check (student_id = auth.uid() or public.is_admin());

create policy "Participants can update ride states"
  on public.rides for update
  using (student_id = auth.uid() or driver_id = auth.uid() or public.is_admin())
  with check (student_id = auth.uid() or driver_id = auth.uid() or public.is_admin());

---------------------------------------------------------
-- RIDE OFFERS POLICIES
---------------------------------------------------------
create policy "Drivers can view and respond to their own offers"
  on public.ride_offers for select
  using (driver_id = auth.uid() or public.is_admin());

create policy "Drivers can update their own offer response"
  on public.ride_offers for update
  using (driver_id = auth.uid() or public.is_admin())
  with check (driver_id = auth.uid() or public.is_admin());

---------------------------------------------------------
-- RATINGS POLICIES
---------------------------------------------------------
create policy "Users can view ratings given or received"
  on public.ratings for select
  using (rater_id = auth.uid() or ratee_id = auth.uid() or public.is_admin());

create policy "Users can insert ratings for completed rides"
  on public.ratings for insert
  with check (
    rater_id = auth.uid() and exists (
      select 1 from public.rides r
      where r.id = ratings.ride_id
        and r.status = 'completed'
        and (r.student_id = auth.uid() or r.driver_id = auth.uid())
    )
  );

---------------------------------------------------------
-- COMPLAINTS POLICIES
---------------------------------------------------------
create policy "Users can view own filed complaints or admin all"
  on public.complaints for select
  using (raised_by = auth.uid() or public.is_admin());

create policy "Users can file complaints"
  on public.complaints for insert
  with check (raised_by = auth.uid() or public.is_admin());

create policy "Admin can resolve complaints"
  on public.complaints for update
  using (public.is_admin())
  with check (public.is_admin());

---------------------------------------------------------
-- SOS ALERTS POLICIES
---------------------------------------------------------
create policy "Users can raise SOS for active rides"
  on public.sos_alerts for insert
  with check (raised_by = auth.uid() or public.is_admin());

create policy "Admin can view all SOS alerts; user views own"
  on public.sos_alerts for select
  using (raised_by = auth.uid() or public.is_admin());

create policy "Admin can manage SOS alerts"
  on public.sos_alerts for update
  using (public.is_admin())
  with check (public.is_admin());

---------------------------------------------------------
-- NOTIFICATIONS POLICIES
---------------------------------------------------------
create policy "Users can view own notifications"
  on public.notifications for select
  using (user_id = auth.uid() or public.is_admin());

create policy "Users can mark own notifications as read"
  on public.notifications for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

---------------------------------------------------------
-- PUSH SUBSCRIPTIONS POLICIES
---------------------------------------------------------
create policy "Users can manage own push subscriptions"
  on public.push_subscriptions for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

---------------------------------------------------------
-- APP SETTINGS POLICIES (Public read, admin write)
---------------------------------------------------------
create policy "Public can read app settings"
  on public.app_settings for select
  using (true);

create policy "Admin can edit app settings"
  on public.app_settings for all
  using (public.is_admin())
  with check (public.is_admin());

---------------------------------------------------------
-- AUDIT LOG POLICIES (Admin only)
---------------------------------------------------------
create policy "Admin can view audit logs"
  on public.audit_log for select
  using (public.is_admin());
