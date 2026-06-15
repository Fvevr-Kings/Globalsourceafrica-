-- Global-Source Africa — quote / product-sourcing requests.
-- Buyers submit a quote for a listed product, or a request to source a product
-- not yet listed, with their contact details. Apply after 0004.

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  request_type text not null default 'quote',  -- 'quote' (listed product) | 'sourcing' (new product)

  -- who's asking
  contact_name text not null,
  contact_email text,
  contact_phone text,
  company text,
  country text,

  -- what they want
  product_id uuid references products(id),      -- set when about a listed product
  product_name text,                            -- snapshot / free-text description
  quantity text,                                -- free text, e.g. "20 tonnes", "100 x 5kg"
  target_price_usd numeric,
  destination text,                             -- shipping destination
  message text,

  status text not null default 'new',           -- new | reviewing | quoted | closed
  created_at timestamptz default now()
);

create index if not exists quote_requests_status_idx
  on quote_requests (status, created_at desc);

-- Locked to anon/authenticated. The public form inserts via a server action
-- using the service role; admin reads/updates via service-role server actions.
alter table quote_requests enable row level security;
