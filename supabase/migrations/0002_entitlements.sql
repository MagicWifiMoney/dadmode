-- DadMode Pro entitlements
-- Written by the Stripe webhook (/api/stripe/webhook) using the service-role
-- key. The /api/entitlement "restore access" lookup reads from it by email.

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

-- Service-role key (used by the webhook) bypasses RLS; with RLS enabled and no
-- policies, anon/public keys get no access to purchase records.
alter table public.entitlements enable row level security;
