-- 004_triggers.sql
-- Triggers for Ride Mitra

-- Generic updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach updated_at triggers
create or replace trigger tr_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create or replace trigger tr_drivers_updated_at
  before update on public.drivers
  for each row execute function public.handle_updated_at();

create or replace trigger tr_rides_updated_at
  before update on public.rides
  for each row execute function public.handle_updated_at();

create or replace trigger tr_complaints_updated_at
  before update on public.complaints
  for each row execute function public.handle_updated_at();

-- Trigger: Recalculate Driver Rating on New Rating
create or replace function public.handle_rating_update()
returns trigger
language plpgsql
security definer
as $$
declare
  v_avg numeric(3, 2);
  v_count int;
  v_is_driver boolean;
begin
  -- Check if ratee is a driver
  select exists (select 1 from public.drivers where profile_id = new.ratee_id) into v_is_driver;

  if v_is_driver then
    select coalesce(round(avg(stars)::numeric, 2), 5.00), count(*)
    into v_avg, v_count
    from public.ratings
    where ratee_id = new.ratee_id;

    update public.drivers
    set rating_avg = v_avg,
        rating_count = v_count,
        updated_at = now()
    where profile_id = new.ratee_id;
  end if;

  return new;
end;
$$;

create or replace trigger tr_ratings_recalculate
  after insert or update on public.ratings
  for each row execute function public.handle_rating_update();
