-- Global-Source Africa — Phase 1 schema (build spec §4)
-- Run with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
-- Idempotent-ish: safe to re-run on a fresh project.

-- Extensions ----------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";     -- typo-tolerant search fallback (§4a)

-- Tables --------------------------------------------------------------------

-- Suppliers stay BEHIND the brand. Never exposed to buyers in any API response.
create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  business_name text not null unique,
  country text not null,
  verified boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references suppliers(id),   -- internal only, never returned to storefront
  slug text unique not null,
  name text not null,
  category text not null,           -- Grains | Pulses | Nuts | Spices | Cocoa | Coffee | Shea | ...
  origin_country text not null,     -- shown to buyer (e.g. "Nigeria")
  origin_flag text,                 -- emoji or code for display
  blurb text,
  description text,
  base_unit text not null,          -- e.g. "5kg"
  retail_price_usd numeric not null,
  image_urls text[] default '{}',
  in_stock boolean not null default true,

  -- PROVENANCE (the real differentiator — structured, not a text blob)
  origin_region text,               -- e.g. "Ondo State"
  harvest_date date,
  moisture_pct numeric,             -- e.g. 7.5
  grade text,                       -- e.g. "W320", "Grade 1"
  certifications text[] default '{}',
  quality_report_url text,
  batch_photo_urls text[] default '{}',

  -- i18n-ready (Phase 1 ships USD/English; columns let us localize later)
  name_i18n jsonb default '{}',
  blurb_i18n jsonb default '{}',
  description_i18n jsonb default '{}',

  -- synonyms feed the search vector at write time (§4a)
  synonyms text[] default '{}',

  -- denormalized for search ranking (kept in sync via trigger)
  search_tsv tsvector,

  created_at timestamptz default now()
);

-- Bulk tiers: buy N+ of base_unit, get per-unit price.
create table if not exists product_price_tiers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  min_qty int not null,
  unit_price_usd numeric not null
);

-- Buyers: silent accounts created at checkout. No password.
create table if not exists buyers (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid unique,             -- links to auth.users (set on first OTP verify)
  contact text unique not null,     -- email or phone (the identity)
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references buyers(id),
  status text not null default 'placed',  -- placed | confirmed | shipped | delivered | refunded
  currency text not null default 'USD',
  subtotal_usd numeric not null,
  shipping_name text,
  shipping_address jsonb,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,       -- snapshot at purchase time
  qty int not null,
  unit_price_usd numeric not null,  -- resolved tier price at purchase time
  line_total_usd numeric not null
);

create index if not exists products_search_tsv_idx on products using gin (search_tsv);
create index if not exists products_name_trgm_idx on products using gin (name gin_trgm_ops);
create index if not exists product_price_tiers_product_idx on product_price_tiers (product_id);
create index if not exists order_items_order_idx on order_items (order_id);

-- Full-text search (§4a) ----------------------------------------------------
-- Build search_tsv from name, category, origin_country, origin_region, blurb,
-- and the synonyms array — so "groundnut" finds a "peanut" listing.
create or replace function products_search_tsv_update() returns trigger as $$
begin
  new.search_tsv :=
      setweight(to_tsvector('simple', coalesce(new.name, '')), 'A')
    || setweight(to_tsvector('simple', array_to_string(coalesce(new.synonyms, '{}'), ' ')), 'A')
    || setweight(to_tsvector('simple', coalesce(new.category, '')), 'B')
    || setweight(to_tsvector('simple', coalesce(new.origin_country, '')), 'C')
    || setweight(to_tsvector('simple', coalesce(new.origin_region, '')), 'C')
    || setweight(to_tsvector('simple', coalesce(new.blurb, '')), 'D');
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_search_tsv_trg on products;
create trigger products_search_tsv_trg
  before insert or update on products
  for each row execute function products_search_tsv_update();

-- Public, buyer-safe product view (§4 RLS) ----------------------------------
-- Omits supplier_id and any supplier identity. The storefront ONLY reads this.
create or replace view public_products
with (security_invoker = true) as
select
  p.id, p.slug, p.name, p.category, p.origin_country, p.origin_flag,
  p.blurb, p.description, p.base_unit, p.retail_price_usd, p.image_urls, p.in_stock,
  p.origin_region, p.harvest_date, p.moisture_pct, p.grade, p.certifications,
  p.quality_report_url, p.batch_photo_urls,
  p.name_i18n, p.blurb_i18n, p.description_i18n,
  p.created_at
from products p;

-- Search RPC: real FTS with trigram fallback (§4a). Returns buyer-safe columns.
create or replace function search_products(q text)
returns setof public_products
language sql
stable
as $$
  with fts as (
    select p.*, ts_rank(p.search_tsv, websearch_to_tsquery('simple', q)) as rank
    from products p
    where p.search_tsv @@ websearch_to_tsquery('simple', q)
    order by rank desc
  )
  select pp.* from public_products pp
  join fts on fts.id = pp.id
  union all
  -- Trigram fallback only when FTS found nothing (typo tolerance).
  select pp.* from public_products pp
  join products p on p.id = pp.id
  where not exists (select 1 from fts)
    and similarity(p.name, q) > 0.2
  order by 1;
$$;

-- RLS -----------------------------------------------------------------------
alter table suppliers            enable row level security;
alter table products             enable row level security;
alter table product_price_tiers  enable row level security;
alter table buyers               enable row level security;
alter table orders               enable row level security;
alter table order_items          enable row level security;

-- No public policies on suppliers => buyers can never read supplier rows.
-- products / tiers: anon may read (the view + tiers are buyer-safe; supplier_id
-- is never selected by the storefront and is stripped by public_products).
drop policy if exists products_read_public on products;
create policy products_read_public on products
  for select using (true);

drop policy if exists tiers_read_public on product_price_tiers;
create policy tiers_read_public on product_price_tiers
  for select using (true);

-- buyers: a buyer may read only their own row (matched to auth uid).
drop policy if exists buyers_self_read on buyers;
create policy buyers_self_read on buyers
  for select using (auth_uid = auth.uid());

-- orders: a buyer may read only their own orders.
drop policy if exists orders_self_read on orders;
create policy orders_self_read on orders
  for select using (
    buyer_id in (select id from buyers where auth_uid = auth.uid())
  );

drop policy if exists order_items_self_read on order_items;
create policy order_items_self_read on order_items
  for select using (
    order_id in (
      select o.id from orders o
      join buyers b on b.id = o.buyer_id
      where b.auth_uid = auth.uid()
    )
  );

-- Writes to buyers/orders/order_items happen server-side via the service role
-- (order placement resolves tier pricing it can trust), so no insert policies
-- for anon are granted here.

grant select on public_products to anon, authenticated;
grant execute on function search_products(text) to anon, authenticated;
