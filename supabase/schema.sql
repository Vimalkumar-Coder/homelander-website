create extension if not exists pgcrypto;

create table if not exists public.church_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (char_length(trim(email)) between 3 and 254),
  country text not null check (char_length(trim(country)) between 2 and 120),
  loyalty_message text not null check (
    char_length(trim(loyalty_message)) between 12 and 800
  ),
  created_at timestamptz not null default now()
);

create table if not exists public.citizen_complaints (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 120),
  email text not null check (char_length(trim(email)) between 3 and 254),
  location text not null check (char_length(trim(location)) between 2 and 180),
  complaint_description text not null check (
    char_length(trim(complaint_description)) between 20 and 1200
  ),
  created_at timestamptz not null default now()
);

create index if not exists church_members_created_at_idx
  on public.church_members (created_at desc);

create index if not exists citizen_complaints_created_at_idx
  on public.citizen_complaints (created_at desc);

alter table public.church_members enable row level security;
alter table public.citizen_complaints enable row level security;

revoke all on table public.church_members from anon, authenticated;
revoke all on table public.citizen_complaints from anon, authenticated;

grant all on table public.church_members to service_role;
grant all on table public.citizen_complaints to service_role;

