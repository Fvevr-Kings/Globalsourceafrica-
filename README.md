# GlobalSource Africa — Phase 1

A product-first storefront for non-perishable African farm products (grains,
pulses, nuts, dried spices, cocoa, coffee, shea). The platform is the **merchant
of record** — suppliers stay behind the brand and are never shown to buyers.
Browsing and checkout are **frictionless**: no signup wall, no password.
Identity is captured only at the final step via passwordless OTP/magic link.

## Stack

- **Next.js 14** (App Router, TypeScript, SSR storefront)
- **Tailwind CSS** (hand-built components, design tokens in `tailwind.config.ts`)
- **Supabase** — Postgres + Row-Level Security + passwordless Auth (OTP/magic link)
- **lucide-react** icons · **Fraunces** (display) + **Inter** (body) fonts
- Cart is **client-side only** (`localStorage`) until an order is placed.

## Run locally

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env.local
#   fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#   and SUPABASE_SERVICE_ROLE_KEY (server-only)

# 3. Apply the database migrations (schema, RLS, view, FTS, trigram, admin)
#    Option A — Supabase CLI against your project:
supabase db push        # applies everything in supabase/migrations/
#    Option B — paste each file in supabase/migrations/ into the SQL editor, in
#    order: 0001_init, 0002_admin, 0003_banners, 0004_merchant_portal, 0005_quotes.

# 4. Seed ~8 products / 3 suppliers / bulk tiers
npm run seed

# 5. Allowlist yourself as admin staff (contact must match your OTP login)
npm run staff:add -- you@email.com "Your Name" admin

# 6. Develop
npm run dev             # storefront http://localhost:3000 · admin /admin
```

### Demo mode (no backend)

With no Supabase keys set, the storefront auto-renders bundled sample data so
you can see the look immediately. Force it anytime with
`NEXT_PUBLIC_DEMO_MODE=true`. (Checkout/admin need a real Supabase project.)

### Hero banner

The homepage banner uses a built-in animated graphic by default. To use your
own GIF/video: drop a file in `/public` and set `NEXT_PUBLIC_BANNER_URL=/file.gif`
(or `/file.mp4`). In-app banner upload lives in the admin (Supabase Storage).

## Admin panel (`/admin`)

Passwordless OTP login gated by a **staff allowlist** (`staff` table). Add staff
with `npm run staff:add`. Modules:

- **Dashboard** — product / order / pending-merchant / out-of-stock counts.
- **Products** — full CRUD, provenance, bulk tiers, image + batch-photo upload
  to Supabase Storage (`product-media` bucket).
- **Orders** — list, detail, advance status (placed → … → delivered / refunded).
- **Merchants** — approve/reject supplier applications; approval creates a
  verified `suppliers` row (kept behind the brand). Public intake form lives at
  `/become-a-supplier`.
- **Billboard** — upload GIF / image / short looping video into the homepage
  hero; multiple active banners rotate. Optional link + CTA turns a banner into
  an ad. Falls back to env media, then the built-in animated graphic. Needs
  migration `0003_banners.sql`.

All admin mutations are **server actions that re-verify staff** before writing
(service-role client), and the upload route is staff-gated — the UI is never the
only line of defense.

## Merchant self-service portal (`/merchant`)

Approved suppliers log in (passwordless OTP, matched on the `contact` set when an
admin approves their application) and submit their own products. Submissions are
inserted as `approval_status = 'pending'` and **stay hidden from buyers** (the
`public_products` view filters to approved) until an admin approves them under
Admin → Products → "Awaiting approval". Needs migration `0004_merchant_portal.sql`.

- Merchant flow: apply at `/become-a-supplier` → admin approves → log in at
  `/merchant` → submit products → admin approves → product goes live.
- Every merchant action re-verifies the supplier and is scoped to their own
  `supplier_id` (a merchant can never see or edit another supplier's data).

## Quote / sourcing requests

Buyers can request a **bulk quote on a listed product** or ask us to **source a
product** not yet listed, with their contact details — at `/request-quote`
(also launched pre-filled from each product page, and linked in the header menu,
footer, and cart). Submissions land in **Admin → Quotes** with a status workflow
(`new → reviewing → quoted → closed`). Needs migration `0005_quotes.sql`.

The header has a **top-left dropdown menu** linking to Request a quote, Become a
supplier, Supplier login, and Admin.

### Dev bypass (no email needed)

Free-tier Supabase email is rate-limited, so for local work:
- Admin: set `ADMIN_DEV_BYPASS=true` in `.env` → open `/admin` directly.
- Merchant: set `MERCHANT_DEV_BYPASS=<supplier contact email>` in `.env` → open
  `/merchant` as that verified supplier.

Both are hard-gated to `NODE_ENV !== 'production'`. **Remove before deploying.**
Restart `npm run dev` after changing `.env`.

### Supabase Auth setup

In **Authentication → Providers**, enable **Email** (and optionally **Phone**)
with OTP. Email OTP works out of the box on a fresh project. Phone OTP needs an
SMS provider configured in Supabase.

## Project layout

```
supabase/migrations/0001_init.sql   Schema + RLS + public_products view + FTS
scripts/seed.ts                     Seed data (npm run seed)
src/lib/
  format.ts        formatPrice() — the SINGLE money-formatting indirection (§4b)
  i18n.ts          localized() — reads *_i18n with base-column fallback (§4b)
  pricing.ts       resolveUnitPrice() — retail + bulk tier rule (§4)
  cart.tsx         client cart context (localStorage)
  products.ts      buyer-safe product reads + FTS search
  supabase/        client (browser) · server (SSR) · admin (service role)
src/components/    Header, SearchBar, CategoryChips, ProductCard/Grid,
                   ProvenanceBlock, PriceTierTable, AddToCartPanel, CartView,
                   CheckoutForm, OtpInput, WhyUsToggle
src/app/           / · /product/[slug] · /cart · /checkout · /order/[id]
                   api/search/route.ts  (FTS endpoint)
                   checkout/actions.ts  (server order placement)
```

## Key behaviours (where the spec lives in code)

| Requirement | Where |
|---|---|
| Supplier identity never leaks | `public_products` view (migration) + `src/lib/products.ts` read only buyer-safe columns |
| Real full-text search + typo fallback | `search_products()` RPC (migration) ← `/api/search` ← `Storefront.tsx` |
| Synonyms (groundnut→peanut, zobo→hibiscus) | `synonyms[]` column fed into `search_tsv` trigger; seeded per product |
| Retail + bulk pricing | `product_price_tiers` + `resolveUnitPrice()` (client display **and** server placement) |
| Server-resolved pricing on order | `src/app/checkout/actions.ts` — re-resolves from DB, ignores client prices |
| Passwordless, no password field | `CheckoutForm.tsx` (OTP) + Supabase Auth |
| Silent buyer account | `placeOrder()` upserts `buyers` on `contact` |
| One money formatter | `formatPrice()` — no hardcoded `$`/USD in components |
| i18n-ready text | `localized()` reads `*_i18n`, base-only this phase |
| Provenance / trust-by-evidence | `ProvenanceBlock.tsx` |
| Reduced motion + keyboard focus | `globals.css` |

## Where the payment integration goes

Payment is **stubbed** in Phase 1. The integration point is marked in
[`src/app/checkout/actions.ts`](src/app/checkout/actions.ts):

```ts
// TODO: payment — Stripe (global) + Paystack (Africa). Charge here BEFORE
//       writing the order; on success set status accordingly.
```

The order is currently written with status `placed` immediately on "Pay".

## Out of scope (Phase 1)

Supplier dashboard/onboarding/KYC, admin panel, live payment capture, FX /
multi-currency, shipping-rate calc, reviews/ratings/wishlists. Tables for
suppliers exist and are seeded manually; their management UIs are not built.

### Phase-1 decisions that touch later phases

- **USD only.** All prices stored in USD; `formatPrice()` is the one place FX +
  locale formatting drops in later — no component refactor needed.
- **i18n columns shipped empty.** `*_i18n` JSONB exists now so localization is a
  data change, not a migration.
- **Pricing resolved server-side** already, so adding real payment only needs the
  charge call before the order insert — the trusted total is already computed.
