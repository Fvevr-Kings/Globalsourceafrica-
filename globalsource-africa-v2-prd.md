# PRD — GlobalSource Africa v2
## From Marketplace to Sourcing & Verification Service

**Version:** 2.0 (full repurpose of existing site)
**Stack:** Next.js 14+ (App Router) · Tailwind CSS · Supabase · Vercel
**Animation stack:** GSAP + ScrollTrigger · Lenis smooth scroll · react-three-fiber (hero 3D)
**Prepared for:** Claude Code build session

---

## 1. What This Is and Why We're Rebuilding

The current site is structured like a product marketplace. That was wrong for the business. GlobalSource Africa (GSA) is a **sourcing and verification service**: international buyers pay us to find, verify, inspect, and manage suppliers in Africa. We never hold inventory. We sell trust and ground presence.

The new site has one job: make a foreign buyer (Gulf, EU, US importer) believe within 10 seconds that GSA is their professional eyes and hands in Africa — and get them to submit a verification or sourcing request.

**Everything "shop-shaped" dies in this rebuild:**
- ❌ Product listings with prices
- ❌ Category pages implying inventory
- ❌ Any cart/checkout pattern
- ❌ Public supplier directory (verified suppliers are now the *paid* asset — we prove we have them, we never show who they are for free)

**What survives from v1 (repurposed, not rebuilt):**
- Domain, hosting, Vercel/Namecheap DNS setup
- The RFQ concept — reframed as service intake forms
- Supabase project (new schema, see §8)
- Brand name and logo

---

## 2. Positioning & Voice

**One-liner (hero):** "Your verification and sourcing partner on the ground in Africa."

**Voice rules:**
- Write like a professional trade services firm, not a startup. No "revolutionizing," no "empowering."
- Specific beats sweeping: "We verify Egyptian herb exporters in Fayoum" beats "We connect the world to Africa."
- Every claim must be checkable: name the inspection partners (SGS, Cotecna), name the documents (CAC/commercial register, export license, Bill of Lading), name the regions.
- Egypt-first in copy and examples. The pan-African name is the umbrella; the proof is Egyptian.

---

## 3. Design Direction

### 3.1 The feeling
The site must **scream export at first glance** — containers, cranes, ports, freight — while the message stays clean and service-focused. Reference mood: the three provided images (Alpha Logistics poster, LogiCart landing, Bankar landing). Industrial confidence, not corporate blandness.

### 3.2 Design tokens

**Palette (5 named values):**

| Token | Hex | Use |
|---|---|---|
| `ocean-navy` | `#0B2239` | Primary background for dark sections, footer, nav |
| `container-orange` | `#E8622C` | Primary accent — CTAs, highlights, the hero container livery |
| `manifest-paper` | `#F6F4EF` | Light section backgrounds (like shipping manifest paper) |
| `steel` | `#6B7683` | Secondary text, borders, corrugation lines |
| `cleared-green` | `#1E7A4F` | Verification badges, success states only ("customs cleared" green) |

**Typography:**
- **Display:** `Archivo Expanded` (or `Saira SemiCondensed` bold caps for stencil-adjacent industrial feel) — headlines only, tight tracking, uppercase for section eyebrows
- **Body:** `Inter` — all reading text
- **Utility/mono:** `IBM Plex Mono` — container numbers, form labels, data, the "manifest" details. This mono face is a signature: labels styled like shipping documents (e.g., `REQ-2026-0147 · VERIFICATION`)

**Texture details (used sparingly):**
- Subtle vertical corrugation lines (like container walls) as section dividers — CSS repeating-linear-gradient, 1px steel at low opacity
- "Stamp" treatment on verification-related elements: `cleared-green` border, slight rotation (-2°), mono type — like a customs stamp
- Container ID plates as decorative micro-elements: `GSAU 402 918 · 45G1` in mono

### 3.3 The three signature animations

Motion budget is spent on exactly **three orchestrated moments** (top, middle, bottom). Everything else stays quiet — standard fade/rise reveals at most. All three respect `prefers-reduced-motion` (fall back to static images).

---

## 4. Animation Specs (the core of this build)

### 4.1 HERO — "The Spinning Container" (Bankar-inspired)

**Concept:** A 3D shipping container in GSA livery (`ocean-navy` body, `container-orange` GSA logo panel) sits tilted at ~25° isometric angle, floating right-of-center behind/beside the hero headline. As the user scrolls down, the container **rotates on its Y axis (and slightly on X) while translating upward and scaling down**, completing roughly a full revolution before exiting the top of the viewport as the second section arrives.

**Technical approach — decision required, two options:**

**Option A — react-three-fiber (real 3D) [RECOMMENDED]**
- Load a low-poly container GLB (~2k–8k triangles, one 2048px baked texture with GSA branding). Free base models exist on Sketchfab/Poly Haven (CC0 shipping container); rebrand texture in Blender or via AI-generated texture map.
- `<Canvas>` fixed-position layer behind hero content, `frameloop="demand"` + drive rotation from scroll progress (GSAP ScrollTrigger `onUpdate` → set `mesh.rotation.y = progress * Math.PI * 2`).
- Lighting: one directional key light + soft ambient; `Environment preset="city"` at low intensity for metallic reflections on corrugation.
- Pros: real parallax/lighting, buttery on desktop, genuinely premium. Cons: ~150KB lib + model payload; needs mobile fallback.

**Option B — Pre-rendered image sequence scroll-scrub (Apple-style)**
- Render 60–90 frames of the container rotating in Blender → export as WebP sequence (~30–60KB/frame) → canvas scrubbing tied to scroll progress.
- Pros: pixel-perfect cinematic lighting, zero 3D runtime. Cons: heavier total payload, fixed camera, harder to iterate on branding.

**Recommendation:** Option A on desktop, with a **static hero render (single WebP) on mobile/reduced-motion** — mobile gets a beautifully lit still of the tilted container, no 3D canvas. This keeps Lighthouse mobile scores intact.

**Scroll choreography (desktop):**
```
scroll 0%   → container at rest: rotY 15°, tilt 25°, scale 1.0, y 0
scroll 25%  → rotY 105°, scale 0.95, y -10vh
scroll 50%  → rotY 200°, scale 0.85, y -30vh
scroll 75%  → rotY 300°, scale 0.7, y -55vh
scroll 100% → rotY 375°, scale 0.55, y -110vh (fully exited top)
```
- ScrollTrigger: `trigger: heroSection, start: "top top", end: "bottom top", scrub: 0.8`
- Hero text does NOT move with the container (text scrolls normally; container is the fixed-layer actor). Slight ease (`scrub: 0.8`) gives weight — a 30-tonne object shouldn't feel like paper.

**Hero content layout:**
```
┌──────────────────────────────────────────────┐
│ NAV: logo · Services · How It Works ·        │
│      Origins · Resources · [Request Sourcing]│
│                                              │
│  EYEBROW (mono): ON-GROUND SINCE 2026 · EGYPT│
│  H1: Your verification and                   │
│      sourcing partner            [ 3D        │
│      on the ground in Africa      CONTAINER  │
│                                   tilted,    │
│  Sub: We help international       floating ] │
│  buyers find, verify and buy                 │
│  from African suppliers safely —             │
│  before you send a single dollar.            │
│                                              │
│  [Verify a Supplier]  [Request Sourcing]     │
│                                              │
│  mono strip: SGS-COORDINATED · CAIRO/FAYOUM  │
│  ON-GROUND · 48H RESPONSE · FLAT-FEE REPORTS │
└──────────────────────────────────────────────┘
```

### 4.2 MID-PAGE — "How It Works" crane + moving truck (LogiCart-inspired)

**Concept:** The How It Works section uses a **crane-suspended container** as the visual anchor. As the section scrolls into view, the container (SVG/PNG illustration, not 3D) **lowers on its cables** by ~40px with a subtle sway (±1.5° rotation, slow sine). The 5 process steps reveal sequentially, connected by a dotted path (like the LogiCart reference). Below it, a **truck drives across the section** — enters from left at ~30% section visibility, travels to center, wheels rotating, and parks; its trailer carries a container labeled with the GSA mark.

**Technical approach:**
- Pure GSAP ScrollTrigger timelines on layered SVG/WebP assets. No 3D needed here.
- Crane container: `y: -40 → 0` scrubbed over section entry, plus an infinite low-amplitude sway tween (`rotation: -1.5 ↔ 1.5, duration: 3.5s, sine.inOut, transformOrigin: "top center"`) that runs while in viewport (pause offscreen via ScrollTrigger `onToggle` for perf).
- Truck: single ScrollTrigger timeline, `x: -120% → 0` (parked position), wheels are separate SVG groups rotating proportionally to x-distance. `scrub: 1` so the user "drives" the truck by scrolling — this is the delight moment.
- Steps 01–05: staggered reveal (`opacity 0→1, y: 24→0`), each triggered at its own scroll position so reading pace matches motion. Numbered markers are justified here — this content is a true sequence.

**The 5 steps (final copy):**
1. **Submit your request** — Tell us the product, quantity, destination and specs, or name a supplier you want checked.
2. **We scope and quote our fee** — Flat fee confirmed upfront. You know the cost before anything starts.
3. **Ground work begins** — Registry checks, license verification, physical or video audit, reference calls.
4. **Inspection coordinated** — SGS or equivalent at sampling and loading. You never ship blind.
5. **You receive the report / verified deal** — A decision-ready document, or a supplier you can transact with confidently.

### 4.3 FOOTER — "The Landing" container onto trailer (Alpha-inspired)

**Concept:** Above the footer, a full-width dark (`ocean-navy`) CTA band. A flatbed trailer waits at the bottom of the scene. As the user scrolls to the end of the page, a container **descends slowly from above on crane cables and settles onto the trailer** — touching down exactly as the final CTA text finishes revealing. Message: *"the deal, delivered."* Container side reads the closing line.

**Technical approach:**
- GSAP ScrollTrigger scrub tied to the last viewport of scroll: `trigger: ctaBand, start: "top bottom", end: "top 20%", scrub: 1.2`.
- Container: `y: -55vh → 0` with a **decelerating custom ease** (fast descent early, slow final 15% — real crane operators feather the landing). At contact: 4px settle bounce (`y: +4 → 0, duration 0.35s, power2.out`) triggered once via `onComplete` threshold, plus the trailer suspension dips 3px.
- Cables: two SVG lines drawn from top edge to container corners, length driven by same progress; they slacken (opacity fade + slight curve) after touchdown.
- Copy reveal syncs to descent: headline "Ready to source from Africa without the risk?" completes at ~80% progress; CTA buttons fade in at touchdown.

**CTA band content:**
- H2: *Ready to source from Africa without the risk?*
- Buttons: **[Verify a Supplier — from $400]** · **[Talk to a Sourcing Specialist]**
- Mono microcopy under buttons: `RESPONSE WITHIN 48 HOURS · CAIRO, EGYPT (GMT+2)`

### 4.4 Global motion rules
- Lenis smooth scroll (desktop only; native scroll on touch devices).
- All three set pieces disabled under `prefers-reduced-motion` → static composed images.
- Nothing else on the page moves beyond 250ms fade/rise reveals (`opacity`, `y: 16`).
- Perf budget: LCP < 2.5s mobile, total JS < 300KB gzipped on mobile route (3D excluded on mobile), all animation on `transform`/`opacity` only (compositor-friendly), `will-change` applied surgically and removed after.

---

## 5. Sitemap

```
/                      Home (the animated flagship page)
/services              Service menu overview
/services/verification Supplier Verification Report ($ from 400)
/services/discovery    Supplier Discovery (from $600)
/services/inspection   Inspection Coordination (from $300 + inspector cost)
/services/sourcing     Full Sourcing Management (3–7% or retainer)
/how-it-works          Expanded process page (reuses mid-page motif, static)
/origins               Origins overview
/origins/egypt         Egypt: what we verify, regions, product families
/sample-report         Redacted example verification report (inline viewer + PDF)
/resources             Articles index (SEO engine)
/resources/[slug]      Article template
/about                 Who is on the ground, where. Faces, locations, entity info
/contact               Email, WhatsApp, office, LinkedIn, hours
/request               Universal intake form (service selector → dynamic fields)
/legal/*               Terms, privacy
```

**Nav (desktop):** Services · How It Works · Origins · Resources · About — plus persistent `container-orange` button **Request Sourcing**. Secondary text link in nav: *Verify a Supplier*.

---

## 6. Page-by-Page Requirements

### 6.1 Home
Section order:
1. **Hero** (§4.1) — headline, sub, dual CTA, trust strip
2. **The problem strip** (`manifest-paper`) — 3 short columns: *Fake exporters. Photoshopped documents. Shipments that never load.* One line each on how buyers get burned; ends with "This is why we exist." No icons-with-fluff — real failure modes.
3. **Services grid** — 4 cards (Verification / Discovery / Inspection / Full Sourcing), each with: what you get, timeline, `from $X`, mono reference code (e.g. `SVC-01 · VERIFICATION`). Card CTA: "See scope →"
4. **How It Works** (§4.2 animated set piece)
5. **Sample report teaser** — split layout: left, 3 redacted report pages fanned; right, "See exactly what you get before you pay." CTA → /sample-report. *(This section closes clients — make it prominent.)*
6. **Origins: Egypt first** — dark section. Map silhouette of Egypt with pinned regions (Fayoum — herbs & botanicals · Nile Delta — crops · Cairo — processing/export). Copy: why Egypt is Africa's lowest-friction origin. "More origins as clients demand them — Ghana and Kenya next." Honesty as positioning.
7. **Who's on the ground** — founder photo, name, location, one paragraph. Trust businesses can't be anonymous.
8. **Resources teaser** — 3 latest articles.
9. **CTA band + footer landing animation** (§4.3)
10. **Footer** — contact channels (email, WhatsApp click-to-chat, LinkedIn), entity/registration info, mono container plate easter egg.

### 6.2 Service pages (template ×4)
Each: plain-English scope · deliverable (what document/outcome you receive) · timeline · price (published — hiding fees reads broker, showing fees reads professional firm) · what we need from you · FAQ (3–5) · intake CTA. Include one "stamp"-styled box: *What this protects you from* (e.g., for Verification: "paying a deposit to a company that doesn't exist").

### 6.3 /sample-report
The single highest-converting page. Embedded viewer (or image pages) of a **fully redacted but real-format** verification report: cover with report ID in mono, company registry findings, license checks, site visit photos section, reference summary, risk rating, recommendation. Download-as-PDF gated by email (lead capture — Supabase `leads` table).

### 6.4 /request (universal intake)
Step-form (no login):
1. Service type (4 options + "not sure")
2. Dynamic fields:
   - Verification → supplier name, country, website/contact, what they've told you, deal size
   - Discovery/Sourcing → product, quantity, destination country, quality specs, timeline, target price (optional)
   - Inspection → shipment details, location, dates
3. Buyer details: company, country, email (business email nudge), WhatsApp (optional)
4. Confirmation screen: `Request received · REF: GSA-2026-XXXX · We reply within 48 hours.`
- Writes to Supabase, email notification to founder + you, auto-acknowledgment email to buyer.
- Honeypot + rate limit for spam.

### 6.5 /resources
SEO engine. Launch with 5 articles (write during build): *How to verify an African supplier before paying a deposit* · *Why shipments from Africa get rejected in the EU (and how to prevent it)* · *Egypt export documentation: what buyers should ask for* · *Hibiscus sourcing guide: Egypt vs Nigeria vs Sudan* · *Letter of Credit basics for first-time Africa buyers*. Every article proves why GSA exists.

---

## 7. Components Inventory

- `ContainerHero3D` (r3f canvas + scroll driver + mobile static fallback)
- `CraneSection` (SVG crane/container + step stagger + truck timeline)
- `LandingCTA` (descent scene + footer)
- `ServiceCard`, `StampBox`, `MonoLabel`, `TrustStrip`
- `IntakeForm` (multi-step, zod validation, Supabase insert)
- `ReportViewer` (sample report pages)
- `ArticleLayout`, `OriginMap`
- `ReducedMotionGate` (wraps all three set pieces)

---

## 8. Supabase Schema (new)

```sql
-- service inquiries from /request
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,            -- GSA-2026-0001
  service_type text not null,          -- verification|discovery|inspection|sourcing|unsure
  payload jsonb not null,              -- dynamic fields
  company text, country text,
  email text not null, whatsapp text,
  status text default 'new',           -- new|scoped|quoted|active|delivered|closed
  created_at timestamptz default now()
);

-- gated sample-report downloads
create table leads (
  id uuid primary key default gen_random_uuid(),
  email text not null, source text default 'sample_report',
  created_at timestamptz default now()
);

-- internal supplier directory (NEVER exposed via public API)
create table suppliers (
  id uuid primary key default gen_random_uuid(),
  country text, region text, products text[],
  company_name text, verification_status text,  -- pending|verified|failed
  audit_notes jsonb, docs jsonb,
  last_verified_at timestamptz,
  created_at timestamptz default now()
);
-- RLS: suppliers table = service-role only. No anon access under any policy.
```

---

## 9. Build Plan (phased for Claude Code)

**Phase 1 — Foundation (repurpose):** Strip old marketplace pages/routes. New layout, tokens, typography, nav/footer (static footer first). Deploy skeleton to Vercel.

**Phase 2 — Static complete site:** All pages, all copy, intake form wired to Supabase, sample report page, 5 articles. *Site is launchable at end of Phase 2 with static hero image.* This is deliberate — buyers can arrive before animations exist.

**Phase 3 — Motion pass:** 4.2 crane/truck (cheapest win first) → 4.3 footer landing → 4.1 hero 3D (biggest lift last). Each ships independently.

**Phase 4 — Polish:** Lighthouse pass, OG images (container-themed per page), analytics (Plausible or GA4), WhatsApp click-to-chat, favicon/manifest.

---

## 10. Acceptance Criteria

- [ ] Zero marketplace patterns remain (no product prices, no cart semantics, no public supplier names)
- [ ] A first-time visitor can state what GSA does within 10 seconds (test with 3 people)
- [ ] Hero container rotates ~360° across hero scroll on desktop; mobile shows static render; reduced-motion respected on all three set pieces
- [ ] Truck drive and container landing are scroll-scrubbed (user controls them), not autoplay
- [ ] Intake form → Supabase insert → founder email notification → buyer auto-ack, end to end
- [ ] Sample report page live with email-gated PDF
- [ ] Mobile Lighthouse: Performance ≥ 85, LCP < 2.5s
- [ ] Published pricing visible on every service page
- [ ] 5 resource articles live at launch

---

## 11. Open Decisions (answer before Phase 3)

1. **Hero tech:** Option A (r3f 3D) vs Option B (image sequence)? → PRD recommends A + mobile static.
2. **3D asset source:** rebrand a CC0 GLB in Blender, or commission/generate the texture? (David can generate the livery texture with AI image tools he already uses.)
3. **Entity line in footer:** Egypt entity, UK/US LLC, or both? Affects trust copy and payment rails (Stripe/Wise for collecting fees).
4. **Founder visibility:** real name + photo on /about (recommended) or brand-only?
5. **Currency of published fees:** USD only (recommended) or USD + EGP?
