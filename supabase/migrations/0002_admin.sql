-- Global-Source Africa — Phase 2 (admin) schema.
-- Adds staff allowlist, public supplier applications, and a media storage bucket.
-- Apply after 0001_init.sql.

-- Staff allowlist — only these contacts may reach /admin (OTP + allowlist auth).
create table if not exists staff (
  id uuid primary key default gen_random_uuid(),
  contact text unique not null,            -- email or phone (matches the OTP session)
  name text,
  role text not null default 'admin',      -- admin | ops
  created_at timestamptz default now()
);

-- Public supplier applications — the "become a supplier" form feeds this queue.
create table if not exists supplier_applications (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  country text not null,
  contact_email text,
  contact_phone text,
  categories text[] default '{}',
  message text,
  status text not null default 'pending',  -- pending | approved | rejected
  supplier_id uuid references suppliers(id), -- set when approved
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists supplier_applications_status_idx
  on supplier_applications (status, created_at desc);

-- RLS: both tables are locked to anon/authenticated. ALL admin reads/writes go
-- through server actions using the service-role client AFTER verifying the
-- caller is staff — same trusted-server pattern as order placement. The public
-- application form also inserts via a server action (service role), so no anon
-- policies are granted here.
alter table staff                  enable row level security;
alter table supplier_applications  enable row level security;

-- Media bucket for product images, batch photos, and the hero banner.
insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;

-- Public read of media; uploads happen via the service role (admin-gated server
-- action), which bypasses storage RLS — so only a read policy is needed.
drop policy if exists product_media_public_read on storage.objects;
create policy product_media_public_read on storage.objects
  for select using (bucket_id = 'product-media');
