-- Migration 0002: Authentication, Roles, and Row Level Security (RLS)
-- Supports Supabase Auth linking with account_information, role resolution, and security policies.

-- Enable Row Level Security (RLS) on core user tables
alter table account_information enable row level security;
alter table personal_information enable row level security;
alter table garage_owners enable row level security;
alter table dual_user enable row level security;
alter table user_login_history enable row level security;
alter table vehicle_information enable row level security;

-- Function to check if the current requesting user is an admin
create or replace function is_admin(user_id uuid default auth.uid())
returns boolean
language plpgsql
security definer
as $$
declare
  v_username varchar(50);
  v_is_admin boolean := false;
begin
  if user_id is null then
    return false;
  end if;

  -- Check if user has admin claim in auth.users app_metadata / user_metadata or username is admin
  select username into v_username
  from account_information
  where auth_user_id = user_id;

  if v_username = 'admin' then
    return true;
  end if;

  -- Also check raw_app_meta_data or raw_user_meta_data for role = 'admin'
  select coalesce((raw_app_meta_data->>'role' = 'admin'), false) or coalesce((raw_user_meta_data->>'role' = 'admin'), false)
  into v_is_admin
  from auth.users
  where id = user_id;

  return coalesce(v_is_admin, false);
end;
$$;

-- Function to resolve user role
create or replace function get_user_role(auth_uid uuid default auth.uid())
returns text
language plpgsql
security definer
as $$
declare
  v_username varchar(50);
  v_default_dashboard dashboard_type;
  v_is_garage_owner boolean := false;
  v_is_dual_user boolean := false;
begin
  if auth_uid is null then
    return 'anonymous';
  end if;

  -- Check if admin
  if is_admin(auth_uid) then
    return 'admin';
  end if;

  -- Get account details
  select username, default_dashboard
  into v_username, v_default_dashboard
  from account_information
  where auth_user_id = auth_uid;

  if v_username is null then
    return 'regular_user';
  end if;

  -- Check garage_owners table
  select exists(select 1 from garage_owners where username = v_username)
  into v_is_garage_owner;

  -- Check dual_user table
  select exists(select 1 from dual_user where username = v_username)
  into v_is_dual_user;

  if v_is_dual_user then
    return 'dual_user';
  elsif v_is_garage_owner then
    return 'garage_owner';
  else
    return 'regular_user';
  end if;
end;
$$;

-- Function to record login history
create or replace function record_login_history(
  p_username varchar(50),
  p_ip inet default null,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
as $$
begin
  insert into user_login_history (username, login_time, ip_address, user_agent)
  values (p_username, now(), p_ip, p_user_agent);

  -- Update last_login on account_information
  update account_information
  set last_login = now()
  where username = p_username;

  -- Also update garage_owners and dual_user if applicable
  update garage_owners set last_login = now() where username = p_username;
  update dual_user set last_login = now() where username = p_username;
end;
$$;

-- Function to switch default dashboard
create or replace function switch_default_dashboard(
  p_dashboard dashboard_type
)
returns void
language plpgsql
security definer
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Unauthorized';
  end if;

  update account_information
  set default_dashboard = p_dashboard
  where auth_user_id = v_user_id;
end;
$$;

-- ==========================================================
-- ROW LEVEL SECURITY POLICIES
-- ==========================================================

-- account_information RLS
create policy "Users can view their own account information or admin can view all"
  on account_information for select
  using (
    auth.uid() = auth_user_id
    or is_admin()
  );

create policy "Users can update their own account information or admin can update all"
  on account_information for update
  using (
    auth.uid() = auth_user_id
    or is_admin()
  );

create policy "Enable insert for authenticated users or service role"
  on account_information for insert
  with check (
    auth.uid() = auth_user_id
    or is_admin()
  );

-- personal_information RLS
create policy "Users can view their own personal info or admin can view all"
  on personal_information for select
  using (
    exists (
      select 1 from account_information
      where account_information.username = personal_information.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Users can update their own personal info or admin can update all"
  on personal_information for update
  using (
    exists (
      select 1 from account_information
      where account_information.username = personal_information.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Users can insert their own personal info"
  on personal_information for insert
  with check (
    exists (
      select 1 from account_information
      where account_information.username = personal_information.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

-- garage_owners RLS
create policy "Garage owners can view their own owner record or admin can view all"
  on garage_owners for select
  using (
    exists (
      select 1 from account_information
      where account_information.username = garage_owners.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Garage owners can insert their own owner record"
  on garage_owners for insert
  with check (
    exists (
      select 1 from account_information
      where account_information.username = garage_owners.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Garage owners can update their own owner record or admin can update"
  on garage_owners for update
  using (
    exists (
      select 1 from account_information
      where account_information.username = garage_owners.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

-- dual_user RLS
create policy "Dual users can view their own record or admin can view all"
  on dual_user for select
  using (
    exists (
      select 1 from account_information
      where account_information.username = dual_user.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Dual users can insert their own record"
  on dual_user for insert
  with check (
    exists (
      select 1 from account_information
      where account_information.username = dual_user.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

-- user_login_history RLS
create policy "Users can view their own login history or admin can view all"
  on user_login_history for select
  using (
    exists (
      select 1 from account_information
      where account_information.username = user_login_history.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Insert login history for self or admin"
  on user_login_history for insert
  with check (
    exists (
      select 1 from account_information
      where account_information.username = user_login_history.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

-- vehicle_information RLS
create policy "Users can view their own vehicles or admin can view all"
  on vehicle_information for select
  using (
    exists (
      select 1 from account_information
      where account_information.username = vehicle_information.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );

create policy "Users can manage their own vehicles"
  on vehicle_information for all
  using (
    exists (
      select 1 from account_information
      where account_information.username = vehicle_information.username
      and (account_information.auth_user_id = auth.uid() or is_admin())
    )
  );
