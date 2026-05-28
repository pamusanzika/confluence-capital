create table if not exists public.deal_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  interest text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.deal_inquiries
add column if not exists name text,
add column if not exists email text,
add column if not exists phone text,
add column if not exists subject text,
add column if not exists interest text,
add column if not exists message text,
add column if not exists created_at timestamptz not null default now();
