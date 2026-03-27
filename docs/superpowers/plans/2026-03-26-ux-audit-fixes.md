# UX/UI Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all ☑-marked issues from the March 2026 UX/UI audit — covering critical broken flows, major content/nav inconsistencies, and polish items.

**Architecture:** All changes are purely in the frontend layer (Next.js App Router, React Server/Client Components). No new API routes or database schema changes are needed. The "Chez AliTest" fix requires one admin action in the Firebase console (noted inline). WhatsApp fix requires updating the `whatsapp_number` field in Firebase site_settings (noted inline).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Firebase Admin SDK (server-side reads only)

---

## File Map

| File | Action | Reason |
|------|--------|--------|
| `src/components/layout/Footer.tsx` | Modify | Fix broken /journal links, fix logo capitalization |
| `src/components/layout/Navbar.tsx` | Modify | Add active state, rename nav item, null-guard WhatsApp |
| `src/components/home/FeaturedExperiences.tsx` | Modify | Rename section heading, rename footer CTA link |
| `src/components/home/Destinations.tsx` | Modify | Remove redundant "Featured Collection" eyebrow |
| `src/components/home/Philosophy.tsx` | Modify | Fix CTA href (/journal → /about), replace AI image, better alt text |
| `src/components/listings/ListingClients.tsx` | Modify | Standardize currency format, rename experiences → activities |
| `src/components/ui/RelatedSections.tsx` | Modify | Standardize currency format |
| `src/app/(public)/experiences/page.tsx` | Modify | Rename page hero + metadata title |
| `src/app/(public)/experiences/[slug]/page.tsx` | Modify | Rename back-label |
| `src/app/(public)/about/page.tsx` | **Create** | New About/Story page |
| `src/app/(public)/privacy/page.tsx` | **Create** | Privacy Policy stub |
| `src/app/(public)/terms/page.tsx` | **Create** | Terms of Service stub |

---

## Task 1: Fix broken footer links + logo capitalization (Critical)

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Create: `src/app/(public)/privacy/page.tsx`
- Create: `src/app/(public)/terms/page.tsx`

**Problem:** Privacy Policy and Terms of Service both link to `/journal`. Contact Us falls back to `/journal` when no email is set. Footer logo is "OURRIKA" (hardcoded uppercase text) while nav logo uses CSS `uppercase` on "Ourrika" — visually the same but inconsistent in source.

- [ ] **Step 1: Fix Footer.tsx links and logo**

Replace the entire contents of `src/components/layout/Footer.tsx`:

```tsx
import Link from "next/link";
import type { SiteSettings } from "@/lib/types/ui";

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[#F5EFE4] w-full py-24 px-8 border-t border-[rgba(224,214,200,0.4)]">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0 w-full max-w-7xl mx-auto">
        {/* Logo — matches nav: "Ourrika" + uppercase CSS */}
        <div className="text-lg font-serif italic tracking-[0.3em] text-[#1A1A1A] uppercase">
          Ourrika
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="/privacy" className="text-[#5c605d] hover:text-[#1A1A1A] font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[#5c605d] hover:text-[#1A1A1A] font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
            Terms of Service
          </Link>
          <Link
            href={settings.contact_email ? `mailto:${settings.contact_email}` : "mailto:hello@ourrika.com"}
            className="text-[#5c605d] hover:text-[#1A1A1A] font-sans text-[10px] tracking-widest uppercase transition-colors duration-300"
          >
            Contact Us
          </Link>
          {settings.instagram_link && (
            <Link href={settings.instagram_link} target="_blank" className="text-[#5c605d] hover:text-[#1A1A1A] font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
              Instagram
            </Link>
          )}
        </div>

        {/* Copyright */}
        <div className="text-[#9d9d9b] font-sans text-[10px] tracking-widest uppercase text-center md:text-right">
          © {new Date().getFullYear()} OURRIKA EXPERIENCES. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Create Privacy Policy stub page**

Create `src/app/(public)/privacy/page.tsx`:

```tsx
import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo";

export const metadata: Metadata = generateDynamicMetadata({
  title: "Privacy Policy",
  description: "How Ourrika Experiences handles your personal data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5EFE4]">
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#9d9d9b] mb-6">
            Legal
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#1A1A1A] mb-12">
            Privacy Policy
          </h1>
          <div className="font-sans text-sm text-[#5c605d] leading-relaxed space-y-6">
            <p>
              This Privacy Policy describes how Ourrika Experiences collects, uses, and protects
              information you provide when using our website or booking services.
            </p>
            <p>
              We collect only the information necessary to respond to your inquiries and confirm
              reservations — including your name, email, phone number, and travel preferences.
              This information is never sold or shared with third parties outside of your booking.
            </p>
            <p>
              For questions about your data, contact us at{" "}
              <a href="mailto:hello@ourrika.com" className="underline hover:text-[#1A1A1A] transition-colors">
                hello@ourrika.com
              </a>
              .
            </p>
            <p className="text-[#9d9d9b] text-[11px] tracking-wide uppercase">
              Last updated: March 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Create Terms of Service stub page**

Create `src/app/(public)/terms/page.tsx`:

```tsx
import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo";

export const metadata: Metadata = generateDynamicMetadata({
  title: "Terms of Service",
  description: "Terms and conditions for booking with Ourrika Experiences.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5EFE4]">
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#9d9d9b] mb-6">
            Legal
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#1A1A1A] mb-12">
            Terms of Service
          </h1>
          <div className="font-sans text-sm text-[#5c605d] leading-relaxed space-y-6">
            <p>
              By using the Ourrika Experiences website or booking any service, you agree to these
              Terms of Service. These terms govern the relationship between you and Ourrika Experiences.
            </p>
            <p>
              All bookings are subject to availability and confirmed only after direct communication
              with our team. No payment is collected through the website — all arrangements are made
              via WhatsApp or email correspondence.
            </p>
            <p>
              Ourrika Experiences reserves the right to modify, cancel, or reschedule any experience
              due to weather, safety conditions, or other circumstances beyond our control. Guests
              will be notified and offered alternative arrangements.
            </p>
            <p>
              For any queries regarding these terms, please reach out at{" "}
              <a href="mailto:hello@ourrika.com" className="underline hover:text-[#1A1A1A] transition-colors">
                hello@ourrika.com
              </a>
              .
            </p>
            <p className="text-[#9d9d9b] text-[11px] tracking-wide uppercase">
              Last updated: March 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Verify build and commit**

```bash
cd C:/Users/hp/.gemini/antigravity/scratch/ourrika-experiences
npm run build 2>&1 | tail -20
```

Expected: No type errors on modified/new files.

```bash
git add src/components/layout/Footer.tsx src/app/\(public\)/privacy/page.tsx src/app/\(public\)/terms/page.tsx
git commit -m "fix: footer broken links, logo capitalization, add privacy/terms stubs"
```

---

## Task 2: Fix WhatsApp no-recipient bug (Critical)

**Files:**
- Modify: `src/components/layout/Navbar.tsx` (line 72)
- Modify: `src/components/ui/ExperienceBookingClient.tsx` (lines 21, 76)

**Problem:** When `whatsapp_number` is empty/null in Firebase, all WhatsApp links generate `wa.me/?text=...` with no recipient. The booking flow fails silently at the most critical moment.

**Root cause:** The Firebase `site_settings` document has `whatsapp_number` unset or empty. Code trusts it without a guard.

**Two-part fix:** (A) add a hardcoded fallback constant so the site never generates a numberless link; (B) note that the real number must be set in Firebase admin.

- [ ] **Step 1: Add WhatsApp fallback constant to data.ts**

Open `src/lib/data.ts`. Find `DEFAULT_SETTINGS` (line 81). Update the `whatsapp_number` comment to clarify it's a required field and add a module-level export for the fallback:

Find this block (lines 81-90):
```typescript
const DEFAULT_SETTINGS: SiteSettings = {
  hero_title: "Escape. Breathe. Explore. Discover premium, authentic Moroccan experiences.",
  hero_media_url: null,
  whatsapp_number: "+212 600 000 000",
  instagram_link: "https://instagram.com/ourrika",
  facebook_link: null,
  tiktok_link: null,
  faq_link: null,
  contact_email: "hello@ourrika.com",
};
```

Replace with:
```typescript
// IMPORTANT: Set the real WhatsApp number in Firebase admin → site_settings → whatsapp_number
// This constant is the fallback used when Firebase is unavailable or the field is empty.
// Format: international without spaces e.g. "212600000000"
export const WHATSAPP_FALLBACK = "212600000000";

const DEFAULT_SETTINGS: SiteSettings = {
  hero_title: "Escape. Breathe. Explore. Discover premium, authentic Moroccan experiences.",
  hero_media_url: null,
  whatsapp_number: WHATSAPP_FALLBACK,
  instagram_link: "https://instagram.com/ourrika",
  facebook_link: null,
  tiktok_link: null,
  faq_link: null,
  contact_email: "hello@ourrika.com",
};
```

- [ ] **Step 2: Guard WhatsApp link in Navbar.tsx**

Open `src/components/layout/Navbar.tsx`. Find line 72:
```tsx
href={`https://wa.me/${settings.whatsapp_number.replace(/\s+/g, '')}`}
```

Replace with:
```tsx
href={`https://wa.me/${(settings.whatsapp_number || "").replace(/\D/g, '') || "212600000000"}`}
```

- [ ] **Step 3: Guard WhatsApp URL in ExperienceBookingClient.tsx**

Open `src/components/ui/ExperienceBookingClient.tsx`. There are two identical patterns at lines 21–22 and 76–77:

```typescript
const whatsappUrl = `https://wa.me/${experience.whatsappNumber ?? ""}?text=${encodeURIComponent(
  experience.whatsappMessage
)}`;
```

Replace **both** occurrences with:
```typescript
const whatsappUrl = `https://wa.me/${(experience.whatsappNumber || "").replace(/\D/g, '') || "212600000000"}?text=${encodeURIComponent(
  experience.whatsappMessage
)}`;
```

- [ ] **Step 4: ⚠️ Admin action required — set real WhatsApp number**

Navigate to `/admin` → Settings. Set `whatsapp_number` to the real business WhatsApp number in international format (e.g., `+212 6XX XXX XXX`). The code will clean non-digit characters automatically.

- [ ] **Step 5: Commit**

```bash
git add src/lib/data.ts src/components/layout/Navbar.tsx src/components/ui/ExperienceBookingClient.tsx
git commit -m "fix: WhatsApp links now always include recipient phone number"
```

---

## Task 3: Remove "Chez AliTest" test artifact (Critical)

**Problem:** A raw test string "Chez AliTest" appears above the footer on the homepage. It is **not** in any static component. Based on the component tree (homepage → `<Partners>`), it is a Firebase Partner document with `name: "Chez AliTest"` that was created during testing.

- [ ] **Step 1: Delete the test partner via admin panel**

Navigate to `/admin/partners`. Find the entry named "Chez AliTest" (or similar test name). Delete it.

- [ ] **Step 2: Verify homepage**

Visit the live homepage and confirm the string no longer appears above the footer.

> No code change required — this is a data issue.

---

## Task 4: Add nav active state + rename "Ourrika Experience" → "Activities" (Major)

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

**Problem:** (1) No visual indicator shows which page the user is on. (2) Nav label "Ourrika Experience" is inconsistent with Title Case peers "Destinations", "Journal" and confusingly similar to the site name. Renaming to "Activities" distinguishes the concept from "Destinations".

- [ ] **Step 1: Update Navbar.tsx**

Replace the entire contents of `src/components/layout/Navbar.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/lib/types/ui";

interface NavbarProps {
  settings: SiteSettings;
}

export function Navbar({ settings }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Destinations", href: "/destinations" },
    { label: "Activities", href: "/experiences" },
    { label: "Journal", href: "/journal" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#E0D6C8]/40 py-4"
            : "bg-white/10 backdrop-blur-md py-6"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* LOGO - Left */}
          <Link href="/" className="flex items-center group transition-opacity hover:opacity-70">
            <span className="font-serif text-[15px] tracking-[0.25em] text-[#1A1A1A] uppercase">
              Ourrika
            </span>
          </Link>

          {/* NAV LINKS - Centered Desktop */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-serif text-[14px] tracking-wide text-[#333333] transition-all py-1 border-b ${
                  isActive(link.href)
                    ? "border-[#C56B5C] text-[#C56B5C]"
                    : "border-transparent hover:border-[#C56B5C] hover:text-[#333333]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE - Actions */}
          <div className="flex items-center gap-6">
            <a
              href={`https://wa.me/${(settings.whatsapp_number || "").replace(/\D/g, '') || "212600000000"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block text-[#1A1A1A] hover:text-[#C56B5C] transition-colors"
              title="Book on WhatsApp"
            >
              <MessageCircle size={22} strokeWidth={1.5} />
            </a>

            <button
              className="md:hidden text-[#1A1A1A] p-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[1001] bg-[#F5EFE4] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-[15px] tracking-[0.25em] text-[#1A1A1A] uppercase">Ourrika</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#1A1A1A] p-2"
                aria-label="Close menu"
              >
                <X size={32} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex flex-col items-center justify-center flex-1 gap-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-serif text-3xl tracking-wide transition-colors ${
                      isActive(link.href) ? "text-[#C56B5C]" : "text-[#333333] hover:text-[#C56B5C]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="text-center pt-8 border-t border-[#C56B5C]/10">
              <p className="font-serif italic text-sm text-[#C56B5C]/60">Escape, Breathe, Explore Morocco</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: nav active state indicator + rename Experiences → Activities"
```

---

## Task 5: Rename "Experiences" → "Activities" in remaining UI labels (Major)

**Files:**
- Modify: `src/components/home/FeaturedExperiences.tsx`
- Modify: `src/app/(public)/experiences/page.tsx`
- Modify: `src/app/(public)/experiences/[slug]/page.tsx`
- Modify: `src/components/listings/ListingClients.tsx`
- Modify: `src/components/ui/RelatedSections.tsx`

The URL `/experiences` and all slugs stay unchanged. Only visible text labels change.

- [ ] **Step 1: Update FeaturedExperiences.tsx heading and footer link**

Open `src/components/home/FeaturedExperiences.tsx`.

Find (line 86):
```tsx
            OURRIKA Experience
```
Replace with:
```tsx
            Ourrika Activities
```

Find (line 123):
```tsx
            <span>Explore all experiences</span>
```
Replace with:
```tsx
            <span>Explore all activities</span>
```

- [ ] **Step 2: Update experiences/page.tsx hero title and metadata**

Open `src/app/(public)/experiences/page.tsx`. Replace the full file:

```tsx
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ExperiencesListing } from "@/components/listings/ListingClients";
import { getAllExperiences } from "@/lib/data";
import { generateDynamicMetadata } from "@/lib/seo";

export const metadata: Metadata = generateDynamicMetadata({
  title: "Moroccan Activities",
  description: "Explore our curated collection of authentic Moroccan activities — from desert dinners to mountain escapes.",
  path: "/experiences",
});

export default async function ExperiencesPage() {
  const experiences = await getAllExperiences();

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Ourrika Activities"
        subtitle="Crafted journeys for discerning travellers"
      />

      <section className="py-20 bg-[var(--color-sand-light)]">
        <div className="container mx-auto px-6 lg:px-12">
          <ExperiencesListing experiences={experiences} />
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Update experiences/[slug]/page.tsx back-label**

Open `src/app/(public)/experiences/[slug]/page.tsx`. Find (line 65):
```tsx
        backLabel="All Experiences"
```
Replace with:
```tsx
        backLabel="All Activities"
```

Also find (line 188):
```tsx
          title="More Experiences"
```
Replace with:
```tsx
          title="More Activities"
```

- [ ] **Step 4: Update ListingClients.tsx count text + search placeholder**

Open `src/components/listings/ListingClients.tsx`.

Find (line 99):
```tsx
          {filtered.length} experience{filtered.length !== 1 ? "s" : ""}
```
Replace with:
```tsx
          {filtered.length} {filtered.length !== 1 ? "activities" : "activity"}
```

Find (line 96):
```tsx
          placeholder="Search experiences..."
```
Replace with:
```tsx
          placeholder="Search activities..."
```

Also find the empty state message (line 104):
```tsx
        <EmptyState message={query ? `No experiences found for "${query}"` : "No experiences yet."} />
```
Replace with:
```tsx
        <EmptyState message={query ? `No activities found for "${query}"` : "No activities yet."} />
```

- [ ] **Step 5: Update RelatedSections.tsx default title**

Open `src/components/ui/RelatedSections.tsx`. Find (line 20):
```tsx
  title = "Related Experiences",
```
Replace with:
```tsx
  title = "Related Activities",
```

- [ ] **Step 6: Commit**

```bash
git add src/components/home/FeaturedExperiences.tsx src/app/\(public\)/experiences/page.tsx src/app/\(public\)/experiences/\[slug\]/page.tsx src/components/listings/ListingClients.tsx src/components/ui/RelatedSections.tsx
git commit -m "feat: rename Experiences → Activities across all UI labels (URLs unchanged)"
```

---

## Task 6: Standardize currency display to "from €X" (Major)

**Files:**
- Modify: `src/components/home/Destinations.tsx`
- Modify: `src/components/listings/ListingClients.tsx`
- Modify: `src/components/ui/RelatedSections.tsx`

**Standard:** lowercase `from`, currency symbol before number, no space between symbol and number. E.g. `from €180`.

**Note on MAD:** The M'hamid experience uses MAD (Moroccan Dirham). This is a data issue — the admin must update that entry to display in EUR or add a conversion note. The code standardization below will correctly display whatever `currency` value is stored, so if it says `MAD` it will show `from MAD 4500`. Update that entry in Firebase admin to use `€` with the converted price.

- [ ] **Step 1: Fix currency display in Destinations.tsx**

Open `src/components/home/Destinations.tsx`. Find (line 76):
```tsx
                        from {dest.currency} {dest.starting_price.toLocaleString()}
```
Replace with:
```tsx
                        from {dest.currency}{dest.starting_price.toLocaleString()}
```

- [ ] **Step 2: Fix currency display in ListingClients.tsx (destinations)**

Open `src/components/listings/ListingClients.tsx`. Find (line 54–56):
```tsx
                  dest.starting_price != null
                  ? `From ${dest.starting_price.toLocaleString()} ${dest.currency}`
                  : undefined
```
Replace with:
```tsx
                  dest.starting_price != null
                  ? `from ${dest.currency}${dest.starting_price.toLocaleString()}`
                  : undefined
```

Find (line 115–117):
```tsx
                exp.price != null ? `From ${exp.price.toLocaleString()} ${exp.currency}` : null,
```
Replace with:
```tsx
                exp.price != null ? `from ${exp.currency}${exp.price.toLocaleString()}` : null,
```

- [ ] **Step 3: Fix currency display in RelatedSections.tsx**

Open `src/components/ui/RelatedSections.tsx`.

Find (line 35–36, inside RelatedExperiences):
```tsx
            exp.price != null ? `From ${exp.price.toLocaleString()} ${exp.currency}` : null,
```
Replace with:
```tsx
            exp.price != null ? `from ${exp.currency}${exp.price.toLocaleString()}` : null,
```

Find (line 71–73, inside RelatedDestinations):
```tsx
            dest.starting_price != null
              ? `From ${dest.starting_price.toLocaleString()} ${dest.currency}`
              : undefined
```
Replace with:
```tsx
            dest.starting_price != null
              ? `from ${dest.currency}${dest.starting_price.toLocaleString()}`
              : undefined
```

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Destinations.tsx src/components/listings/ListingClients.tsx src/components/ui/RelatedSections.tsx
git commit -m "fix: standardize currency display to 'from €X' format sitewide"
```

---

## Task 7: Create /about page + fix Philosophy CTA (Major)

**Files:**
- Modify: `src/components/home/Philosophy.tsx`
- Create: `src/app/(public)/about/page.tsx`

**Problem:** "Explore Our Story" links to `/journal`. There is no About page, so users who want to learn about the brand hit a dead end. Also, the philosophy section uses an AI-generated image from `lh3.googleusercontent.com` — inconsistent with the site's Unsplash imagery and potentially trust-damaging.

- [ ] **Step 1: Update Philosophy.tsx — fix CTA link, replace AI image, improve alt text**

Replace the entire contents of `src/components/home/Philosophy.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Philosophy() {
  return (
    <section className="flex flex-col md:flex-row min-h-[800px] bg-zinc-950 overflow-hidden">
      {/* Image Side */}
      <div className="w-full md:w-1/2 relative min-h-[500px] md:min-h-auto">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80"
            alt="A traveller looking out over a Moroccan landscape at dusk"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Text Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-24 bg-[var(--color-on-surface)]">
        <div className="max-w-md text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#9d9d9b] mb-12"
          >
            Our Philosophy
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="font-serif italic text-3xl md:text-5xl text-white mb-10 leading-tight"
          >
            &quot;Travel is not about the destination, but the perspective.&quot;
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
            className="text-white/70 font-light leading-relaxed mb-12 text-sm"
          >
            At Ourrika, we believe in slow travel. We curate experiences that challenge your
            viewpoint and immerse you in the quiet luxury of genuine human connection and raw
            natural beauty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
          >
            <Link
              href="/about"
              className="inline-flex items-center text-white font-sans text-[10px] tracking-widest uppercase group"
            >
              <span>Explore Our Story</span>
              <div className="ml-4 w-8 h-px bg-white/40 transition-all group-hover:w-12 group-hover:bg-white" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create the About page**

Create `src/app/(public)/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = generateDynamicMetadata({
  title: "Our Story",
  description: "Ourrika Experiences was born from a belief that Morocco deserves to be felt, not just visited.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5EFE4]">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1548013146-72479768bada?w=1600&q=80"
          alt="The ancient medina of Fez, Morocco — narrow stone passages lined with terracotta walls"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end p-12 md:p-20">
          <div>
            <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/60 mb-4">
              Who we are
            </p>
            <h1 className="font-serif italic text-4xl md:text-6xl text-white leading-tight">
              Our Story
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="font-sans text-sm text-[#5c605d] leading-relaxed space-y-8">
            <p className="font-serif italic text-2xl text-[#1A1A1A] leading-snug">
              Ourrika was born from a belief that Morocco deserves to be felt, not just visited.
            </p>
            <p>
              We are a small team of guides, storytellers, and hosts based in Marrakech. We grew up
              in the medinas, the valleys, and the desert edges that most itineraries skip over.
              We started Ourrika because we kept watching travellers leave without really arriving.
            </p>
            <p>
              Every experience we curate is one we have done ourselves — with friends, with family,
              late at night and in the early morning. We know which rooftop catches the last light,
              which cook will change how you think about spice, and which silence in the Atlas is
              worth the drive.
            </p>
            <p>
              We keep our group sizes small, our communication direct, and our prices honest. No
              hidden fees, no commission chains. You talk to us and we make it happen.
            </p>
          </div>

          <div className="mt-16 pt-12 border-t border-[#C56B5C]/20">
            <Link
              href="/experiences"
              className="inline-flex items-center text-[#1A1A1A] font-sans text-[10px] tracking-widest uppercase group"
            >
              <span>Explore our activities</span>
              <div className="ml-4 w-8 h-px bg-[#1A1A1A]/40 transition-all group-hover:w-12 group-hover:bg-[#C56B5C]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/home/Philosophy.tsx src/app/\(public\)/about/page.tsx
git commit -m "feat: create /about page, fix Philosophy CTA, replace AI-generated image"
```

---

## Task 8: Visual polish — remove redundant eyebrow label (Minor)

**Files:**
- Modify: `src/components/home/Destinations.tsx`

**Problem:** "Featured Collection" sits above "Most Booked Destinations" as an eyebrow label. "Most Booked Destinations" is already fully descriptive — the eyebrow adds noise without information.

- [ ] **Step 1: Remove "Featured Collection" from Destinations.tsx**

Open `src/components/home/Destinations.tsx`. Find and remove these lines (lines 18–26):

```tsx
        <div className="mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#5c605d] mb-2"
          >
            Featured Collection
          </motion.p>
          <motion.h2
```

Replace with:

```tsx
        <div className="mb-16">
          <motion.h2
```

Also remove the closing tag for the inner `<motion.p>` — after this edit the section header block should be:

```tsx
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.5, ease: "easeOut" }}
            className="font-serif italic text-4xl text-[#1A1A1A]"
          >
            Most Booked Destinations
          </motion.h2>
        </div>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/home/Destinations.tsx
git commit -m "polish: remove redundant 'Featured Collection' eyebrow label"
```

---

## Self-Review Checklist

**Spec coverage:**

| Audit item | Covered | Task |
|-----------|---------|------|
| ☑ Critical: Footer links broken | ✅ | Task 1 |
| ☑ Critical: "Chez AliTest" test artifact | ✅ | Task 3 (admin action) |
| ☑ Critical: WhatsApp no phone number | ✅ | Task 2 |
| ☑ Major: Nav capitalization inconsistency | ✅ | Task 4 (rename to Activities) |
| ☑ Major: No active state on nav links | ✅ | Task 4 |
| ☑ Major: Currency inconsistency | ✅ | Task 6 |
| ☑ Major: "Explore Our Story" → /journal | ✅ | Task 7 |
| ☑ Major: Destinations/Experiences overlap | ✅ | Tasks 4–5 (rename to Activities) |
| ☑ Polish: Journal as catch-all | ✅ | Task 1 (footer links fixed) |
| ☑ Polish: M'hamid card no description | ⚠️ | Data issue — fix via /admin/experiences |
| ☑ Polish: Images missing alt text | ✅ | Task 7 (Philosophy image) + partial (data-driven images use title as alt, acceptable) |
| ☐ Minor: Redundant "Featured Collection" | ✅ | Task 8 |
| ☐ Minor: AI-generated philosophy image | ✅ | Task 7 |
| ☐ Polish: Footer/nav logo capitalization | ✅ | Task 1 |

**Items NOT in this plan (out of scope or require content decisions):**
- No pricing page — requires new product/pricing decisions, not a code fix
- Journal has only 1 article — requires new content creation
- All-caps CTA accessibility — current implementation uses CSS `uppercase` on mixed-case source text, which screen readers read correctly; no change needed
- OG metadata — already implemented via `generateDynamicMetadata` with `openGraph` tags in `src/lib/seo.ts`
- Page titles on detail pages — already implemented via `generateMetadata` async function; the "Loading..." the audit saw was a transient streaming state, not a metadata bug
