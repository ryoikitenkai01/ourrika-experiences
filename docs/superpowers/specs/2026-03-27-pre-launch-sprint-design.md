# Pre-Launch Sprint Design
**Date:** 2026-03-27
**Project:** Ourrika Experiences
**Stage:** Pre-launch (no live users)
**Timeline:** This week
**Skills:** `firebase`, `security-hardening`, `analytics-tracking`, `ai-seo`

---

## Context

Ourrika Experiences is a Next.js 14+ App Router travel booking site with a Firebase backend. WhatsApp is the primary booking channel. The site is pre-launch this week. Three workstreams must be completed before go-live: security, analytics, and AI SEO.

---

## Workstream 1: Security

### Goals
- Ensure no client can write directly to Firestore
- Ensure the booking server action cannot be abused before launch

### Scope

**Firestore security rules**
- All collections must deny client reads/writes by default
- `booking_requests` collection: no client access (all writes go through `firebase-admin` server-side only)
- `experiences`, `destinations`, `site_settings`, `journal` collections: read-only for clients, no client writes

**Server action hardening** (`src/app/actions/booking.ts`)
- Add server-side field validation mirroring the client `validate()` function in `BookingModal.tsx` — client validation is UX only, server validation is the gate
- Required fields: `full_name`, `phone`, `email`, `preferred_date`, `guests_count`, `service_id`, `service_title`, `service_type`, `service_slug`
- Add rate limiting: max 5 booking requests per IP per hour using a lightweight in-memory store or Vercel Edge Config
- Sanitize all string fields before writing to Firestore (trim whitespace, enforce max lengths)

### Out of scope
- Auth/login (not applicable — public booking form)
- Payment processing (WhatsApp-confirmed, no payment taken online)

---

## Workstream 2: Analytics

### Goals
- Verify `trackEvent()` actually reaches the analytics provider before launch
- Track the full booking funnel from day 1
- Capture route changes in Next.js App Router

### Current state
`trackEvent()` is called in three places:
- `WhatsAppButton` — floating button click
- `BookingModal` — successful form submission
- `BookingModal` — WhatsApp alternative link click inside modal

### Gaps to fill

**Provider connection (required — analytics is currently a stub)**
- `src/lib/analytics.ts` exists but `trackEvent` only logs to console. The GA4 `gtag` call is commented out and no provider script is loaded
- Must: add GA4 script to `src/app/layout.tsx` (or via `next/script` with `strategy="afterInteractive"`)
- Must: uncomment and wire `window.gtag` call in `trackEvent`
- Must: add GA4 Measurement ID to `.env.local` as `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Must: extend `EventName` type to include new funnel events before adding calls

**Route-change pageviews** (`src/app/(public)/layout.tsx` or a new client component)
- Next.js App Router does not fire traditional pageview events on client-side navigation
- Add a `usePathname`-watching client component that fires `trackEvent('page_view', { path })` on every route change

**Funnel events to add**
| Event | Where | Trigger |
|---|---|---|
| `booking_modal_open` | `ExperienceBookingClient` | Button click opens modal |
| `booking_form_start` | `BookingModal` | First field interaction |
| `booking_modal_abandon` | `BookingModal` | Modal closes with form dirty but not submitted |
| `booking_submit_error` | `BookingModal` | Server action returns error |

**Already tracked** (verify firing):
- `whatsapp_click` (floating button)
- `booking_submit` (success)
- `whatsapp_click` (modal alternative, `location: modal_alternative`)

### Out of scope
- A/B testing infrastructure
- Heatmaps or session recording

---

## Workstream 3: AI SEO

### Goals
- Ensure first crawl picks up structured data for all experience and destination pages
- Ensure social sharing works with OG images
- Ensure all pages are discoverable via sitemap

### Scope

**JSON-LD structured data**
- Experience detail pages (`/experiences/[slug]`): emit `TouristAttraction` schema with `name`, `description`, `url`, `image`, `offers` (price + currency), `location`
- Destination detail pages (`/destinations/[slug]`): emit `TouristDestination` schema with `name`, `description`, `url`, `image`
- Homepage: emit `Organization` schema with site name, URL, and contact (WhatsApp number)
- Implementation: a `<JsonLd>` server component that renders a `<script type="application/ld+json">` tag, included in each detail page's `generateMetadata` or page component

**OG image fallback**
- Experience/destination pages currently have no `openGraph.images` in `generateMetadata`
- Add fallback OG image (static asset) so social shares are not blank
- If experience has an image URL, use it as the OG image via `generateMetadata`

**Sitemap** (`src/app/sitemap.ts`)
- Static routes: `/`, `/experiences`, `/destinations`, `/journal`, `/about`, `/privacy`, `/terms`
- Dynamic routes: all experience slugs, all destination slugs, all journal/blog slugs
- Fetch slugs server-side using existing `getAllExperiences()`, `getAllDestinations()`, `getAllBlogPosts()` data functions

**robots.txt** (`src/app/robots.ts`)
- Allow all public routes
- Disallow any admin routes if present

### Out of scope
- Programmatic OG image generation (next/og) — static fallback is sufficient for launch
- International SEO / hreflang

---

## Implementation Order

Run all three workstreams in parallel — they touch different parts of the codebase with no shared files.

| Priority | Workstream | Files touched |
|---|---|---|
| 1 | Security | `firestore.rules`, `src/app/actions/booking.ts` |
| 1 | Analytics | `src/app/(public)/layout.tsx`, `src/components/ui/BookingModal.tsx`, `src/components/ui/ExperienceBookingClient.tsx` |
| 1 | SEO | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/(public)/experiences/[slug]/page.tsx`, `src/app/(public)/destinations/[slug]/page.tsx`, `src/app/page.tsx` |

---

## Success Criteria

- [ ] Firestore security rules deny all direct client writes
- [ ] Booking server action validates + rate-limits server-side
- [ ] `trackEvent` calls verified reaching analytics provider
- [ ] Full funnel events firing: modal open → form start → submit → success/error/abandon
- [ ] Route-change pageviews tracked in App Router
- [ ] JSON-LD present on experience and destination detail pages
- [ ] OG image set on experience and destination pages
- [ ] `sitemap.ts` and `robots.ts` present and returning correct data
- [ ] Production build passes with no errors
