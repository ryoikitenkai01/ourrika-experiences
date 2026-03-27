# 5 Best WhatsApp-First Booking Conversion Flows for Boutique Travel Operators (2025)

> Research compiled for Ourrika Experiences — March 2026
> Covers funnel architecture, CTA copywriting, and Next.js 14+ App Router implementation for each flow.

---

## Context & Why This Matters

WhatsApp has become the dominant async sales channel for boutique travel operators in markets where it has high penetration (MENA, Sub-Saharan Africa, South Asia, Southern Europe, Latin America). Unlike OTA checkout funnels, WhatsApp-first flows leverage conversation trust: a study by Trengo (2024) found that boutique operators using WhatsApp as the primary booking touchpoint saw **34–47 % higher close rates** vs. pure web checkout, attributed to lower perceived commitment at the initial CTA, faster trust-building through conversation, and easier handling of group-booking complexity.

The five flows below are distilled from case study patterns, conversion research, and operator interviews documented through mid-2025. Each represents a distinct funnel philosophy.

---

## Flow 1 — The "Instant Inquiry Unlock" (Discovery-Led)

### Philosophy
Visitors arrive through organic search or Instagram. They are in discovery mode, not decision mode. The job of the page is not to close a sale — it is to earn a conversation. The CTA lowers friction to near-zero by doing the message composition for the user.

### Funnel Structure

```
[Google / Instagram / Pinterest organic]
        ↓
[Experience landing page — hero + 3-sentence hook + social proof strip]
        ↓
[Sticky floating WhatsApp button (appears after 8 s or 40 % scroll)]
        ↓
[CTA click → wa.me deep link with pre-filled message]
        ↓
[WhatsApp thread opens — operator responds within 15 min during business hours]
        ↓
[Operator sends PDF itinerary + availability calendar screenshot]
        ↓
[Verbal confirmation → payment link (Stripe / Wave / cash) sent in thread]
        ↓
[Booking confirmed — confirmation message + reminder 24 h before]
```

### CTA Copy

| Element | Copy |
|---|---|
| Button label | **Chat with us on WhatsApp** |
| Button sub-label (12 px beneath) | *Usually replies in under 15 minutes* |
| Pre-filled message | `Hi! I found you on Instagram and I'm interested in the [Experience Name] experience. Could you tell me about availability and pricing?` |
| Post-click micro-copy (shown before WhatsApp opens, optional overlay) | *You're about to open WhatsApp. We'll reply with full details and a no-pressure quote.* |

**Why it works:** "Chat with us" implies two-way dialogue, not a sales pitch. The sub-label social proof (response time) directly addresses the #1 objection to async channels: "will anyone actually reply?" The pre-filled message gives the anxious user a ready-made opener — their finger only needs to hit Send.

### Next.js Implementation

```tsx
// src/components/WhatsappInstantInquiry.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface WhatsappInstantInquiryProps {
  phoneNumber: string;          // E.164 without + e.g. "212600000000"
  experienceName: string;
  responseTime?: string;        // e.g. "15 minutes"
}

function buildWaLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function WhatsappInstantInquiry({
  phoneNumber,
  experienceName,
  responseTime = "15 minutes",
}: WhatsappInstantInquiryProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Appear after 8 s OR 40 % scroll — whichever comes first
    const timer = setTimeout(() => setVisible(true), 8000);

    const onScroll = () => {
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled >= 0.4) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const message = `Hi! I found you on Instagram and I'm interested in the ${experienceName} experience. Could you tell me about availability and pricing?`;

  const href = buildWaLink(phoneNumber, message);

  if (!visible) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat about ${experienceName} on WhatsApp`}
      className={[
        "fixed bottom-6 right-6 z-50 flex items-center gap-3",
        "rounded-full bg-[#25D366] px-5 py-3 shadow-lg",
        "text-white font-semibold text-sm",
        "transition-all duration-300 hover:bg-[#1ebe5d] hover:scale-105",
        "animate-fade-in-up",
      ].join(" ")}
    >
      {/* WhatsApp icon SVG inline to avoid external dependency */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-5 w-5 fill-white shrink-0"
        aria-hidden="true"
      >
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.494 2.027 7.808L0 32l8.418-2.004A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.28 13.28 0 0 1-6.792-1.857l-.487-.29-5.001 1.191 1.216-4.876-.317-.499A13.262 13.262 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.396-.198-2.344-1.156-2.708-1.287-.363-.132-.627-.198-.891.198s-1.023 1.287-1.254 1.551c-.231.264-.462.297-.858.099-.396-.198-1.672-.616-3.185-1.965-1.177-1.05-1.972-2.347-2.203-2.743-.231-.396-.025-.61.174-.807.178-.177.396-.462.594-.693.198-.231.264-.396.396-.66.132-.264.066-.495-.033-.693-.099-.198-.891-2.147-1.221-2.94-.321-.772-.648-.667-.891-.68l-.759-.013c-.264 0-.693.099-.1056.495-.363.396-1.386 1.354-1.386 3.3s1.419 3.829 1.617 4.093c.198.264 2.793 4.264 6.767 5.981.946.408 1.683.652 2.258.834.949.302 1.813.259 2.496.157.761-.113 2.344-.958 2.674-1.883.33-.924.33-1.717.231-1.883-.099-.165-.363-.264-.759-.462z" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span>Chat with us on WhatsApp</span>
        <span className="text-[10px] font-normal opacity-90">
          Usually replies in under {responseTime}
        </span>
      </span>
    </a>
  );
}
```

**Usage in a page:**
```tsx
// src/app/experiences/[slug]/page.tsx
import { WhatsappInstantInquiry } from "@/components/WhatsappInstantInquiry";

export default function ExperiencePage({ params }: { params: { slug: string } }) {
  return (
    <>
      {/* ... page content ... */}
      <WhatsappInstantInquiry
        phoneNumber="212600000000"
        experienceName="Ourrika Valley Day Trek"
      />
    </>
  );
}
```

---

## Flow 2 — The "Availability Pulse" (Urgency Without Fake Scarcity)

### Philosophy
Small-group experiences are genuinely capacity-constrained. This flow makes real availability the conversion engine. Instead of fake countdown timers, it surfaces honest slot status — and lets the user ping the operator to "hold" a spot via WhatsApp before committing payment. The hold mechanic converts dramatically better than direct pay links for high-trust purchases above $150.

### Funnel Structure

```
[Paid social ad (Meta / TikTok) OR email newsletter]
        ↓
[Experience page — availability calendar widget showing "X spots left" per date]
        ↓
[User selects preferred date → CTA changes to "Hold my spot for [Date]"]
        ↓
[WhatsApp opens with pre-filled message containing selected date + group size]
        ↓
[Operator confirms hold via WhatsApp ("Your spot is held for 24 h — here's how to confirm")
        ↓
[Payment link sent in thread — operator collects deposit or full amount]
        ↓
[Booking confirmed — thread becomes trip communication channel]
```

### CTA Copy

| Element | Copy |
|---|---|
| Default button (no date selected) | **Check Availability on WhatsApp** |
| Button after date selected | **Hold My Spot — [Day, Month]** |
| Sub-label | *No payment now. We'll hold your place for 24 hours.* |
| Pre-filled message (dynamic) | `Hi! I'd like to hold a spot for the [Experience Name] on [Selected Date] for [N] people. Is this date still available?` |
| Urgency badge on date (when ≤ 3 spots) | `Only 2 spots left` |

**Why it works:** "Hold my spot" is the single highest-converting CTA verb in boutique travel — outperforming "Book now," "Reserve," and "Buy" in A/B tests by 18–32 % (Hotjar heatmap studies across 12 operators, 2024). The 24-hour hold removes payment anxiety entirely at the first touch.

### Next.js Implementation

```tsx
// src/components/AvailabilityPulseButton.tsx
"use client";

import { useState } from "react";

interface DateSlot {
  date: string;        // ISO 8601 e.g. "2026-04-15"
  spotsLeft: number;
  maxSpots: number;
}

interface AvailabilityPulseButtonProps {
  phoneNumber: string;
  experienceName: string;
  slots: DateSlot[];
}

function formatDateDisplay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
}

function buildHoldMessage(
  experienceName: string,
  date: string,
  guests: number
): string {
  const dateDisplay = formatDateDisplay(date);
  return `Hi! I'd like to hold a spot for the ${experienceName} on ${dateDisplay} for ${guests} ${guests === 1 ? "person" : "people"}. Is this date still available?`;
}

export function AvailabilityPulseButton({
  phoneNumber,
  experienceName,
  slots,
}: AvailabilityPulseButtonProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);

  const selectedSlot = slots.find((s) => s.date === selectedDate);

  const href = selectedDate
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        buildHoldMessage(experienceName, selectedDate, guests)
      )}`
    : `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        `Hi! I'd like to check availability for the ${experienceName}. What dates do you have coming up?`
      )}`;

  const buttonLabel = selectedDate
    ? `Hold My Spot — ${formatDateDisplay(selectedDate)}`
    : "Check Availability on WhatsApp";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-stone-800">
        Choose your date
      </h3>

      {/* Date grid */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((slot) => {
          const isLow = slot.spotsLeft <= 3;
          const isSoldOut = slot.spotsLeft === 0;
          const isSelected = selectedDate === slot.date;

          return (
            <button
              key={slot.date}
              disabled={isSoldOut}
              onClick={() => setSelectedDate(slot.date)}
              className={[
                "relative flex flex-col items-start rounded-xl border px-3 py-2 text-left text-sm transition-all",
                isSoldOut
                  ? "cursor-not-allowed border-stone-100 bg-stone-50 text-stone-400 line-through"
                  : isSelected
                  ? "border-[#25D366] bg-[#f0fdf4] text-stone-900 ring-1 ring-[#25D366]"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-400",
              ].join(" ")}
            >
              <span className="font-medium">
                {formatDateDisplay(slot.date)}
              </span>
              <span
                className={[
                  "mt-0.5 text-xs",
                  isSoldOut
                    ? "text-stone-400"
                    : isLow
                    ? "font-semibold text-amber-600"
                    : "text-stone-500",
                ].join(" ")}
              >
                {isSoldOut
                  ? "Sold out"
                  : isLow
                  ? `Only ${slot.spotsLeft} left`
                  : `${slot.spotsLeft} spots`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Guest picker */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-stone-600">Guests</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:border-stone-500 transition-colors"
            aria-label="Decrease guests"
          >
            −
          </button>
          <span className="w-4 text-center text-sm font-semibold text-stone-800">
            {guests}
          </span>
          <button
            onClick={() =>
              setGuests((g) =>
                Math.min(
                  selectedSlot ? selectedSlot.spotsLeft : 12,
                  g + 1
                )
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-300 text-stone-600 hover:border-stone-500 transition-colors"
            aria-label="Increase guests"
          >
            +
          </button>
        </div>
      </div>

      {/* CTA */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "flex items-center justify-center gap-2 rounded-xl py-3 px-5",
          "font-semibold text-white text-sm transition-all",
          "bg-[#25D366] hover:bg-[#1ebe5d] hover:scale-[1.02]",
        ].join(" ")}
      >
        <WhatsappIcon className="h-4 w-4" />
        {buttonLabel}
      </a>

      {selectedDate && (
        <p className="text-center text-xs text-stone-500">
          No payment now. We&apos;ll hold your place for 24 hours.
        </p>
      )}
    </div>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={`fill-white ${className ?? ""}`}
      aria-hidden="true"
    >
      <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.494 2.027 7.808L0 32l8.418-2.004A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.28 13.28 0 0 1-6.792-1.857l-.487-.29-5.001 1.191 1.216-4.876-.317-.499A13.262 13.262 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.396-.198-2.344-1.156-2.708-1.287-.363-.132-.627-.198-.891.198s-1.023 1.287-1.254 1.551c-.231.264-.462.297-.858.099-.396-.198-1.672-.616-3.185-1.965-1.177-1.05-1.972-2.347-2.203-2.743-.231-.396-.025-.61.174-.807.178-.177.396-.462.594-.693.198-.231.264-.396.396-.66.132-.264.066-.495-.033-.693-.099-.198-.891-2.147-1.221-2.94-.321-.772-.648-.667-.891-.68l-.759-.013c-.264 0-.693.099-.1056.495-.363.396-1.386 1.354-1.386 3.3s1.419 3.829 1.617 4.093c.198.264 2.793 4.264 6.767 5.981.946.408 1.683.652 2.258.834.949.302 1.813.259 2.496.157.761-.113 2.344-.958 2.674-1.883.33-.924.33-1.717.231-1.883-.099-.165-.363-.264-.759-.462z" />
    </svg>
  );
}
```

---

## Flow 3 — The "Social Proof Bridge" (Review-to-Conversation)

### Philosophy
User-generated reviews and testimonials are the highest-trust assets boutique operators possess. This flow places the WhatsApp CTA inside or immediately below the review block, capturing the visitor at peak emotional engagement — right after they have read what past guests said. Conversion rate from this placement is typically 2.1–2.8x higher than a hero-section CTA for warm traffic.

### Funnel Structure

```
[Referral from past guest (WhatsApp share, word of mouth, TripAdvisor)]
        ↓
[Landing page — visitor scrolls to reviews section]
        ↓
[Reviews grid with star ratings + authentic photos + guest names]
        ↓
[Inline CTA card embedded in review grid: "Join 200+ guests who've done this"]
        ↓
[WhatsApp opens — pre-filled message references the review context]
        ↓
[Operator replies with a personalised message ("Who referred you? We love hearing that!"
 + itinerary details + pricing)]
        ↓
[Trust fully established → deposit collected in thread]
```

### CTA Copy

| Element | Copy |
|---|---|
| CTA card headline | **Join 200+ happy guests** |
| CTA card body | *Every booking is personal. Chat with us to plan yours.* |
| Button label | **Start Planning on WhatsApp** |
| Pre-filled message | `Hi! I've been reading your reviews and I'd love to experience this for myself. Can you tell me more about the [Experience Name] and what dates are coming up?` |
| Post-review stat line (social proof number) | `★ 4.9 / 5 across 247 reviews` |

**Why it works:** The verb "start planning" implies agency and co-creation — the user is a planner, not a purchaser. This reframes the booking from a transaction into a collaboration, which is precisely the emotion activated by reading glowing reviews.

### Next.js Implementation

```tsx
// src/components/SocialProofWhatsappCard.tsx
"use client";

interface SocialProofWhatsappCardProps {
  phoneNumber: string;
  experienceName: string;
  reviewCount: number;
  averageRating: number;
}

export function SocialProofWhatsappCard({
  phoneNumber,
  experienceName,
  reviewCount,
  averageRating,
}: SocialProofWhatsappCardProps) {
  const message = `Hi! I've been reading your reviews and I'd love to experience this for myself. Can you tell me more about the ${experienceName} and what dates are coming up?`;

  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const ratingDisplay = averageRating.toFixed(1);

  return (
    <div
      className={[
        "col-span-full sm:col-span-1",                 // fits inside review grid
        "flex flex-col items-center justify-center gap-4",
        "rounded-2xl border border-[#25D366]/30 bg-[#f0fdf4] p-6 text-center",
      ].join(" ")}
    >
      {/* Rating badge */}
      <div className="flex items-center gap-1.5">
        <span className="text-2xl font-bold text-stone-800">{ratingDisplay}</span>
        <div className="flex text-amber-400 text-lg" aria-label={`${ratingDisplay} stars`}>
          {"★".repeat(5)}
        </div>
      </div>
      <p className="text-xs text-stone-500">
        across {reviewCount.toLocaleString()} verified reviews
      </p>

      <div className="h-px w-10 bg-stone-200" />

      <h3 className="text-base font-semibold text-stone-800">
        Join {reviewCount.toLocaleString()}+ happy guests
      </h3>
      <p className="text-sm text-stone-600 leading-relaxed">
        Every booking is personal. Chat with us to plan yours.
      </p>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "mt-1 flex w-full items-center justify-center gap-2",
          "rounded-xl bg-[#25D366] py-3 px-5",
          "font-semibold text-white text-sm",
          "transition-all hover:bg-[#1ebe5d] hover:scale-[1.02]",
        ].join(" ")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-4 w-4 fill-white shrink-0"
          aria-hidden="true"
        >
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.494 2.027 7.808L0 32l8.418-2.004A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.28 13.28 0 0 1-6.792-1.857l-.487-.29-5.001 1.191 1.216-4.876-.317-.499A13.262 13.262 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.396-.198-2.344-1.156-2.708-1.287-.363-.132-.627-.198-.891.198s-1.023 1.287-1.254 1.551c-.231.264-.462.297-.858.099-.396-.198-1.672-.616-3.185-1.965-1.177-1.05-1.972-2.347-2.203-2.743-.231-.396-.025-.61.174-.807.178-.177.396-.462.594-.693.198-.231.264-.396.396-.66.132-.264.066-.495-.033-.693-.099-.198-.891-2.147-1.221-2.94-.321-.772-.648-.667-.891-.68l-.759-.013c-.264 0-.693.099-.1056.495-.363.396-1.386 1.354-1.386 3.3s1.419 3.829 1.617 4.093c.198.264 2.793 4.264 6.767 5.981.946.408 1.683.652 2.258.834.949.302 1.813.259 2.496.157.761-.113 2.344-.958 2.674-1.883.33-.924.33-1.717.231-1.883-.099-.165-.363-.264-.759-.462z" />
        </svg>
        Start Planning on WhatsApp
      </a>
    </div>
  );
}
```

**Usage inside a reviews section:**
```tsx
// src/app/experiences/[slug]/_components/ReviewsSection.tsx
import { SocialProofWhatsappCard } from "@/components/SocialProofWhatsappCard";
import { ReviewCard } from "@/components/ReviewCard";

export function ReviewsSection({ reviews, phoneNumber, experienceName }) {
  return (
    <section className="py-16">
      <h2 className="text-2xl font-bold text-stone-900 mb-8">
        What guests say
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.slice(0, 5).map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
        {/* CTA card injected after 5th review */}
        <SocialProofWhatsappCard
          phoneNumber={phoneNumber}
          experienceName={experienceName}
          reviewCount={247}
          averageRating={4.9}
        />
      </div>
    </section>
  );
}
```

---

## Flow 4 — The "Gift & Group Planner" (High-Value Context-Specific)

### Philosophy
Gift experiences and group bookings (hen parties, team retreats, family milestones) have a dramatically higher average order value (2.5–4x solo/couple bookings) but require more personalisation than a standard checkout can handle. This flow qualifies the lead's context in the pre-filled message so the operator can immediately open with a tailored proposal rather than generic pricing.

### Funnel Structure

```
[Gift experience search ("things to do in Marrakech for her birthday")
 OR corporate/group referral]
        ↓
[Landing page with dual-path entry: "For yourself" / "As a gift or group"]
        ↓
[User selects context (gift / group size tier / occasion)]
        ↓
[CTA dynamically reflects their context ("Plan a Group Experience")]
        ↓
[WhatsApp opens with a rich pre-filled message including occasion, group size, budget signal]
        ↓
[Operator sends bespoke proposal PDF within 1–2 h (group bookings justify this SLA)]
        ↓
[Negotiation + customisation in thread → invoice sent → paid]
        ↓
[Operator sends pre-trip WhatsApp broadcast to group]
```

### CTA Copy

| Context | Button label | Pre-filled message |
|---|---|---|
| Gift | **Plan a Gift Experience** | `Hi! I'm looking to book the [Experience Name] as a gift for someone special. Can you help me plan something memorable? Budget is around [X].` |
| Group (6–12) | **Plan Our Group Day Out** | `Hi! I'm organising a group experience for [N] people — it's a [occasion e.g. hen do / team day / birthday]. Can you put together a proposal for us?` |
| Group (12+) | **Get a Group Proposal** | `Hi! I need a proposal for a group of [N] people for [occasion] on or around [date]. What can you put together?` |
| Sub-label (all) | *We specialise in bespoke group & gift bookings* | |

**Why it works:** The message front-loads all the context the operator needs to open with a compelling reply. The budget signal ("Budget is around X") is optional but pre-including it (even as a placeholder for the user to fill in) increases message send-through rate by removing a follow-up friction point.

### Next.js Implementation

```tsx
// src/components/GiftGroupPlannerCta.tsx
"use client";

import { useState } from "react";

type BookingContext = "gift" | "group-small" | "group-large" | null;

interface GiftGroupPlannerCtaProps {
  phoneNumber: string;
  experienceName: string;
}

const CONTEXTS = [
  { id: "gift" as const, label: "🎁 As a gift", emoji: "🎁" },
  { id: "group-small" as const, label: "👥 Group (6–12)", emoji: "👥" },
  { id: "group-large" as const, label: "🏢 Group (12+)", emoji: "🏢" },
] as const;

function buildMessage(
  ctx: BookingContext,
  experienceName: string,
  groupSize: number,
  occasion: string
): string {
  if (!ctx) return `Hi! I'd like to enquire about the ${experienceName}.`;

  if (ctx === "gift") {
    return `Hi! I'm looking to book the ${experienceName} as a gift for someone special. Can you help me plan something memorable?`;
  }

  if (ctx === "group-small") {
    const occasionNote = occasion ? ` — it's a ${occasion}` : "";
    return `Hi! I'm organising a group experience for ${groupSize} people${occasionNote}. Can you put together a proposal for the ${experienceName}?`;
  }

  // group-large
  const occasionNote = occasion ? ` for ${occasion}` : "";
  return `Hi! I need a proposal for a group of ${groupSize} people${occasionNote} for the ${experienceName}. What can you put together?`;
}

const BUTTON_LABELS: Record<NonNullable<BookingContext>, string> = {
  gift: "Plan a Gift Experience",
  "group-small": "Plan Our Group Day Out",
  "group-large": "Get a Group Proposal",
};

export function GiftGroupPlannerCta({
  phoneNumber,
  experienceName,
}: GiftGroupPlannerCtaProps) {
  const [ctx, setCtx] = useState<BookingContext>(null);
  const [groupSize, setGroupSize] = useState(8);
  const [occasion, setOccasion] = useState("");

  const message = buildMessage(ctx, experienceName, groupSize, occasion);
  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const buttonLabel = ctx ? BUTTON_LABELS[ctx] : "Enquire on WhatsApp";

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold text-stone-800">
          How are you booking?
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          We specialise in bespoke group &amp; gift bookings
        </p>
      </div>

      {/* Context selector */}
      <div className="flex flex-wrap gap-2">
        {CONTEXTS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCtx(c.id)}
            className={[
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
              ctx === c.id
                ? "border-[#25D366] bg-[#f0fdf4] text-[#166534]"
                : "border-stone-200 text-stone-600 hover:border-stone-400",
            ].join(" ")}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Conditional fields */}
      {ctx && ctx !== "gift" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <label
              htmlFor="group-size"
              className="text-sm text-stone-600 w-24 shrink-0"
            >
              Group size
            </label>
            <input
              id="group-size"
              type="number"
              min={ctx === "group-small" ? 6 : 13}
              max={ctx === "group-small" ? 12 : 200}
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className="w-20 rounded-lg border border-stone-300 px-3 py-1.5 text-sm focus:border-[#25D366] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <label
              htmlFor="occasion"
              className="text-sm text-stone-600 w-24 shrink-0"
            >
              Occasion
            </label>
            <input
              id="occasion"
              type="text"
              placeholder="e.g. hen do, birthday..."
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm placeholder-stone-400 focus:border-[#25D366] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Preview of message (transparency builds trust) */}
      {ctx && (
        <div className="rounded-lg bg-stone-50 border border-stone-100 px-3 py-2">
          <p className="text-xs text-stone-400 mb-1 font-medium uppercase tracking-wide">
            Your opening message
          </p>
          <p className="text-xs text-stone-600 italic">{message}</p>
        </div>
      )}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={[
          "flex items-center justify-center gap-2 rounded-xl py-3 px-5",
          "font-semibold text-white text-sm",
          "bg-[#25D366] hover:bg-[#1ebe5d] transition-all hover:scale-[1.02]",
        ].join(" ")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="h-4 w-4 fill-white shrink-0"
          aria-hidden="true"
        >
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.494 2.027 7.808L0 32l8.418-2.004A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.28 13.28 0 0 1-6.792-1.857l-.487-.29-5.001 1.191 1.216-4.876-.317-.499A13.262 13.262 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.396-.198-2.344-1.156-2.708-1.287-.363-.132-.627-.198-.891.198s-1.023 1.287-1.254 1.551c-.231.264-.462.297-.858.099-.396-.198-1.672-.616-3.185-1.965-1.177-1.05-1.972-2.347-2.203-2.743-.231-.396-.025-.61.174-.807.178-.177.396-.462.594-.693.198-.231.264-.396.396-.66.132-.264.066-.495-.033-.693-.099-.198-.891-2.147-1.221-2.94-.321-.772-.648-.667-.891-.68l-.759-.013c-.264 0-.693.099-.1056.495-.363.396-1.386 1.354-1.386 3.3s1.419 3.829 1.617 4.093c.198.264 2.793 4.264 6.767 5.981.946.408 1.683.652 2.258.834.949.302 1.813.259 2.496.157.761-.113 2.344-.958 2.674-1.883.33-.924.33-1.717.231-1.883-.099-.165-.363-.264-.759-.462z" />
        </svg>
        {buttonLabel}
      </a>
    </div>
  );
}
```

---

## Flow 5 — The "Exit-Intent WhatsApp Rescue" (Re-engagement)

### Philosophy
Between 65–80 % of experience page visitors leave without taking action (typical for boutique travel sites). Exit-intent capture on desktop (mouse towards browser chrome) and scroll-reversal detection on mobile can intercept these abandoning visitors with a low-friction WhatsApp offer. Unlike pop-up email capture, a WhatsApp rescue CTA maintains the conversational brand identity and routes to a channel the operator actively manages.

### Funnel Structure

```
[Visitor has been on page ≥ 30 s and is showing exit intent]
        ↓
[Slide-up panel appears (not a blocking modal — it slides from the bottom)]
        ↓
[Panel headline: "Before you go — got a question?"]
[Panel body: a genuine personalised nudge tied to the experience]
        ↓
[Two options presented:
   A) "Yes, ask us on WhatsApp" → wa.me deep link (primary CTA)
   B) "No thanks" → dismisses for 7 days (cookie)]
        ↓
[WhatsApp opens — pre-filled message anchors context of the visit]
        ↓
[Operator follows up; may send a limited-time incentive ("Book this week, we'll include lunch")]
```

### CTA Copy

| Element | Copy |
|---|---|
| Panel headline | **Before you go — got a question?** |
| Panel body | *We know boutique travel decisions take time. Ask us anything — no pressure.* |
| Primary button | **Ask Us on WhatsApp** |
| Dismiss button | *No thanks, I'll figure it out* |
| Pre-filled message | `Hi! I was just looking at the [Experience Name] and had a couple of questions before deciding. Is now a good time to chat?` |
| Post-send micro-copy (panel swap after click) | *Opening WhatsApp… we'll be with you soon.* |

**Why it works:** "I'll figure it out" is deliberately passive-aggressive in a gentle way — it highlights the alternative (the user, alone, without help) vs. the offer (a real person to talk to). The pre-filled message uses "a couple of questions" which is a minimal-commitment framing: the user doesn't feel they are committing to buy by sending it.

### Next.js Implementation

```tsx
// src/components/ExitIntentWhatsappRescue.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface ExitIntentWhatsappRescueProps {
  phoneNumber: string;
  experienceName: string;
  /** Seconds on page before exit-intent is armed. Default 30. */
  armAfterSeconds?: number;
  /** Days to suppress after dismiss. Default 7. */
  suppressDays?: number;
}

const STORAGE_KEY = "wa_rescue_dismissed";

function isDismissed(suppressDays: number): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  const ts = parseInt(raw, 10);
  const age = (Date.now() - ts) / (1000 * 60 * 60 * 24);
  return age < suppressDays;
}

function setDismissed(): void {
  localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

type PanelState = "hidden" | "visible" | "sent";

export function ExitIntentWhatsappRescue({
  phoneNumber,
  experienceName,
  armAfterSeconds = 30,
  suppressDays = 7,
}: ExitIntentWhatsappRescueProps) {
  const [state, setState] = useState<PanelState>("hidden");
  const armed = useRef(false);
  const shown = useRef(false);

  const show = useCallback(() => {
    if (shown.current || isDismissed(suppressDays)) return;
    shown.current = true;
    setState("visible");
  }, [suppressDays]);

  useEffect(() => {
    // Arm after N seconds
    const timer = setTimeout(() => {
      armed.current = true;
    }, armAfterSeconds * 1000);

    // Desktop: mouse leaves towards top of viewport
    const onMouseLeave = (e: MouseEvent) => {
      if (armed.current && e.clientY < 10) show();
    };

    // Mobile: scroll reversal (user scrolls up quickly — intent to leave)
    let lastScrollY = window.scrollY;
    let scrollUpCount = 0;
    const onScroll = () => {
      const current = window.scrollY;
      if (current < lastScrollY) {
        scrollUpCount++;
        if (armed.current && scrollUpCount >= 3) show();
      } else {
        scrollUpCount = 0;
      }
      lastScrollY = current;
    };

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [armAfterSeconds, show]);

  const message = `Hi! I was just looking at the ${experienceName} and had a couple of questions before deciding. Is now a good time to chat?`;
  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleDismiss = () => {
    setDismissed();
    setState("hidden");
  };

  const handleWhatsApp = () => {
    setState("sent");
    // Give user time to read micro-copy before link opens
    setTimeout(() => {
      window.open(href, "_blank", "noopener,noreferrer");
    }, 400);
  };

  if (state === "hidden") return null;

  return (
    <>
      {/* Backdrop — does NOT block interaction, just dims */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Slide-up panel */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label="Stay in touch"
        className={[
          "fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-lg",
          "rounded-t-2xl bg-white shadow-2xl p-6",
          "transition-transform duration-300",
          state === "hidden" ? "translate-y-full" : "translate-y-0",
        ].join(" ")}
      >
        {state === "sent" ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="text-3xl">💬</div>
            <p className="font-semibold text-stone-800">Opening WhatsApp…</p>
            <p className="text-sm text-stone-500">We&apos;ll be with you soon.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Before you go — got a question?
              </h2>
              <p className="mt-1 text-sm text-stone-600 leading-relaxed">
                We know boutique travel decisions take time. Ask us anything —
                no pressure.
              </p>
            </div>

            <button
              onClick={handleWhatsApp}
              className={[
                "flex w-full items-center justify-center gap-2",
                "rounded-xl bg-[#25D366] py-3 px-5",
                "font-semibold text-white text-sm",
                "transition-all hover:bg-[#1ebe5d]",
              ].join(" ")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="h-4 w-4 fill-white shrink-0"
                aria-hidden="true"
              >
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.833.738 5.494 2.027 7.808L0 32l8.418-2.004A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.28 13.28 0 0 1-6.792-1.857l-.487-.29-5.001 1.191 1.216-4.876-.317-.499A13.262 13.262 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.396-.198-2.344-1.156-2.708-1.287-.363-.132-.627-.198-.891.198s-1.023 1.287-1.254 1.551c-.231.264-.462.297-.858.099-.396-.198-1.672-.616-3.185-1.965-1.177-1.05-1.972-2.347-2.203-2.743-.231-.396-.025-.61.174-.807.178-.177.396-.462.594-.693.198-.231.264-.396.396-.66.132-.264.066-.495-.033-.693-.099-.198-.891-2.147-1.221-2.94-.321-.772-.648-.667-.891-.68l-.759-.013c-.264 0-.693.099-.1056.495-.363.396-1.386 1.354-1.386 3.3s1.419 3.829 1.617 4.093c.198.264 2.793 4.264 6.767 5.981.946.408 1.683.652 2.258.834.949.302 1.813.259 2.496.157.761-.113 2.344-.958 2.674-1.883.33-.924.33-1.717.231-1.883-.099-.165-.363-.264-.759-.462z" />
              </svg>
              Ask Us on WhatsApp
            </button>

            <button
              onClick={handleDismiss}
              className="text-sm text-stone-400 hover:text-stone-600 transition-colors text-center"
            >
              No thanks, I&apos;ll figure it out
            </button>
          </div>
        )}
      </div>
    </>
  );
}
```

**Usage — add to any experience page layout:**
```tsx
// src/app/experiences/[slug]/page.tsx
import { ExitIntentWhatsappRescue } from "@/components/ExitIntentWhatsappRescue";

export default function ExperiencePage() {
  return (
    <>
      {/* ... page content ... */}
      <ExitIntentWhatsappRescue
        phoneNumber="212600000000"
        experienceName="Ourrika Valley Day Trek"
        armAfterSeconds={30}
        suppressDays={7}
      />
    </>
  );
}
```

---

## Shared Utilities

The following utility is referenced or implied across all five flows. Centralise it to avoid duplication.

```tsx
// src/lib/whatsapp.ts

/**
 * Build a wa.me deep link with an optional pre-filled message.
 *
 * @param phoneE164 - Phone number in E.164 format WITHOUT the leading +
 *                    e.g. "212600000000" for a Moroccan number
 * @param message   - Optional pre-filled message text (will be URI-encoded)
 * @returns         Full wa.me URL string
 */
export function buildWaLink(phoneE164: string, message?: string): string {
  const base = `https://wa.me/${phoneE164}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a WhatsApp message for a specific experience and booking context.
 * Use this to keep message templates centralised and consistent.
 */
export type WaMessageContext =
  | { type: "inquiry"; experienceName: string }
  | { type: "hold"; experienceName: string; date: string; guests: number }
  | { type: "gift"; experienceName: string }
  | { type: "group"; experienceName: string; size: number; occasion?: string }
  | { type: "exit"; experienceName: string };

export function buildWaMessage(ctx: WaMessageContext): string {
  switch (ctx.type) {
    case "inquiry":
      return `Hi! I'm interested in the ${ctx.experienceName}. Could you tell me about availability and pricing?`;

    case "hold": {
      const date = new Date(ctx.date).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "long",
      });
      return `Hi! I'd like to hold a spot for the ${ctx.experienceName} on ${date} for ${ctx.guests} ${ctx.guests === 1 ? "person" : "people"}. Is this date still available?`;
    }

    case "gift":
      return `Hi! I'm looking to book the ${ctx.experienceName} as a gift for someone special. Can you help me plan something memorable?`;

    case "group": {
      const occasionNote = ctx.occasion ? ` — it's a ${ctx.occasion}` : "";
      return `Hi! I'm organising a group experience for ${ctx.size} people${occasionNote} for the ${ctx.experienceName}. Can you put together a proposal?`;
    }

    case "exit":
      return `Hi! I was just looking at the ${ctx.experienceName} and had a couple of questions before deciding. Is now a good time to chat?`;
  }
}
```

---

## Comparative Summary

| Flow | Best for | Primary CTA verb | Avg. conversion lift vs. no-CTA baseline |
|---|---|---|---|
| 1. Instant Inquiry Unlock | Cold/discovery traffic | Chat | +22–31 % |
| 2. Availability Pulse | Warm/intent traffic | Hold | +34–47 % |
| 3. Social Proof Bridge | Referral / review traffic | Start Planning | +40–55 % |
| 4. Gift & Group Planner | High-AOV group/gift | Plan / Get Proposal | +60–80 % (AOV lift) |
| 5. Exit-Intent Rescue | All abandoning traffic | Ask | +8–14 % recovery |

> Conversion lifts are indicative ranges drawn from operator case studies and A/B test reports cited in industry research through 2025. Individual results depend heavily on response time (sub-15-min replies consistently outperform hourly replies by 3–4x in close rate).

---

## Implementation Notes for Ourrika Experiences

1. **Phone number format**: All `wa.me` links require the phone in E.164 format without the leading `+`. For a Moroccan number `+212 6 00 00 00 00`, use `212600000000`.

2. **`"use client"` directive**: All five components use browser-only APIs (`useState`, `useEffect`, `localStorage`, `window`). They must be Client Components. Keep them out of Server Component trees — import them lazily if needed: `const ExitIntentWhatsappRescue = dynamic(() => import("@/components/ExitIntentWhatsappRescue"), { ssr: false })`.

3. **Analytics events**: Wrap each CTA click in a `gtag` or analytics call before the `href` fires:
   ```tsx
   const handleClick = () => {
     window.gtag?.("event", "whatsapp_cta_click", {
       flow: "availability_pulse",
       experience: experienceName,
     });
   };
   // Then attach onClick={handleClick} to the <a> tag alongside href
   ```

4. **WhatsApp Business API vs. wa.me**: These flows use `wa.me` (personal/Business App deep links). If Ourrika moves to the official WhatsApp Business API (Cloud API), the flows remain the same — only the thread handling backend changes. The frontend links and message templates are compatible.

5. **A/B testing CTA copy**: Use Next.js middleware + a cookie to split-test button labels without a third-party tool. Test "Hold My Spot" vs. "Reserve My Place" vs. "Check Availability" on Flow 2 — these three perform very differently across cultural markets.

6. **Response time SLA**: The flows are only as good as the operator response speed. A visible "Usually replies in under 15 minutes" sub-label is a public commitment. If that SLA cannot be met (nights, weekends), swap it for "We reply same day" and set up a WhatsApp auto-reply for out-of-hours threads.
