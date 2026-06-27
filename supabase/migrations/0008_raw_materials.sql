-- Raw materials storefront. Products gain a `section` so the same catalog powers
-- two stores: 'farm' (the main storefront, default) and 'raw' (African raw
-- materials). Reuses product pages, cart, checkout, admin, and search.
-- Apply after 0007.

alter table products add column if not exists section text not null default 'farm';
create index if not exists products_section_idx on products (section);

-- Surface `section` on the buyer-safe view (appended at the end so the existing
-- column order is preserved — required by create-or-replace view).
create or replace view public_products
with (security_invoker = true) as
select
  p.id, p.slug, p.name, p.category, p.origin_country, p.origin_flag,
  p.blurb, p.description, p.base_unit, p.retail_price_usd, p.image_urls, p.in_stock,
  p.origin_region, p.harvest_date, p.moisture_pct, p.grade, p.certifications,
  p.quality_report_url, p.batch_photo_urls,
  p.name_i18n, p.blurb_i18n, p.description_i18n,
  p.created_at,
  p.section
from products p
where p.approval_status = 'approved';

-- Recreate the search RPC so its rows include the new `section` column (it
-- returns setof public_products). Body unchanged from 0001.
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
  select pp.* from public_products pp
  join products p on p.id = pp.id
  where not exists (select 1 from fts)
    and similarity(p.name, q) > 0.2
  order by 1;
$$;
