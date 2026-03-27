# UI Rework Design — Dark Luxury Conversion
**Date:** 2026-03-27
**Project:** Ourrika Experiences
**Type:** Conversion-focused full-funnel redesign
**Skills:** `ui-ux-pro-max`, `tailwind-design-system`, `frontend-excellence`

---

## Goal

Redesign the full booking funnel with a dark luxury aesthetic and stronger conversion signals. Every page in the funnel gets the new palette and conversion improvements simultaneously, shipped page by page.

---

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Aesthetic | Dark luxury (B) | Deep blacks, terracotta dominant, gold accents — signals premium |
| Scope | Full funnel (D) | Every stage needs improvement |
| Primary gap | Stronger CTAs & urgency (C) | Visitors don't have a clear next step at every scroll position |
| Approach | Page-by-page, conversion first (B) | Ships visible progress after each page, consistent aesthetic from start |

---

## 1. Design Tokens

One file change (`globals.css`) propagates across all components.

### New palette

| Token | Value | Role |
|---|---|---|
| `--color-obsidian` | `#0A0A0A` | Page background (new) |
| `--color-surface` | `#1A1A1A` | Cards, panels, sidebars |
| `--color-sand-light` | `#F5EFE4` | Primary text (flipped from background) |
| `--color-terracotta` | `#C56B5C` | Primary CTA, urgency badges, accents (unchanged) |
| `--color-gold` | `#C9A96E` | Price display, section dividers, featured borders, numbers |
| `--color-charcoal-light` | `#9d9d9b` | Muted text, metadata |
| Border subtle | `rgba(255,255,255,0.06)` | Card borders on dark surfaces |
| Border gold | `rgba(201,169,110,0.2)` | Premium separators, booking card border |

### Rules
- No hardcoded hex values in components — all colours via CSS variables
- `--color-gold` is display-only (prices, numbers, dividers) — never used for interactive elements
- Navbar gets `border-bottom: 1px solid rgba(201,169,110,0.15)` on dark background

---

## 2. Homepage

### Hero
- Full-viewport dark background (`--color-obsidian`) with atmospheric image/video behind gradient overlay
- Eyebrow: `Morocco · Curated Experiences` in gold, uppercase, tracked
- Headline: `"Feel Morocco. Don't just visit it."` — italic serif, large, sand coloured
- Subline: short descriptor in muted sand
- Two CTAs side by side: `Explore Experiences` (terracotta filled) + `Book on WhatsApp` (gold outline)
- Trust micro-copy beneath CTAs: `⭐ 4.9 · 120+ guests` and `💬 Reply in 2hrs` — muted, small

### Trust Band (new section between hero and cards)
- Dark surface (`--color-surface`), gold top/bottom border
- Three stats side by side: `120+ Guests hosted` · `4.9 ★ Average rating` · `< 2hrs WhatsApp reply time`
- Numbers in gold serif, labels in muted uppercase sans-serif
- **Only include stats that reflect real data**

### Featured Experience Cards
- Dark card (`--color-surface`), subtle border
- Image area at top with location + duration at bottom-left
- Urgency badge top-right where applicable: `"2 spots left"` — terracotta pill
- Gold border + `"Featured"` gold badge for highlighted experiences
- Price in gold serif, visible on card without clicking in
- `"Book Now"` terracotta CTA on every card
- Section header: gold divider line + italic serif heading + `"View all →"` terracotta link

---

## 3. Activity Detail Page

### Booking Card (sticky right column)
- Dark surface, gold border `rgba(201,169,110,0.2)`
- **Urgency bar at top**: `"⚡ High demand — reply within 2hrs"` — full-width terracotta strip
- Gold divider line
- `"Starting from"` label in muted uppercase
- Price in gold serif (large)
- Meta list: location, duration, rating — terracotta icons, muted text
- **Primary CTA**: `"💬 Book on WhatsApp"` — full-width terracotta filled (was secondary)
- **Secondary CTA**: `"Request Availability"` — ghost button with subtle border (was primary)
- Trust note below: `"No payment now · We confirm availability before any commitment"` — muted, small

### Content Column
- Dark background throughout
- Pull-quote: left terracotta border, italic serif, sand text
- Body text: muted sand, generous line height
- Section headings: gold divider + italic serif (What's included, Gallery)
- Highlights checklist: terracotta tick marks

---

## 4. Activities Listing (`/experiences`)

### Page Header
- Gold divider line
- Heading: `"Ourrika Experience"` — italic serif, sand
- Subheading: `"Crafted journeys for discerning travellers"` — muted uppercase

### Filter Bar
- Active filter: terracotta filled
- Inactive filters: subtle border, muted text
- Filter options: All · Desert · City · Mountains · Under 100€

### Cards
- Same dark card treatment as homepage featured cards
- 3-column grid on desktop
- Price in gold, visible on card
- `"Book Now"` terracotta CTA on every card — navigates to detail page (not modal), consistent with current behaviour
- `"High demand"` badge on featured cards only (static, no dynamic spot count)
- Gold border + `"Featured"` badge for highlighted items

---

## 5. Destinations (`/destinations`)

### Distinction from Experiences
Destinations are discovery pages, not booking pages. Different CTA intent.

- **No price on destination cards** — price lives on experience cards
- First destination spans full width as a hero card
- `"X experiences available"` shown instead of price
- CTA: gold outline `"Explore →"` (softer intent than terracotta "Book Now")
- Destination name + region label overlaid on image at bottom-left

### Layout
- 2-column grid: first card spans full width (hero), remaining cards are equal 1-1
- Dark card treatment consistent with rest of site

---

## Conversion Signals — Rules

| Signal | Pages | Notes |
|---|---|---|
| Urgency badge | Cards (featured only), detail booking card urgency bar | No `spots_left` field in Firestore — use static `"High demand"` badge on featured cards only. Do not show dynamic spot counts. |
| `"High demand — reply within 2hrs"` | Detail booking card urgency bar | Static copy, always shown |
| Trust band stats | Homepage | Must reflect real numbers — update before launch |
| `"No payment now"` note | Booking card, modal | Always shown |
| WhatsApp as primary CTA | Detail page, mobile sticky bar | Terracotta filled, full width |

---

## Implementation Order

| Step | Page/Component | Files |
|---|---|---|
| 1 | Design tokens | `src/app/globals.css` |
| 2 | Navbar | `src/components/layout/Navbar.tsx` |
| 3 | Homepage | `src/app/page.tsx`, homepage section components |
| 4 | Activity detail | `src/app/(public)/experiences/[slug]/page.tsx`, `DetailPageBlocks.tsx`, `ExperienceBookingClient.tsx` |
| 5 | Activities listing | `src/app/(public)/experiences/page.tsx`, `ListingClients.tsx` |
| 6 | Destinations listing | `src/app/(public)/destinations/page.tsx`, `ListingClients.tsx` |
| 7 | Destination detail | `src/app/(public)/destinations/[slug]/page.tsx` |
| 8 | Footer | `src/components/layout/Footer.tsx` |
| 9 | Shared components | `BookingModal.tsx`, `PageHero.tsx`, `WhatsAppButton.tsx` |

---

## Out of Scope

- Journal/blog page redesign (low conversion impact, do after launch)
- About, Privacy, Terms pages (informational, low priority)
- Animation changes (Framer Motion stays as-is)
- Mobile sticky bar logic (already works, just gets new colours)
- New features (filters are UI-only client-side, no backend changes)

---

## Success Criteria

- [ ] All pages use `--color-obsidian` as background
- [ ] No hardcoded hex values remain in redesigned components
- [ ] `--color-gold` token added and used for prices and dividers
- [ ] WhatsApp is the primary CTA on the detail page booking card
- [ ] Urgency bar present on booking card
- [ ] "Book Now" CTA visible on every experience card without clicking in
- [ ] Trust band present on homepage with real data
- [ ] "Ourrika Experience" heading on listing page
- [ ] Production build passes with no errors
- [ ] No group size claims anywhere in the UI
