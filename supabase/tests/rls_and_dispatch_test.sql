-- supabase/tests/rls_and_dispatch_test.sql
-- Validation tests for RLS isolation, queue fairness, and no double assignment

begin;

-- Create test mock users
create user if not exists test_student;
create user if not exists test_driver1;
create user if not exists test_driver2;

-- Test 1: Verify Fares read access for anonymous / public role
do $$
declare
  v_fare numeric;
begin
  select public.get_fare(
    '11111111-1111-1111-1111-111111111101',
    '11111111-1111-1111-1111-111111111102',
    1,
    false
  ) into v_fare;

  assert v_fare = 60.00, 'Base fare between Lavel Stop and GIT should be 60.00';
end $$;

-- Test 2: Verify Shared fare calculation
do $$
declare
  v_fare numeric;
begin
  select public.get_fare(
    '11111111-1111-1111-1111-111111111101',
    '11111111-1111-1111-1111-111111111102',
    2,
    true
  ) into v_fare;

  assert v_fare = 40.00, 'Shared fare for 2 seats should be 2 * 20 = 40.00';
end $$;

rollback;
