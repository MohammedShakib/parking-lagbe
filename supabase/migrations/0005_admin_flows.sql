-- Migration 0005: Admin Flows & Platform Management

-- 1. Function: admin_get_analytics_summary
create or replace function admin_get_analytics_summary()
returns json
language plpgsql
security definer
as $$
declare
  v_total_users integer := 0;
  v_total_owners integer := 0;
  v_total_garages integer := 0;
  v_total_bookings integer := 0;
  v_total_gross numeric(12,2) := 0;
  v_platform_profit numeric(12,2) := 0;
  v_owner_profit numeric(12,2) := 0;
  v_pending_garages integer := 0;
  v_pending_owners integer := 0;
  v_pending_users integer := 0;
begin
  -- Count entities
  select count(*) into v_total_users from account_information;
  select count(*) into v_total_owners from garage_owners;
  select count(*) into v_total_garages from garage_information;
  select count(*) into v_total_bookings from bookings;

  -- Financial totals from profit_tracking or payments
  select
    coalesce(sum(total_amount), 0),
    coalesce(sum(platform_profit), 0),
    coalesce(sum(owner_profit), 0)
  into v_total_gross, v_platform_profit, v_owner_profit
  from profit_tracking;

  -- If profit_tracking is empty, calculate from paid payments
  if v_total_gross = 0 then
    select coalesce(sum(amount), 0) into v_total_gross from payments where payment_status = 'paid';
    v_platform_profit := v_total_gross * 0.30;
    v_owner_profit := v_total_gross * 0.70;
  end if;

  -- Pending counts
  select count(*) into v_pending_garages from garage_information where is_verified = false;
  select count(*) into v_pending_owners from garage_owners where is_verified = false;
  select count(*) into v_pending_users from account_information where status != 'verified';

  return json_build_object(
    'total_users', v_total_users,
    'total_owners', v_total_owners,
    'total_garages', v_total_garages,
    'total_bookings', v_total_bookings,
    'total_gross', v_total_gross,
    'platform_profit', v_platform_profit,
    'owner_profit', v_owner_profit,
    'pending_garages', v_pending_garages,
    'pending_owners', v_pending_owners,
    'pending_users', v_pending_users
  );
end;
$$;

-- 2. Function: admin_verify_entity
create or replace function admin_verify_entity(
  p_entity_type varchar(20), -- 'garage', 'owner', 'user'
  p_entity_id varchar(100),
  p_new_status varchar(50),  -- 'verified', 'suspended', 'rejected', 'active'
  p_admin_notes text default null
)
returns json
language plpgsql
security definer
as $$
begin
  if not is_admin() then
    return json_build_object('success', false, 'message', 'Unauthorized: Admin access required.');
  end if;

  if p_entity_type = 'garage' then
    update garage_information
    set is_verified = (p_new_status = 'verified'),
        updated_at = now()
    where garage_id = p_entity_id;

    return json_build_object('success', true, 'message', 'Garage verification updated.');

  elsif p_entity_type = 'owner' then
    update garage_owners
    set is_verified = (p_new_status = 'verified'),
        account_status = (case when p_new_status = 'suspended' then 'suspended'::owner_account_status else 'active'::owner_account_status end)
    where owner_id = p_entity_id or username = p_entity_id;

    update dual_user
    set is_verified = (p_new_status = 'verified'),
        is_verified_owner = (p_new_status = 'verified'),
        account_status = (case when p_new_status = 'suspended' then 'suspended'::owner_account_status else 'active'::owner_account_status end)
    where owner_id = p_entity_id or username = p_entity_id;

    return json_build_object('success', true, 'message', 'Owner verification updated.');

  elsif p_entity_type = 'user' then
    update account_information
    set status = p_new_status::account_status,
        updated_at = now()
    where username = p_entity_id;

    return json_build_object('success', true, 'message', 'User account status updated.');
  end if;

  return json_build_object('success', false, 'message', 'Invalid entity type.');
end;
$$;

-- 3. Function: admin_set_owner_commission
create or replace function admin_set_owner_commission(
  p_owner_id varchar(100),
  p_owner_type owner_type,
  p_rate numeric(5,2)
)
returns json
language plpgsql
security definer
as $$
begin
  if not is_admin() then
    return json_build_object('success', false, 'message', 'Unauthorized: Admin access required.');
  end if;

  insert into owner_commissions (owner_id, owner_type, rate, updated_at)
  values (p_owner_id, p_owner_type, p_rate, now())
  on conflict (owner_id) do update set
    rate = excluded.rate,
    owner_type = excluded.owner_type,
    updated_at = now();

  return json_build_object('success', true, 'message', 'Owner commission rate updated successfully.');
end;
$$;
