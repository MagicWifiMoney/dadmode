-- DadMode lead capture
-- The /api/onboard route upserts { email, due_date } on conflict (email)
-- using the Supabase service-role key.

create table if not exists public.leads (
  id         uuid        primary key default gen_random_uuid(),
  email      text        not null unique,
  due_date   timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Lock the table down: the API writes with the service-role key (which bypasses
-- RLS), and with RLS enabled and no policies the anon/public keys get no access.
alter table public.leads enable row level security;
