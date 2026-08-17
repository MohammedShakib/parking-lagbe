-- Migration 0004: Business Owner Flows (Garages, Operating Schedules, Real-time Overrides, Booking Actions, Income Analytics)

-- Function: update_garage_schedule_and_status
create or replace function update_garage_schedule_and_status(
  p_garage_id varchar(30),
  p_username varchar(50),
  p_space_name varchar(255),
  p_capacity integer,
  p_price_per_hour numeric(10,2),
  p_is_24_7 boolean,
  p_opening_time time default null,
  p_closing_time time default null,
  p_operating_days text[] default array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
  p_current_status garage_status default 'available',
  p_is_manual_override boolean default false,
  p_override_reason text default null,
  p_force_closed boolean default false
)
returns json
language plpgsql
security definer
as $$
declare
  v_old_status garage_status;
begin
  -- 1. Verify garage owner
  if not exists (
    select 1 from garage_information
    where garage_id = p_garage_id and username = p_username
  ) and not is_admin() then
    return json_build_object('success', false, 'message', 'Unauthorized or garage not found.');
  end if;

  -- 2. Update garage information
  update garage_information
  set parking_space_name = p_space_name,
      parking_capacity = p_capacity,
      price_per_hour = p_price_per_hour,
      availability = greatest(0, p_capacity - (
        select count(*) from bookings
        where garage_id = p_garage_id and status in ('upcoming', 'active')
      )),
      updated_at = now()
  where garage_id = p_garage_id;

  -- 3. Upsert operating schedule
  insert into garage_operating_schedule (
    garage_id,
    garage_name,
    opening_time,
    closing_time,
    operating_days,
    is_24_7,
    updated_at
  ) values (
    p_garage_id,
    p_space_name,
    p_opening_time,
    p_closing_time,
    p_operating_days,
    p_is_24_7,
    now()
  ) on conflict (garage_id) do update set
    garage_name = excluded.garage_name,
    opening_time = excluded.opening_time,
    closing_time = excluded.closing_time,
    operating_days = excluded.operating_days,
    is_24_7 = excluded.is_24_7,
    updated_at = now();

  -- 4. Get old status for audit log
  select current_status into v_old_status
  from garage_real_time_status
  where garage_id = p_garage_id;

  -- 5. Upsert real time status
  insert into garage_real_time_status (
    garage_id,
    current_status,
    is_manual_override,
    override_reason,
    force_closed,
    last_changed_at,
    changed_by
  ) values (
    p_garage_id,
    p_current_status,
    p_is_manual_override,
    p_override_reason,
    p_force_closed,
    now(),
    p_username
  ) on conflict (garage_id) do update set
    current_status = excluded.current_status,
    is_manual_override = excluded.is_manual_override,
    override_reason = excluded.override_reason,
    force_closed = excluded.force_closed,
    last_changed_at = now(),
    changed_by = excluded.changed_by;

  -- 6. Insert into status log if status changed
  if v_old_status is distinct from p_current_status then
    insert into garage_status_log (
      garage_id,
      old_status,
      new_status,
      changed_by,
      change_reason
    ) values (
      p_garage_id,
      v_old_status,
      p_current_status,
      p_username,
      p_override_reason
    );
  end if;

  return json_build_object(
    'success', true,
    'message', 'Garage settings, schedule, and live status updated successfully.'
  );
end;
$$;

-- Function: update_host_booking_status (Check-in / Check-out actions)
create or replace function update_host_booking_status(
  p_booking_id bigint,
  p_new_status booking_status,
  p_username varchar(50)
)
returns json
language plpgsql
security definer
as $$
declare
  v_garage_id varchar(30);
  v_owner_username varchar(50);
begin
  -- 1. Lookup booking and garage owner
  select b.garage_id, g.username
  into v_garage_id, v_owner_username
  from bookings b
  join garage_information g on g.garage_id = b.garage_id
  where b.id = p_booking_id;

  if v_garage_id is null then
    return json_build_object('success', false, 'message', 'Booking not found.');
  end if;

  if v_owner_username != p_username and not is_admin() then
    return json_build_object('success', false, 'message', 'Unauthorized to manage this booking.');
  end if;

  -- 2. Update status
  update bookings
  set status = p_new_status,
      updated_at = now()
  where id = p_booking_id;

  -- 3. Recalculate garage availability
  update garage_information
  set availability = greatest(0, parking_capacity - (
    select count(*) from bookings
    where garage_id = v_garage_id and status in ('upcoming', 'active')
  ))
  where garage_id = v_garage_id;

  return json_build_object(
    'success', true,
    'new_status', p_new_status,
    'message', 'Booking status updated successfully.'
  );
end;
$$;

-- Function: get_owner_income_summary
create or replace function get_owner_income_summary(
  p_username varchar(50)
)
returns json
language plpgsql
security definer
as $$
declare
  v_owner_id varchar(100);
  v_total_gross numeric(10,2) := 0;
  v_owner_profit numeric(10,2) := 0;
  v_platform_profit numeric(10,2) := 0;
  v_today_income numeric(10,2) := 0;
  v_total_bookings integer := 0;
begin
  -- 1. Lookup owner ID
  select coalesce(go.owner_id, du.owner_id)
  into v_owner_id
  from account_information a
  left join garage_owners go on go.username = a.username
  left join dual_user du on du.username = a.username
  where a.username = p_username;

  -- 2. Aggregate from profit_tracking
  select
    coalesce(sum(total_amount), 0),
    coalesce(sum(owner_profit), 0),
    coalesce(sum(platform_profit), 0),
    count(*)
  into v_total_gross, v_owner_profit, v_platform_profit, v_total_bookings
  from profit_tracking pt
  where pt.owner_id = v_owner_id
     or pt.garage_id in (select garage_id from garage_information where username = p_username);

  -- 3. Calculate today's income
  select coalesce(sum(owner_profit), 0)
  into v_today_income
  from profit_tracking pt
  where (pt.owner_id = v_owner_id or pt.garage_id in (select garage_id from garage_information where username = p_username))
    and pt.created_at >= current_date;

  return json_build_object(
    'success', true,
    'total_gross', v_total_gross,
    'net_payout', v_owner_profit,
    'platform_commission', v_platform_profit,
    'today_income', v_today_income,
    'total_settled_bookings', v_total_bookings
  );
end;
$$;
