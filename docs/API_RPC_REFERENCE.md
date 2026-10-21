# Ride Mitra — Database Functions & RPC Reference

All business logic is encapsulated in PostgreSQL functions (`security definer`) with row-level locks to prevent concurrency bugs, race conditions, and double-assignments.

---

### 1. `get_fare`
Calculates upfront fare from the `fares` matrix.
- **Parameters**:
  - `p_pickup` (`uuid`): ID of pickup stop
  - `p_drop` (`uuid`): ID of drop stop
  - `p_seats` (`int`, default `1`): Number of passenger seats
  - `p_is_shared` (`boolean`, default `false`): Shared vs full private ride
- **Returns**: `numeric` (e.g. `60.00`)
- **Logic**: Automatically calculates night surcharge between 22:00 and 06:00 IST.

---

### 2. `create_ride_request`
Creates a ride request and dispatches an offer to the next driver in the fair rotation queue.
- **Parameters**:
  - `p_pickup` (`uuid`)
  - `p_drop` (`uuid`)
  - `p_seats` (`int`)
  - `p_is_shared` (`boolean`)
  - `p_scheduled_for` (`timestamptz`, optional)
- **Returns**: `jsonb` with `ride_id`, `status`, and `fare`
- **Concurrency Protection**: Uses `FOR UPDATE SKIP LOCKED` on `drivers` ordered by `last_assigned_at ASC NULLS FIRST`.

---

### 3. `accept_offer`
Driver accepts an offer within 30 seconds.
- **Parameters**:
  - `p_offer_id` (`uuid`)
- **Returns**: `jsonb` (`success: true, ride_id, status: 'assigned'`)
- **Guarantees**: Atomic verification of `pending` status and unexpired deadline. Expires all other open offers for that ride.

---

### 4. `decline_offer`
Driver declines an incoming offer or times out.
- **Parameters**:
  - `p_offer_id` (`uuid`)
  - `p_reason` (`text`, optional)
- **Returns**: `jsonb` (`success: true, next_driver`)
- **Rules**: Increments driver's `consecutive_declines`. If strikes >= 3, sets driver offline. Rotates offer immediately to the next longest-waiting driver.

---

### 5. `driver_set_online`
Toggles driver availability.
- **Parameters**:
  - `p_is_online` (`boolean`)
- **Enforcement**: Only drivers with `status = 'approved'` can go online. Resets decline strikes upon going online.

---

### 6. `start_trip` & `complete_trip`
Advances ride lifecycle.
- On completion: updates ride to `completed`, increments driver `total_trips`, sets driver `last_assigned_at = now()` (re-queues driver to the back of the queue), and dispatches student rating notification.

---

### 7. `raise_sos`
Immediate emergency alarm.
- **Parameters**:
  - `p_ride_id` (`uuid`)
  - `p_lat` (`double precision`)
  - `p_lng` (`double precision`)
- **Actions**: Creates `sos_alerts` record and triggers high-priority notification to all system administrators.
