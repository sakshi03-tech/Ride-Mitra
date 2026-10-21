-- 003_functions_and_rpcs.sql
-- Database Functions and RPCs for Ride Mitra

---------------------------------------------------------
-- 1. get_fare
---------------------------------------------------------
create or replace function public.get_fare(
  p_pickup uuid,
  p_drop uuid,
  p_seats int default 1,
  p_is_shared boolean default false
)
returns numeric
language plpgsql
security definer
stable
as $$
declare
  v_fare_row public.fares%rowtype;
  v_calculated_fare numeric := 0;
  v_is_night boolean := false;
  v_current_hour int;
begin
  -- Validate stops
  if p_pickup = p_drop then
    return 0;
  end if;

  -- Look up fare (bidirectional check)
  select * into v_fare_row
  from public.fares
  where ((from_stop = p_pickup and to_stop = p_drop) or (from_stop = p_drop and to_stop = p_pickup))
    and (valid_to is null or valid_to > now())
  order by created_at desc
  limit 1;

  if not found then
    -- Fallback default corridor rate if pair not explicitly in matrix
    v_calculated_fare := case when p_is_shared then 20.00 * p_seats else 50.00 end;
    return v_calculated_fare;
  end if;

  -- Determine if night time (10:00 PM to 6:00 AM)
  v_current_hour := extract(hour from (now() at time zone 'Asia/Kolkata'));
  if v_current_hour >= 22 or v_current_hour < 6 then
    v_is_night := true;
  end if;

  if p_is_shared then
    v_calculated_fare := (v_fare_row.per_seat_fare * p_seats);
  else
    v_calculated_fare := v_fare_row.base_fare;
  end if;

  if v_is_night then
    v_calculated_fare := v_calculated_fare + v_fare_row.night_surcharge;
  end if;

  return round(v_calculated_fare, 2);
end;
$$;

---------------------------------------------------------
-- 2. get_driver_queue_position
---------------------------------------------------------
create or replace function public.get_driver_queue_position(p_driver_id uuid)
returns int
language plpgsql
security definer
stable
as $$
declare
  v_pos int := 0;
begin
  select rank into v_pos
  from (
    select profile_id,
           row_number() over (
             order by 
               last_assigned_at asc nulls first, 
               last_online_at asc nulls first,
               created_at asc
           ) as rank
    from public.drivers
    where status = 'approved' and is_online = true
  ) q
  where profile_id = p_driver_id;

  return coalesce(v_pos, 0);
end;
$$;

---------------------------------------------------------
-- 3. create_ride_request
---------------------------------------------------------
create or replace function public.create_ride_request(
  p_pickup uuid,
  p_drop uuid,
  p_seats int default 1,
  p_is_shared boolean default false,
  p_scheduled_for timestamptz default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
  v_fare numeric;
  v_ride_id uuid;
  v_driver_id uuid;
  v_offer_id uuid;
  v_timeout_seconds int := 30;
  v_result jsonb;
begin
  -- Validate caller
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  -- Check if user is blocked
  if exists (select 1 from public.profiles where id = v_user_id and is_blocked = true) then
    raise exception 'User is blocked from booking rides';
  end if;

  -- Calculate fare from matrix
  v_fare := public.get_fare(p_pickup, p_drop, p_seats, p_is_shared);

  -- Insert ride record
  insert into public.rides (
    student_id,
    pickup_stop,
    drop_stop,
    seats,
    is_shared,
    fare_amount,
    status,
    scheduled_for,
    requested_at
  ) values (
    v_user_id,
    p_pickup,
    p_drop,
    p_seats,
    p_is_shared,
    v_fare,
    'searching',
    p_scheduled_for,
    now()
  ) returning id into v_ride_id;

  -- If scheduled for future (>15 mins from now), leave for cron job
  if p_scheduled_for is not null and p_scheduled_for > now() + interval '15 minutes' then
    return jsonb_build_object(
      'ride_id', v_ride_id,
      'status', 'searching',
      'scheduled', true,
      'fare', v_fare
    );
  end if;

  -- Fair Turn Dispatch: Find the online approved driver who has waited longest
  -- Use FOR UPDATE SKIP LOCKED to prevent race conditions & double assignments
  select profile_id into v_driver_id
  from public.drivers
  where status = 'approved'
    and is_online = true
    -- Ensure driver is not currently on an active ride
    and not exists (
      select 1 from public.rides r
      where r.driver_id = drivers.profile_id
        and r.status in ('assigned', 'arriving', 'on_trip')
    )
  order by 
    last_assigned_at asc nulls first,
    last_online_at asc nulls first,
    created_at asc
  limit 1
  for update skip locked;

  if v_driver_id is not null then
    -- Create offer with 30s expiry
    insert into public.ride_offers (
      ride_id,
      driver_id,
      offered_at,
      expires_at,
      response
    ) values (
      v_ride_id,
      v_driver_id,
      now(),
      now() + (v_timeout_seconds || ' seconds')::interval,
      'pending'
    ) returning id into v_offer_id;

    -- Update driver last_assigned_at to cycle through
    update public.drivers
    set last_assigned_at = now()
    where profile_id = v_driver_id;

    -- Notify driver
    insert into public.notifications (user_id, title, body, type, data)
    values (
      v_driver_id,
      'नवीन भाडे उपलब्ध!',
      'नवीन रिक्षा विनंती आली आहे. ३० सेकंदात स्वीकारा.',
      'ride_offer',
      jsonb_build_object('ride_id', v_ride_id, 'offer_id', v_offer_id, 'fare', v_fare)
    );
  end if;

  return jsonb_build_object(
    'ride_id', v_ride_id,
    'status', 'searching',
    'offered_to_driver', v_driver_id,
    'fare', v_fare
  );
end;
$$;

---------------------------------------------------------
-- 4. accept_offer
---------------------------------------------------------
create or replace function public.accept_offer(p_offer_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_driver_id uuid := auth.uid();
  v_offer public.ride_offers%rowtype;
  v_ride public.rides%rowtype;
begin
  -- Lock offer row
  select * into v_offer
  from public.ride_offers
  where id = p_offer_id
  for update;

  if not found then
    raise exception 'Offer not found';
  end if;

  if v_offer.driver_id != v_driver_id and not public.is_admin() then
    raise exception 'Unauthorized to accept this offer';
  end if;

  if v_offer.response != 'pending' then
    raise exception 'Offer is no longer active (status: %)', v_offer.response;
  end if;

  if v_offer.expires_at < now() then
    update public.ride_offers set response = 'expired' where id = p_offer_id;
    raise exception 'Offer has expired';
  end if;

  -- Lock ride row
  select * into v_ride
  from public.rides
  where id = v_offer.ride_id
  for update;

  if v_ride.status != 'searching' then
    update public.ride_offers set response = 'expired' where id = p_offer_id;
    raise exception 'Ride has already been assigned or cancelled';
  end if;

  -- Mark offer accepted
  update public.ride_offers
  set response = 'accepted', responded_at = now()
  where id = p_offer_id;

  -- Assign ride to driver
  update public.rides
  set driver_id = v_driver_id,
      status = 'assigned',
      assigned_at = now(),
      updated_at = now()
  where id = v_offer.ride_id;

  -- Expire any other open offers for this ride
  update public.ride_offers
  set response = 'expired'
  where ride_id = v_offer.ride_id and id != p_offer_id and response = 'pending';

  -- Reset consecutive declines for driver
  update public.drivers
  set consecutive_declines = 0,
      last_assigned_at = now()
  where profile_id = v_driver_id;

  -- Notify student
  insert into public.notifications (user_id, title, body, type, data)
  values (
    v_ride.student_id,
    'रिक्षा चालक मिळाला!',
    'तुमच्या प्रवासासाठी रिक्षा चालक नियुक्त झाला आहे.',
    'ride_assigned',
    jsonb_build_object('ride_id', v_ride.id, 'driver_id', v_driver_id)
  );

  return jsonb_build_object(
    'success', true,
    'ride_id', v_ride.id,
    'status', 'assigned'
  );
end;
$$;

---------------------------------------------------------
-- 5. decline_offer
---------------------------------------------------------
create or replace function public.decline_offer(p_offer_id uuid, p_reason text default null)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_driver_id uuid := auth.uid();
  v_offer public.ride_offers%rowtype;
  v_next_driver_id uuid;
  v_strikes int;
  v_max_strikes int := 3;
begin
  select * into v_offer
  from public.ride_offers
  where id = p_offer_id
  for update;

  if not found then
    raise exception 'Offer not found';
  end if;

  if v_offer.driver_id != v_driver_id and not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  -- Mark offer declined
  update public.ride_offers
  set response = 'declined', responded_at = now()
  where id = p_offer_id;

  -- Increment driver decline count and check strike limit
  update public.drivers
  set consecutive_declines = consecutive_declines + 1,
      last_assigned_at = now()
  where profile_id = v_driver_id
  returning consecutive_declines into v_strikes;

  if v_strikes >= v_max_strikes then
    update public.drivers
    set is_online = false
    where profile_id = v_driver_id;
  end if;

  -- Rotate to next available driver
  select profile_id into v_next_driver_id
  from public.drivers
  where status = 'approved'
    and is_online = true
    and profile_id != v_driver_id
    and not exists (
      select 1 from public.ride_offers
      where ride_id = v_offer.ride_id and driver_id = drivers.profile_id
    )
    and not exists (
      select 1 from public.rides r
      where r.driver_id = drivers.profile_id
        and r.status in ('assigned', 'arriving', 'on_trip')
    )
  order by 
    last_assigned_at asc nulls first,
    created_at asc
  limit 1
  for update skip locked;

  if v_next_driver_id is not null then
    insert into public.ride_offers (
      ride_id,
      driver_id,
      offered_at,
      expires_at,
      response
    ) values (
      v_offer.ride_id,
      v_next_driver_id,
      now(),
      now() + interval '30 seconds',
      'pending'
    );

    update public.drivers
    set last_assigned_at = now()
    where profile_id = v_next_driver_id;
  else
    -- If no more drivers, check if overall search window expired
    update public.rides
    set status = 'no_driver_found', updated_at = now()
    where id = v_offer.ride_id and status = 'searching';
  end if;

  return jsonb_build_object('success', true, 'next_driver', v_next_driver_id);
end;
$$;

---------------------------------------------------------
-- 6. driver_set_online
---------------------------------------------------------
create or replace function public.driver_set_online(p_is_online boolean)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_driver_id uuid := auth.uid();
  v_status driver_status;
begin
  select status into v_status
  from public.drivers
  where profile_id = v_driver_id;

  if not found then
    raise exception 'Driver profile not found';
  end if;

  if p_is_online and v_status != 'approved' then
    raise exception 'Driver is not approved by admin (current status: %)', v_status;
  end if;

  update public.drivers
  set is_online = p_is_online,
      last_online_at = case when p_is_online then now() else last_online_at end,
      consecutive_declines = case when p_is_online then 0 else consecutive_declines end,
      updated_at = now()
  where profile_id = v_driver_id;

  return jsonb_build_object('success', true, 'is_online', p_is_online);
end;
$$;

---------------------------------------------------------
-- 7. update_ride_lifecycle (start_trip, complete_trip, etc)
---------------------------------------------------------
create or replace function public.start_trip(p_ride_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_driver_id uuid := auth.uid();
begin
  update public.rides
  set status = 'on_trip',
      started_at = now(),
      updated_at = now()
  where id = p_ride_id
    and (driver_id = v_driver_id or public.is_admin())
    and status in ('assigned', 'arriving');

  if not found then
    raise exception 'Could not start trip. Verify ride state.';
  end if;

  return jsonb_build_object('success', true, 'status', 'on_trip');
end;
$$;

create or replace function public.complete_trip(p_ride_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_driver_id uuid := auth.uid();
  v_ride public.rides%rowtype;
begin
  select * into v_ride
  from public.rides
  where id = p_ride_id
  for update;

  if not found or (v_ride.driver_id != v_driver_id and not public.is_admin()) then
    raise exception 'Unauthorized or ride not found';
  end if;

  update public.rides
  set status = 'completed',
      completed_at = now(),
      updated_at = now()
  where id = p_ride_id;

  -- Update driver completed trips and push to back of queue
  update public.drivers
  set total_trips = total_trips + 1,
      last_assigned_at = now(),
      updated_at = now()
  where profile_id = v_ride.driver_id;

  -- Notify student to rate driver
  insert into public.notifications (user_id, title, body, type, data)
  values (
    v_ride.student_id,
    'प्रवास पूर्ण झाला!',
    'प्रवास पूर्ण झाला आहे. कृपया तुमच्या अनुभवाचे रेटिंग द्या.',
    'ride_completed',
    jsonb_build_object('ride_id', v_ride.id)
  );

  return jsonb_build_object('success', true, 'status', 'completed');
end;
$$;

---------------------------------------------------------
-- 8. cancel_ride
---------------------------------------------------------
create or replace function public.cancel_ride(p_ride_id uuid, p_reason text default null)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
  v_ride public.rides%rowtype;
begin
  select * into v_ride
  from public.rides
  where id = p_ride_id
  for update;

  if not found then
    raise exception 'Ride not found';
  end if;

  if v_ride.student_id != v_user_id and v_ride.driver_id != v_user_id and not public.is_admin() then
    raise exception 'Unauthorized to cancel this ride';
  end if;

  if v_ride.status in ('completed', 'cancelled') then
    raise exception 'Ride is already %', v_ride.status;
  end if;

  update public.rides
  set status = 'cancelled',
      cancelled_by = v_user_id,
      cancel_reason = p_reason,
      updated_at = now()
  where id = p_ride_id;

  -- If driver had been assigned, notify them or free them
  if v_ride.driver_id is not null then
    insert into public.notifications (user_id, title, body, type, data)
    values (
      v_ride.driver_id,
      'प्रवास रद्द करण्यात आला',
      coalesce(p_reason, 'प्रवाशाने प्रवास रद्द केला.'),
      'ride_cancelled',
      jsonb_build_object('ride_id', v_ride.id)
    );
  end if;

  return jsonb_build_object('success', true, 'status', 'cancelled');
end;
$$;

---------------------------------------------------------
-- 9. raise_sos
---------------------------------------------------------
create or replace function public.raise_sos(
  p_ride_id uuid,
  p_lat double precision default null,
  p_lng double precision default null
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
  v_sos_id uuid;
begin
  insert into public.sos_alerts (
    ride_id,
    raised_by,
    lat,
    lng,
    status
  ) values (
    p_ride_id,
    v_user_id,
    p_lat,
    p_lng,
    'active'
  ) returning id into v_sos_id;

  -- Notify all admins
  insert into public.notifications (user_id, title, body, type, data)
  select 
    id,
    'तात्काळ SOS इशारा!',
    'प्रवासादरम्यान आपत्कालीन मदत मागितली गेली आहे.',
    'sos_alert',
    jsonb_build_object('sos_id', v_sos_id, 'ride_id', p_ride_id, 'lat', p_lat, 'lng', p_lng)
  from public.profiles
  where role = 'admin';

  return jsonb_build_object('success', true, 'sos_id', v_sos_id);
end;
$$;

---------------------------------------------------------
-- 10. get_demand_forecast
---------------------------------------------------------
create or replace function public.get_demand_forecast()
returns table (
  hour int,
  weekday int,
  ride_count bigint,
  demand_level text
)
language sql
security definer
stable
as $$
  with hourly_rides as (
    select 
      extract(hour from (requested_at at time zone 'Asia/Kolkata'))::int as h,
      extract(dow from (requested_at at time zone 'Asia/Kolkata'))::int as dow,
      count(*) as cnt
    from public.rides
    where requested_at > now() - interval '30 days'
    group by h, dow
  )
  select 
    s.hour,
    s.weekday,
    coalesce(hr.cnt, 0) as ride_count,
    case 
      when coalesce(hr.cnt, 0) > 10 or s.hour in (8, 9, 16, 17) then 'high'
      when coalesce(hr.cnt, 0) between 4 and 10 or s.hour in (10, 11, 15, 18) then 'medium'
      else 'low'
    end as demand_level
  from (
    select h as hour, w as weekday
    from generate_series(0, 23) h
    cross join generate_series(0, 6) w
  ) s
  left join hourly_rides hr on s.hour = hr.h and s.weekday = hr.dow
  order by s.weekday, s.hour;
$$;
