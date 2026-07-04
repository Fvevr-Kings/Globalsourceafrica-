-- Global-Source Africa — customer testimonials + order tracking.
-- Apply after 0009.

-- Testimonials --------------------------------------------------------------
-- Satisfied-customer reviews with a 1–5 star satisfaction rating. Shown as a
-- rotating slideshow above the footer. Customers can submit (moderated) and
-- staff can curate directly.
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  location text,                                       -- optional, e.g. "Lagos, Nigeria"
  rating int not null default 5 check (rating between 1 and 5),
  comment text not null,
  approval_status text not null default 'pending',     -- pending | approved | rejected
  source text not null default 'customer',             -- 'customer' (submitted) | 'admin' (curated)
  sort int not null default 0,                          -- display order in the slideshow
  created_at timestamptz default now()
);

create index if not exists testimonials_approved_idx
  on testimonials (approval_status, sort, created_at desc);

-- Storefront reads APPROVED testimonials only. Customer submissions and every
-- admin write go through service-role server actions (which bypass RLS).
alter table testimonials enable row level security;

drop policy if exists testimonials_read_public on testimonials;
create policy testimonials_read_public on testimonials
  for select using (approval_status = 'approved');

grant select on testimonials to anon, authenticated;

-- Order tracking ------------------------------------------------------------
-- Every order flows through us to the merchant; give customers a visible note
-- and a last-updated timestamp for the status timeline. The status set gains
-- 'processing' (order received by us, being prepared with the supplier):
--   placed → confirmed → processing → shipped → delivered  (refunded is terminal)
alter table orders add column if not exists tracking_note text;
alter table orders add column if not exists status_updated_at timestamptz default now();
