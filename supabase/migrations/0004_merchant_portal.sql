-- Global-Source Africa — merchant self-service portal.
-- Approved suppliers log in (OTP, matched on `contact`) and submit their own
-- products, which stay HIDDEN from buyers until an admin approves them.
-- Apply after 0003.

-- Login identity for a supplier (set when their application is approved).
alter table suppliers add column if not exists contact text;
create unique index if not exists suppliers_contact_key on suppliers (contact)
  where contact is not null;

-- Product approval workflow. Default 'approved' so existing/admin/seed products
-- stay visible; merchant submissions are inserted as 'pending'.
alter table products add column if not exists approval_status text not null default 'approved';
alter table products add column if not exists rejection_reason text;
create index if not exists products_approval_status_idx on products (approval_status);

-- Buyer-facing view now also hides non-approved products. Columns unchanged so
-- `create or replace` is valid; only the filter is added.
create or replace view public_products
with (security_invoker = true) as
select
  p.id, p.slug, p.name, p.category, p.origin_country, p.origin_flag,
  p.blurb, p.description, p.base_unit, p.retail_price_usd, p.image_urls, p.in_stock,
  p.origin_region, p.harvest_date, p.moisture_pct, p.grade, p.certifications,
  p.quality_report_url, p.batch_photo_urls,
  p.name_i18n, p.blurb_i18n, p.description_i18n,
  p.created_at
from products p
where p.approval_status = 'approved';
