-- News & events timeline for the About page. Admin creates posts (with images);
-- customers browse them like a social feed. Apply after 0008.

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  image_urls text[] default '{}',
  kind text not null default 'news',   -- 'news' | 'event'
  event_date date,                      -- optional, for events
  published boolean not null default true,
  created_at timestamptz default now()
);

create index if not exists posts_published_idx on posts (published, created_at desc);

-- Public may read PUBLISHED posts (buyer-safe feed). Admin reads/writes all via
-- the service role (bypasses RLS), same pattern as the rest of the app.
alter table posts enable row level security;

drop policy if exists posts_read_public on posts;
create policy posts_read_public on posts
  for select using (published = true);
