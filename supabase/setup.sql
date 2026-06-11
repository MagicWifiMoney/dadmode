-- DadMode — full schema in one paste.
-- Convenience copy of supabase/migrations/0001_init.sql + 0002_entitlements.sql.
-- Paste this whole block into the Supabase SQL Editor and run it once.
-- Safe to re-run (everything is IF NOT EXISTS).

-- Email leads: the /api/onboard route upserts { email, due_date } on conflict.
create table if not exists public.leads (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null unique,
  due_date   timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists leads_created_at_idx on public.leads (created_at desc);
alter table public.leads enable row level security;

-- Pro entitlements: written by the Stripe webhook (/api/stripe/webhook),
-- read by /api/entitlement ("restore access") and the /admin dashboard.
create table if not exists public.entitlements (
  id                 uuid        primary key default gen_random_uuid(),
  email              text        not null unique,
  plan               text        not null default 'pass',
  status             text        not null default 'active',  -- active | canceled
  stripe_customer_id text,
  stripe_session_id  text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists entitlements_customer_idx
  on public.entitlements (stripe_customer_id);
alter table public.entitlements enable row level security;

-- RLS is on with no policies: only the service-role key (used by the API
-- routes, which bypasses RLS) can read/write. Public/anon keys get nothing.
