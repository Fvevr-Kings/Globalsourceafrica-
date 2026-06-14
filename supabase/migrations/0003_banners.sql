-- Global-Source Africa — homepage billboard / ad banners.
-- Admin uploads a GIF / animated image / short looping video into the hero
-- slot; multiple active banners rotate as a billboard. Apply after 0002.

create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  media_url text not null,          -- gif / image / mp4|webm in product-media bucket
  media_type text not null default 'image', -- 'image' | 'video' (gif counts as image)
  headline text,                    -- optional overlay copy (ad message)
  subtitle text,
  link_url text,                    -- optional click-through (run an ad/campaign)
  cta_label text,                   -- optional button label
  sort int not null default 0,      -- display order in the rotation
  active boolean not null default true,
  created_at timestamptz default now()
);

create index if not exists banners_active_sort_idx on banners (active, sort);

-- Storefront reads ACTIVE banners only; writes happen via staff-gated server
-- actions using the service role (bypasses RLS).
alter table banners enable row level security;

drop policy if exists banners_read_public on banners;
create policy banners_read_public on banners
  for select using (active = true);

grant select on banners to anon, authenticated;
