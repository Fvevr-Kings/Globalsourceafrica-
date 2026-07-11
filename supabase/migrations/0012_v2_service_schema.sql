-- GlobalSource Africa v2 — sourcing & verification service schema.
-- Coexists with v1 tables during the transition (v2 uses new table names so the
-- live v1 marketplace keeps working until we cut over). Apply after 0011.

-- Service inquiries from /request ------------------------------------------
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,                 -- GSA-2026-0001
  service_type text not null,               -- verification|discovery|inspection|sourcing|unsure
  payload jsonb not null default '{}',      -- dynamic per-service fields
  company text,
  country text,
  email text not null,
  whatsapp text,
  status text not null default 'new',       -- new|scoped|quoted|active|delivered|closed
  created_at timestamptz default now()
);
create index if not exists inquiries_status_idx on inquiries (status, created_at desc);

-- Email-gated sample-report downloads --------------------------------------
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'sample_report',
  created_at timestamptz default now()
);

-- Internal supplier directory — the PAID asset. NEVER exposed via public API.
-- (Named supplier_directory to avoid colliding with the v1 `suppliers` table
-- still present during transition.)
create table if not exists supplier_directory (
  id uuid primary key default gen_random_uuid(),
  company_name text,
  country text,
  region text,
  products text[] default '{}',
  verification_status text default 'pending',  -- pending|verified|failed
  audit_notes jsonb,
  docs jsonb,
  last_verified_at timestamptz,
  created_at timestamptz default now()
);

-- RLS: everything locked to anon. Inserts to inquiries/leads happen via
-- service-role server actions (same trusted-server pattern as v1). The supplier
-- directory is service-role only under every policy — no anon access ever.
alter table inquiries          enable row level security;
alter table leads              enable row level security;
alter table supplier_directory enable row level security;
