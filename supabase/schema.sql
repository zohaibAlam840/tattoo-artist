-- ============================================================
-- LA MAISON DES ARTISTES — Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ---- ENUMS ----
create type user_role as enum ('admin', 'resident', 'guest');
create type booking_type as enum ('full', 'am', 'pm');

-- ---- PROFILES ----
create table profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  email             text not null,
  full_name         text not null default '',
  handle            text not null default '',
  role              user_role not null default 'resident',
  preferred_station integer check (preferred_station between 1 and 4),
  avatar_url        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---- GUEST PERIODS ----
-- Admin-defined booking windows for guest artists.
-- A guest may have multiple periods (new row each visit).
create table guest_periods (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  start_date  date not null,
  end_date    date not null,
  created_by  uuid not null references profiles(id),
  created_at  timestamptz not null default now(),
  constraint valid_range check (end_date >= start_date)
);

-- ---- BOOKINGS ----
create table bookings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references profiles(id) on delete cascade,
  station      integer not null check (station between 1 and 4),
  booking_date date not null,
  booking_type booking_type not null,
  created_by   uuid references profiles(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Partial unique indexes: prevent duplicate slot types per station+date
create unique index bookings_station_date_full on bookings(station, booking_date) where booking_type = 'full';
create unique index bookings_station_date_am   on bookings(station, booking_date) where booking_type = 'am';
create unique index bookings_station_date_pm   on bookings(station, booking_date) where booking_type = 'pm';

-- ---- AUTO-CREATE PROFILE ON SIGNUP ----
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'resident')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ---- IS_ADMIN HELPER (avoids RLS recursion) ----
create or replace function is_admin()
returns boolean language sql security definer set search_path = public
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- ---- RLS ----
alter table profiles    enable row level security;
alter table guest_periods enable row level security;
alter table bookings    enable row level security;

-- Profiles
create policy "profiles: read all"     on profiles for select to authenticated using (true);
create policy "profiles: update own"   on profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles: admin update" on profiles for update to authenticated using (is_admin()) with check (is_admin());

-- Guest periods
create policy "guest_periods: read"        on guest_periods for select  to authenticated using (true);
create policy "guest_periods: admin write" on guest_periods for all     to authenticated using (is_admin()) with check (is_admin());

-- Bookings
create policy "bookings: read all"       on bookings for select to authenticated using (true);
create policy "bookings: insert own"     on bookings for insert to authenticated with check (auth.uid() = user_id);
create policy "bookings: admin insert"   on bookings for insert to authenticated with check (is_admin());
create policy "bookings: delete own"     on bookings for delete to authenticated using (auth.uid() = user_id);
create policy "bookings: admin delete"   on bookings for delete to authenticated using (is_admin());
create policy "bookings: admin update"   on bookings for update to authenticated using (is_admin()) with check (is_admin());

-- ---- SEED: Admin user (already created via Auth) ----
-- This inserts the profile for the pre-created admin account.
-- The trigger handles future signups automatically.
insert into profiles (id, email, full_name, handle, role, preferred_station)
values (
  '9ea4705a-7343-4855-b3db-3b86567710e9',
  'admin@lamaison.com',
  'Admin',
  '@admin',
  'admin',
  1
) on conflict (id) do update set role = 'admin';

-- ---- REASSIGN + BOOK (atomic transaction) ----
create or replace function reassign_and_book(
  p_conflict_booking_id uuid,
  p_new_station         integer,
  p_admin_user_id       uuid,
  p_admin_station       integer,
  p_date                date,
  p_booking_type        booking_type
) returns void language plpgsql security definer as $$
begin
  -- Move evictee to new station
  update bookings
    set station = p_new_station, updated_at = now()
    where id = p_conflict_booking_id;

  -- Create admin's booking on their preferred station
  insert into bookings (user_id, station, booking_date, booking_type, created_by)
    values (p_admin_user_id, p_admin_station, p_date, p_booking_type, p_admin_user_id);
end;
$$;
