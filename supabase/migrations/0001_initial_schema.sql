-- Supabase/Postgres schema draft for the Parking Lagbe migration.
-- This migration intentionally does not import legacy plaintext passwords or sample data.

create type account_status as enum ('verified', 'unverified');
create type dashboard_type as enum ('business', 'user');
create type user_level as enum ('bronze', 'gold', 'diamond');
create type owner_account_status as enum ('active', 'suspended', 'inactive');
create type booking_status as enum ('upcoming', 'active', 'completed', 'cancelled');
create type payment_status as enum ('pending', 'paid', 'refunded');
create type payment_method as enum ('bkash', 'nagad', 'card', 'points', 'cash', 'other');
create type transaction_type as enum ('earned', 'spent', 'refunded', 'adjustment');
create type verification_status as enum ('pending', 'under_review', 'approved', 'rejected');
create type garage_status as enum ('available', 'busy', 'closed');
create type owner_type as enum ('garage', 'dual');

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table account_information (
  username varchar(50) primary key,
  auth_user_id uuid unique references auth.users(id) on delete set null,
  status account_status not null default 'unverified',
  owner_id varchar(100),
  default_dashboard dashboard_type default 'user',
  registration_date timestamptz not null default now(),
  last_login timestamptz,
  points integer not null default 0 check (points >= 0),
  user_level user_level not null default 'bronze',
  total_earned_points integer not null default 0 check (total_earned_points >= 0),
  level_updated_at timestamptz
);

create table personal_information (
  email varchar(255) primary key,
  first_name varchar(100) not null,
  last_name varchar(100) not null,
  phone varchar(30),
  address text,
  username varchar(50) not null unique references account_information(username) on delete cascade on update cascade
);

create table garage_owners (
  owner_id varchar(100) primary key,
  username varchar(50) not null unique references account_information(username) on delete cascade on update cascade,
  is_verified boolean not null default false,
  registration_date timestamptz not null default now(),
  last_login timestamptz,
  account_status owner_account_status not null default 'active'
);

create table dual_user (
  owner_id varchar(100) primary key,
  username varchar(50) not null unique references account_information(username) on delete cascade on update cascade,
  is_verified boolean not null default false,
  registration_date timestamptz not null default now(),
  last_login timestamptz,
  account_status owner_account_status not null default 'active'
);

create table garagelocation (
  garage_id varchar(30) primary key,
  latitude numeric(10, 8) not null,
  longitude numeric(11, 8) not null,
  username varchar(50) not null references account_information(username) on delete cascade on update cascade
);

create table garage_information (
  id bigint generated always as identity primary key,
  username varchar(50) not null references account_information(username) on delete cascade on update cascade,
  garage_id varchar(30) not null unique references garagelocation(garage_id) on delete cascade on update cascade,
  parking_space_name varchar(255) not null,
  parking_lot_address text not null,
  parking_type varchar(100),
  parking_space_dimensions varchar(100),
  parking_capacity integer not null check (parking_capacity >= 0),
  availability integer not null default 0 check (availability >= 0),
  price_per_hour numeric(10, 2) not null default 0 check (price_per_hour >= 0),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger garage_information_set_updated_at
before update on garage_information
for each row execute function set_updated_at();

create table garage_operating_schedule (
  garage_id varchar(30) primary key references garage_information(garage_id) on delete cascade on update cascade,
  garage_name varchar(255),
  opening_time time,
  closing_time time,
  operating_days text[] not null default array['monday','tuesday','wednesday','thursday','friday','saturday','sunday'],
  is_24_7 boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger garage_operating_schedule_set_updated_at
before update on garage_operating_schedule
for each row execute function set_updated_at();

create table garage_real_time_status (
  garage_id varchar(30) primary key references garage_information(garage_id) on delete cascade on update cascade,
  current_status garage_status not null default 'available',
  is_manual_override boolean not null default false,
  override_until timestamptz,
  override_reason text,
  force_closed boolean not null default false,
  active_bookings_count integer not null default 0 check (active_bookings_count >= 0),
  can_close_after timestamptz,
  last_changed_at timestamptz not null default now(),
  changed_by varchar(50) references account_information(username) on delete set null on update cascade
);

create table garage_status_log (
  id bigint generated always as identity primary key,
  garage_id varchar(30) not null references garage_information(garage_id) on delete cascade on update cascade,
  old_status garage_status,
  new_status garage_status not null,
  changed_by varchar(50) references account_information(username) on delete set null on update cascade,
  change_reason text,
  changed_at timestamptz not null default now()
);

create table vehicle_information (
  license_plate varchar(50) primary key,
  vehicle_type varchar(50) not null,
  make varchar(100),
  model varchar(100),
  color varchar(50),
  username varchar(50) not null references account_information(username) on delete cascade on update cascade
);

create table bookings (
  id bigint generated always as identity primary key,
  username varchar(50) not null references account_information(username) on delete cascade on update cascade,
  garage_id varchar(30) not null references garagelocation(garage_id) on delete restrict on update cascade,
  license_plate varchar(50) not null references vehicle_information(license_plate) on delete restrict on update cascade,
  booking_date date not null,
  booking_time time not null,
  duration integer not null check (duration > 0),
  status booking_status not null default 'upcoming',
  payment_status payment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_with_points boolean not null default false,
  points_used integer not null default 0 check (points_used >= 0)
);

create trigger bookings_set_updated_at
before update on bookings
for each row execute function set_updated_at();

create table payments (
  payment_id bigint generated always as identity primary key,
  booking_id bigint not null references bookings(id) on delete cascade on update cascade,
  transaction_id varchar(100) unique,
  amount numeric(10, 2) not null check (amount >= 0),
  payment_method payment_method not null default 'other',
  payment_status payment_status not null default 'pending',
  payment_date timestamptz not null default now(),
  points_used integer not null default 0 check (points_used >= 0)
);

create table owner_commissions (
  id bigint generated always as identity primary key,
  owner_id varchar(100) not null,
  owner_type owner_type not null,
  rate numeric(5, 2) not null default 30.00 check (rate >= 0 and rate <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger owner_commissions_set_updated_at
before update on owner_commissions
for each row execute function set_updated_at();

create table profit_tracking (
  id bigint generated always as identity primary key,
  payment_id bigint not null references payments(payment_id) on delete cascade,
  booking_id bigint not null references bookings(id) on delete cascade,
  owner_id varchar(100),
  garage_id varchar(30),
  garage_name varchar(255),
  total_amount numeric(10, 2) not null default 0,
  commission_rate numeric(5, 2) not null default 30.00,
  owner_profit numeric(10, 2) not null default 0,
  platform_profit numeric(10, 2) not null default 0,
  created_at timestamptz not null default now()
);

create table points_transactions (
  id bigint generated always as identity primary key,
  username varchar(50) not null references account_information(username) on delete cascade on update cascade,
  transaction_type transaction_type not null,
  points_amount integer not null,
  description text,
  booking_id bigint references bookings(id) on delete set null,
  created_at timestamptz not null default now()
);

create table ratings (
  id bigint generated always as identity primary key,
  booking_id bigint not null references bookings(id) on delete cascade,
  garage_id varchar(30) not null references garagelocation(garage_id) on delete cascade on update cascade,
  garage_name varchar(255),
  rater_username varchar(50) not null references account_information(username) on delete cascade on update cascade,
  garage_owner_username varchar(50) references account_information(username) on delete cascade on update cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  review_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (booking_id)
);

create trigger ratings_set_updated_at
before update on ratings
for each row execute function set_updated_at();

create table garage_ratings_summary (
  garage_id varchar(30) primary key references garagelocation(garage_id) on delete cascade on update cascade,
  garage_name varchar(255),
  total_ratings integer not null default 0 check (total_ratings >= 0),
  average_rating numeric(3, 2) not null default 0,
  five_star integer not null default 0,
  four_star integer not null default 0,
  three_star integer not null default 0,
  two_star integer not null default 0,
  one_star integer not null default 0,
  last_updated timestamptz not null default now()
);

create table verification_requests (
  id bigint generated always as identity primary key,
  username varchar(50) not null references account_information(username) on delete cascade on update cascade,
  request_type varchar(50) not null default 'full',
  overall_status verification_status not null default 'pending',
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  admin_notes text
);

create table verification_documents (
  id bigint generated always as identity primary key,
  username varchar(50) not null references account_information(username) on delete cascade on update cascade,
  document_type varchar(100) not null,
  document_number varchar(100),
  storage_bucket varchar(100),
  storage_path text,
  original_filename text,
  file_size bigint,
  mime_type varchar(255),
  status verification_status not null default 'pending',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by varchar(50) references account_information(username) on delete set null on update cascade,
  rejection_reason text
);

create table user_login_history (
  id bigint generated always as identity primary key,
  username varchar(50) not null references account_information(username) on delete cascade on update cascade,
  login_time timestamptz not null default now(),
  ip_address inet,
  user_agent text
);

create table user_notification_checks (
  username varchar(50) primary key references account_information(username) on delete cascade on update cascade,
  last_check_time timestamptz not null default now()
);

create index idx_bookings_username on bookings(username);
create index idx_bookings_garage_id on bookings(garage_id);
create index idx_bookings_status_date on bookings(status, booking_date);
create index idx_payments_booking_id on payments(booking_id);
create index idx_points_transactions_username on points_transactions(username);
create index idx_ratings_garage_id on ratings(garage_id);
create index idx_verification_requests_username_status on verification_requests(username, overall_status);
create index idx_verification_documents_username_status on verification_documents(username, status);
