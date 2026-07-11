# GlobalSource Africa v2 — Build Plan

Working doc for the v1 → v2 rebuild (marketplace → sourcing & verification service).
Source of truth for scope is [`globalsource-africa-v2-prd.md`](../globalsource-africa-v2-prd.md).

## Decisions locked (this session)

- **Build location:** `v2` git branch. `main` (v1 marketplace) stays live until we swap.
- **Database:** new v2 schema **in the existing Supabase project** (v1 tables remain until we drop them).
- **Hero tech:** react-three-fiber 3D on desktop + static WebP on mobile / reduced-motion.

## Copy decisions (resolved this session)

- **Lead origin:** **Ghana** (placeholder — owner hasn't committed to Egypt yet), grounded in
  real regions from v1: Ashanti (cocoa), Northern (shea), Bono (cashew). **Egypt listed as a
  "next" expansion origin.** ⚠️ PRD is Egypt-first; we swap the lead to Ghana throughout copy
  until the owner confirms. Entity/footer line = clearly-marked **Ghana placeholder**.
- **Founder:** real name + photo — **Isreal Kingsley** + existing repo CEO photo.
- **Fees:** **USD only.**

## Decisions still open (Phase 3)

- 3D asset source — rebrand a CC0 container GLB vs AI-generated livery texture.

## Stack additions

`gsap` + ScrollTrigger · `lenis` (smooth scroll) · `three` + `@react-three/fiber` + `@react-three/drei` · `zod` (intake validation). `@types/three` dev.

## Design tokens (replace v1 palette)

| Token | Hex | Tailwind key |
|---|---|---|
| ocean-navy | `#0B2239` | `navy` |
| container-orange | `#E8622C` | `container` |
| manifest-paper | `#F6F4EF` | `paper` |
| steel | `#6B7683` | `steel` |
| cleared-green | `#1E7A4F` | `cleared` |

Fonts: **Archivo Expanded** (display) · **Inter** (body) · **IBM Plex Mono** (labels/data).

---

## Phase 0 — Setup (non-destructive)

- [ ] Create `v2` branch ✅
- [ ] Install stack deps
- [ ] Add v2 design tokens to `tailwind.config.ts` (keep v1 tokens during transition)
- [ ] Wire fonts in `layout.tsx` (Archivo Expanded / Inter / IBM Plex Mono)
- [ ] `ReducedMotionGate` + `MonoLabel` primitives
- [ ] Corrugation divider + "stamp" utility CSS in `globals.css`

## Phase 1 — Foundation (repurpose)

- [ ] Remove v1 marketplace routes/components: `product/`, `cart/`, `checkout/`, `order/`, `raw-materials/`, `become-a-supplier/`, `merchant/`, storefront/cart/product components, banners, testimonials(+tracking) — quarantine, don't delete history
- [ ] Trim admin to what v2 needs (inquiries queue; drop products/orders/merchants)
- [ ] New `navy` nav (Services · How It Works · Origins · Resources · About + `Request Sourcing` CTA + `Verify a Supplier` link)
- [ ] New static footer (contact channels, entity line, mono container-plate easter egg)
- [ ] New home shell with **static hero image** placeholder
- [ ] Deploy skeleton to Vercel preview (branch deploy)

## Phase 2 — Static complete site (launchable)

- [ ] Home sections 2–8 (problem strip, services grid, sample-report teaser, Egypt origins, who's-on-the-ground, resources teaser, CTA band static)
- [ ] `/services` + 4 templates (verification/discovery/inspection/sourcing) with **published pricing**, scope, deliverable, timeline, FAQ, StampBox
- [ ] `/origins` + `/origins/egypt`
- [ ] `/sample-report` — redacted report viewer + email-gated PDF (`leads` insert)
- [ ] `/request` — multi-step intake (zod), dynamic fields per service, honeypot + rate limit → `inquiries` insert → founder email + buyer auto-ack
- [ ] `/about`, `/contact`, `/legal/*`
- [ ] `/resources` + `/resources/[slug]` + 5 launch articles
- [ ] Supabase migration: `inquiries`, `leads`, internal `suppliers` (service-role only RLS)
- [ ] Email delivery (Resend or Supabase → decide) for notifications

## Phase 3 — Motion pass (each ships independently)

- [ ] 4.2 Crane + scroll-scrubbed truck (`CraneSection`) — cheapest win first
- [ ] 4.3 Footer container landing (`LandingCTA`)
- [ ] 4.1 Hero 3D container (`ContainerHero3D`) + mobile static — biggest lift last
- [ ] Lenis smooth scroll (desktop only)

## Phase 4 — Polish

- [ ] Lighthouse: mobile Perf ≥ 85, LCP < 2.5s (3D excluded on mobile)
- [ ] Per-page container-themed OG images
- [ ] Analytics (Plausible or GA4)
- [ ] WhatsApp click-to-chat, favicon/manifest refresh

## Acceptance criteria (from PRD §10)

Zero marketplace patterns · 10-second clarity · hero rotates ~360° desktop / static mobile ·
scrubbed truck + landing · intake end-to-end with emails · email-gated sample PDF ·
mobile Lighthouse ≥85 · pricing on every service page · 5 articles at launch.
