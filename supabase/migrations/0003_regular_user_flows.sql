-- Migration 0003: Regular User Flows (Search, Garages, Vehicles, Bookings, Payments, Points, Ratings)

-- Enable RLS on remaining tables
alter table garagelocation enable row level security;
alter table garage_information enable row level security;
alter table garage_operating_schedule enable row level security;
alter table garage_real_time_status enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;
alter table points_transactions enable row level security;
alter table ratings enable row level security;
alter table garage_ratings_summary enable row level security;
alter table profit_tracking enable row level security;

-- ==========================================================
-- RLS POLICIES FOR REGULAR USER FLOWS
-- ==========================================================

-- Garage Information & Locations (Public read for active garages)
create policy "Allow everyone to view garage information"
  on garage_information for select
  using (true);

create policy "Allow owners and admins to manage their garages"
  on garage_information for all
  using (
    exists (
      select 1 from account_information
      where account_information.username = garage_information.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Allow everyone to view garage location"
  on garagelocation for select
  using (true);

create policy "Allow owners and admins to manage garage location"
  on garagelocation for all
  using (
    exists (
      select 1 from account_information
      where account_information.username = garagelocation.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Allow everyone to view garage schedule"
  on garage_operating_schedule for select
  using (true);

create policy "Allow owners and admins to manage garage schedule"
  on garage_operating_schedule for all
  using (
    exists (
      select 1 from garage_information g
      join account_information a on a.username = g.username
      where g.garage_id = garage_operating_schedule.garage_id
      and (a.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Allow everyone to view garage real time status"
  on garage_real_time_status for select
  using (true);

create policy "Allow owners and admins to manage real time status"
  on garage_real_time_status for all
  using (
    exists (
      select 1 from garage_information g
      join account_information a on a.username = g.username
      where g.garage_id = garage_real_time_status.garage_id
      and (a.auth_user_id = auth.uid() or is_admin())
    )
  );

-- Bookings RLS
create policy "Users can view their own bookings or garage owner can view for their garage or admin"
  on bookings for select
  using (
    exists (
      select 1 from account_information
      where account_information.username = bookings.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
    or
    exists (
      select 1 from garage_information g
      join account_information a on a.username = g.username
      where g.garage_id = bookings.garage_id
      and a.auth_user_id = auth.uid()
    )
  );

create policy "Users can insert their own bookings"
  on bookings for insert
  with check (
    exists (
      select 1 from account_information
      where account_information.username = bookings.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Users and owners can update their bookings"
  on bookings for update
  using (
    exists (
      select 1 from account_information
      where account_information.username = bookings.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
    or
    exists (
      select 1 from garage_information g
      join account_information a on a.username = g.username
      where g.garage_id = bookings.garage_id
      and a.auth_user_id = auth.uid()
    )
  );

-- Payments RLS
create policy "Users can view payments for their bookings or admin"
  on payments for select
  using (
    exists (
      select 1 from bookings b
      join account_information a on a.username = b.username
      where b.id = payments.booking_id
      and (a.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Users can insert payment for their bookings"
  on payments for insert
  with check (
    exists (
      select 1 from bookings b
      join account_information a on a.username = b.username
      where b.id = payments.booking_id
      and (a.auth_user_id = auth.uid() or is_admin())
    )
  );

-- Points Transactions RLS
create policy "Users can view their points transactions or admin"
  on points_transactions for select
  using (
    exists (
      select 1 from account_information
      where account_information.username = points_transactions.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Users can insert their points transactions or admin"
  on points_transactions for insert
  with check (
    exists (
      select 1 from account_information
      where account_information.username = points_transactions.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

-- Ratings RLS
create policy "Allow everyone to read ratings"
  on ratings for select
  using (true);

create policy "Users can insert ratings for their completed bookings"
  on ratings for insert
  with check (
    exists (
      select 1 from account_information
      where account_information.username = ratings.rater_username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

-- Ratings summary RLS
create policy "Allow everyone to read ratings summary"
  on garage_ratings_summary for select
  using (true);

create policy "Allow system/admin/owner to update ratings summary"
  on garage_ratings_summary for all
  using (true);

-- Profit Tracking RLS
create policy "Allow garage owners to view their profits and admin"
  on profit_tracking for select
  using (
    exists (
      select 1 from garage_owners go
      join account_information a on a.username = go.username
      where go.owner_id = profit_tracking.owner_id
      and (a.auth_user_id = auth.uid() or is_admin())
    )
    or
    exists (
      select 1 from dual_user du
      join account_information a on a.username = du.username
      where du.owner_id = profit_tracking.owner_id
      and (a.auth_user_id = auth.uid() or is_admin())
    )
    or is_admin()
  );

create policy "Allow insertion into profit tracking"
  on profit_tracking for insert
  with check (true);

-- ==========================================================
-- STORED FUNCTIONS / RPCs
-- ==========================================================

-- Function: create_booking_order (Atomic booking with capacity checking)
create or replace function create_booking_order(
  p_username varchar(50),
  p_garage_id varchar(30),
  p_license_plate varchar(50),
  p_booking_date date,
  p_booking_time time,
  p_duration integer,
  p_paid_with_points boolean default false,
  p_points_used integer default 0
)
returns json
language plpgsql
security definer
as $$
declare
  v_capacity integer;
  v_current_avail integer;
  v_overlap_count integer;
  v_booking_end_time time;
  v_new_booking_id bigint;
  v_price_per_hour numeric(10,2);
  v_total_amount numeric(10,2);
  v_space_name varchar(255);
begin
  -- 1. Check garage exists
  select parking_capacity, availability, price_per_hour, parking_space_name
  into v_capacity, v_current_avail, v_price_per_hour, v_space_name
  from garage_information
  where garage_id = p_garage_id;

  if v_capacity is null then
    return json_build_object('success', false, 'message', 'Garage not found.');
  end if;

  -- 2. Calculate end time
  v_booking_end_time := p_booking_time + (p_duration || ' hours')::interval;

  -- 3. Check for overlapping active/upcoming bookings
  select count(*)
  into v_overlap_count
  from bookings
  where garage_id = p_garage_id
    and booking_date = p_booking_date
    and status in ('upcoming', 'active')
    and (
      (booking_time >= p_booking_time and booking_time < v_booking_end_time)
      or (booking_time + (duration || ' hours')::interval > p_booking_time and booking_time + (duration || ' hours')::interval <= v_booking_end_time)
      or (booking_time <= p_booking_time and booking_time + (duration || ' hours')::interval >= v_booking_end_time)
    );

  if v_overlap_count >= v_capacity then
    return json_build_object('success', false, 'message', 'This parking space is fully booked for the requested time.');
  end if;

  -- 4. Calculate total amount
  v_total_amount := v_price_per_hour * p_duration;

  -- 5. Insert booking
  insert into bookings (
    username,
    garage_id,
    license_plate,
    booking_date,
    booking_time,
    duration,
    status,
    payment_status,
    paid_with_points,
    points_used
  ) values (
    p_username,
    p_garage_id,
    p_license_plate,
    p_booking_date,
    p_booking_time,
    p_duration,
    'upcoming',
    'pending',
    p_paid_with_points,
    p_points_used
  ) returning id into v_new_booking_id;

  -- 6. Recalculate garage availability
  update garage_information
  set availability = greatest(0, parking_capacity - (
    select count(*) from bookings
    where garage_id = p_garage_id and status in ('upcoming', 'active')
  ))
  where garage_id = p_garage_id;

  return json_build_object(
    'success', true,
    'booking_id', v_new_booking_id,
    'garage_id', p_garage_id,
    'space_name', v_space_name,
    'total_amount', v_total_amount,
    'message', 'Booking reserved successfully! Proceed to payment.'
  );
end;
$$;

-- Function: process_booking_payment (Process payment, points, and commission tracking)
create or replace function process_booking_payment(
  p_booking_id bigint,
  p_payment_method payment_method,
  p_transaction_id varchar(100) default null,
  p_amount numeric(10,2) default 0,
  p_points_used integer default 0
)
returns json
language plpgsql
security definer
as $$
declare
  v_username varchar(50);
  v_garage_id varchar(30);
  v_owner_username varchar(50);
  v_owner_id varchar(100);
  v_commission_rate numeric(5,2) := 30.00;
  v_owner_profit numeric(10,2);
  v_platform_profit numeric(10,2);
  v_space_name varchar(255);
  v_payment_id bigint;
  v_points_earned integer;
  v_user_current_points integer;
  v_user_total_earned integer;
  v_new_level user_level := 'bronze';
begin
  -- 1. Get booking details
  select b.username, b.garage_id, g.parking_space_name, g.username
  into v_username, v_garage_id, v_space_name, v_owner_username
  from bookings b
  join garage_information g on g.garage_id = b.garage_id
  where b.id = p_booking_id;

  if v_username is null then
    return json_build_object('success', false, 'message', 'Booking record not found.');
  end if;

  -- 2. Lookup owner commission
  select coalesce(go.owner_id, du.owner_id)
  into v_owner_id
  from account_information a
  left join garage_owners go on go.username = a.username
  left join dual_user du on du.username = a.username
  where a.username = v_owner_username;

  if v_owner_id is not null then
    select rate into v_commission_rate
    from owner_commissions
    where owner_id = v_owner_id
    limit 1;
    if v_commission_rate is null then
      v_commission_rate := 30.00;
    end if;
  end if;

  -- 3. Calculate profit splits
  v_platform_profit := round((p_amount * (v_commission_rate / 100.0)), 2);
  v_owner_profit := p_amount - v_platform_profit;

  -- 4. Record payment
  insert into payments (
    booking_id,
    transaction_id,
    amount,
    payment_method,
    payment_status,
    points_used
  ) values (
    p_booking_id,
    coalesce(p_transaction_id, 'TXN_' || to_char(now(), 'YYYYMMDDHH24MISS') || '_' || p_booking_id),
    p_amount,
    p_payment_method,
    'paid',
    p_points_used
  ) returning payment_id into v_payment_id;

  -- 5. Update booking payment status
  update bookings
  set payment_status = 'paid',
      paid_with_points = (p_points_used > 0),
      points_used = p_points_used
  where id = p_booking_id;

  -- 6. Insert profit tracking record
  insert into profit_tracking (
    payment_id,
    booking_id,
    owner_id,
    garage_id,
    garage_name,
    total_amount,
    commission_rate,
    owner_profit,
    platform_profit
  ) values (
    v_payment_id,
    p_booking_id,
    v_owner_id,
    v_garage_id,
    v_space_name,
    p_amount,
    v_commission_rate,
    v_owner_profit,
    v_platform_profit
  );

  -- 7. Calculate points earned (1 point per 10 BDT paid)
  v_points_earned := floor(p_amount / 10.0);

  -- Deduct redeemed points if used
  if p_points_used > 0 then
    insert into points_transactions (
      username,
      transaction_type,
      points_amount,
      description,
      booking_id
    ) values (
      v_username,
      'spent',
      p_points_used,
      'Redeemed points for booking #' || p_booking_id,
      p_booking_id
    );
  end if;

  -- Add earned points
  if v_points_earned > 0 then
    insert into points_transactions (
      username,
      transaction_type,
      points_amount,
      description,
      booking_id
    ) values (
      v_username,
      'earned',
      v_points_earned,
      'Earned reward points for booking #' || p_booking_id,
      p_booking_id
    );
  end if;

  -- 8. Update account points and loyalty tier
  select points, total_earned_points
  into v_user_current_points, v_user_total_earned
  from account_information
  where username = v_username;

  v_user_current_points := greatest(0, coalesce(v_user_current_points, 0) - p_points_used + v_points_earned);
  v_user_total_earned := coalesce(v_user_total_earned, 0) + v_points_earned;

  if v_user_total_earned >= 1000 then
    v_new_level := 'diamond';
  elsif v_user_total_earned >= 300 then
    v_new_level := 'gold';
  else
    v_new_level := 'bronze';
  end if;

  update account_information
  set points = v_user_current_points,
      total_earned_points = v_user_total_earned,
      user_level = v_new_level,
      level_updated_at = now()
  where username = v_username;

  return json_build_object(
    'success', true,
    'payment_id', v_payment_id,
    'points_earned', v_points_earned,
    'user_level', v_new_level,
    'message', 'Payment processed successfully! Your receipt is generated.'
  );
end;
$$;

-- Function: cancel_booking_order
create or replace function cancel_booking_order(
  p_booking_id bigint
)
returns json
language plpgsql
security definer
as $$
declare
  v_garage_id varchar(30);
  v_status booking_status;
begin
  select garage_id, status
  into v_garage_id, v_status
  from bookings
  where id = p_booking_id;

  if v_garage_id is null then
    return json_build_object('success', false, 'message', 'Booking not found.');
  end if;

  if v_status not in ('upcoming') then
    return json_build_object('success', false, 'message', 'Only upcoming bookings can be cancelled.');
  end if;

  update bookings
  set status = 'cancelled'
  where id = p_booking_id;

  -- Recalculate garage availability
  update garage_information
  set availability = greatest(0, parking_capacity - (
    select count(*) from bookings
    where garage_id = v_garage_id and status in ('upcoming', 'active')
  ))
  where garage_id = v_garage_id;

  return json_build_object('success', true, 'message', 'Booking cancelled successfully.');
end;
$$;

-- Function: submit_garage_rating
create or replace function submit_garage_rating(
  p_booking_id bigint,
  p_garage_id varchar(30),
  p_rating integer,
  p_review_text text default null
)
returns json
language plpgsql
security definer
as $$
declare
  v_username varchar(50);
  v_owner_username varchar(50);
  v_space_name varchar(255);
  v_tot integer;
  v_avg numeric(3,2);
  v_c1 integer;
  v_c2 integer;
  v_c3 integer;
  v_c4 integer;
  v_c5 integer;
begin
  -- 1. Lookup booking rater and garage info
  select b.username, g.username, g.parking_space_name
  into v_username, v_owner_username, v_space_name
  from bookings b
  join garage_information g on g.garage_id = p_garage_id
  where b.id = p_booking_id;

  if v_username is null then
    return json_build_object('success', false, 'message', 'Booking not found.');
  end if;

  -- 2. Insert or update rating
  insert into ratings (
    booking_id,
    garage_id,
    garage_name,
    rater_username,
    garage_owner_username,
    rating,
    review_text
  ) values (
    p_booking_id,
    p_garage_id,
    v_space_name,
    v_username,
    v_owner_username,
    p_rating,
    p_review_text
  ) on conflict (booking_id) do update set
    rating = excluded.rating,
    review_text = excluded.review_text,
    updated_at = now();

  -- 3. Calculate summary stats
  select
    count(*),
    coalesce(round(avg(rating), 2), 0),
    count(*) filter (where rating = 5),
    count(*) filter (where rating = 4),
    count(*) filter (where rating = 3),
    count(*) filter (where rating = 2),
    count(*) filter (where rating = 1)
  into v_tot, v_avg, v_c5, v_c4, v_c3, v_c2, v_c1
  from ratings
  where garage_id = p_garage_id;

  -- 4. Upsert into garage_ratings_summary
  insert into garage_ratings_summary (
    garage_id,
    garage_name,
    total_ratings,
    average_rating,
    five_star,
    four_star,
    three_star,
    two_star,
    one_star,
    last_updated
  ) values (
    p_garage_id,
    v_space_name,
    v_tot,
    v_avg,
    v_c5,
    v_c4,
    v_c3,
    v_c2,
    v_c1,
    now()
  ) on conflict (garage_id) do update set
    garage_name = excluded.garage_name,
    total_ratings = excluded.total_ratings,
    average_rating = excluded.average_rating,
    five_star = excluded.five_star,
    four_star = excluded.four_star,
    three_star = excluded.three_star,
    two_star = excluded.two_star,
    one_star = excluded.one_star,
    last_updated = now();

  return json_build_object(
    'success', true,
    'average_rating', v_avg,
    'total_ratings', v_tot,
    'message', 'Thank you! Your rating and review have been submitted.'
  );
end;
$$;
