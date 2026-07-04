-- Global-Source Africa — optional avatar/photo for testimonials so the
-- marquee can show real faces. Apply after 0010.

alter table testimonials add column if not exists avatar_url text;
