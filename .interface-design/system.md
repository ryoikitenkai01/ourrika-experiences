# Ourrika Experiences — Interface Design System

## Design Tokens

### Color Palette
| Token | Value | Usage |
|-------|-------|-------|
| Primary text | `#1A1A1A` | All body text on light backgrounds |
| Secondary text | `#5c605d` | Section subtitles, descriptions, meta |
| Muted text | `#9d9d9b` | Copyright, timestamps, placeholder |
| Terracotta accent | `#C56B5C` | Hover states, badges, accents |
| Sand background | `#F5EFE4` | Section backgrounds, modal bg |
| Border | `rgba(224, 214, 200, 0.4)` | Card borders, dividers |

### Typography
| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Headline | Noto Serif | font-light | Italic for pull-quotes |
| Body | Manrope | font-normal | All UI text |
| Eyebrow/label | Manrope | font-normal | `text-[11px] tracking-[0.2em] uppercase text-[#5c605d]` |

### Button Variants
```
Primary CTA:
  bg-[#1A1A1A] text-white hover:bg-[#C56B5C]
  transition-colors duration-300 rounded-none
  px-6 py-3 text-[13px] tracking-[0.15em] uppercase font-sans

Secondary/Ghost:
  border border-[#1A1A1A] text-[#1A1A1A]
  hover:bg-[#1A1A1A] hover:text-white
  transition-colors duration-300 rounded-none
  px-6 py-3 text-[13px] tracking-[0.15em] uppercase font-sans

WhatsApp Button:
  bg-[#C56B5C] text-white hover:bg-[#1A1A1A]
  Same sizing as primary
```
**Rule:** `rounded-none` on every button — no exceptions.

### Card Rules
```
Border:    border border-[rgba(224,214,200,0.4)]
Shadow:    shadow-sm only — no shadow-lg or shadow-xl on hover
Hover:     scale 1→1.02, duration 0.3s (Framer Motion whileHover)
Image gradient: bg-gradient-to-t from-black/50 to-transparent
Padding:   p-6 everywhere
```

### Section Spacing
```
Vertical padding: py-24 md:py-36
Max content width: max-w-7xl mx-auto px-6 md:px-12
Heading rhythm:
  mb-4  — eyebrow before title
  mb-3  — title before description
  mb-6  — description before content
```

### Animation Tokens
```
Fade-in standard:
  initial: { opacity: 0, y: 16 }
  animate: { opacity: 1, y: 0 }
  duration: 0.5
  ease: "easeOut"

Stagger:
  delay: index * 0.08
  max total: 0.4s

Card hover:
  whileHover: { scale: 1.02 }
  transition: { duration: 0.3 }

Page transition:
  opacity 0→1, duration 0.4s

NO x-axis (horizontal) animations anywhere — use y: 16→0 only.
```

### Overlay / Modal
```
Modal background:  bg-[#F5EFE4]/90 backdrop-blur-md
Modal border:      border border-[rgba(224,214,200,0.6)]
Backdrop:          bg-black/30 backdrop-blur-sm
Form input focus:  border-[#C56B5C]/40 — no blue glow
```

### Text on Images
```
White text over images:
  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
Price text:
  font-serif italic text-[#1A1A1A]
```

## Anti-Patterns to Avoid
- `rounded` or `rounded-*` on buttons (always `rounded-none`)
- `shadow-lg` / `shadow-xl` on cards
- Horizontal (x) Framer Motion animations
- `text-gray-400` or `text-gray-500` for body text on white — use `#5c605d`
- Animation durations > 0.5s for content fade-ins
- Stagger delay > 0.4s total
- `bg-[#25D366]` (WhatsApp green) — use `bg-[#C56B5C]` instead

## Files Governed
All components under `src/components/` public-facing:
- layout/Navbar.tsx, layout/Footer.tsx
- home/Hero.tsx, home/FeaturedExperiences.tsx, home/Destinations.tsx
- home/Philosophy.tsx, home/Newsletter.tsx, home/Partners.tsx
- ui/Button.tsx, ui/PremiumCard.tsx, ui/BookingModal.tsx
- ui/DetailPageBlocks.tsx, ui/PageHero.tsx, ui/WhatsAppButton.tsx
- ui/ExperienceBookingClient.tsx, ui/DestinationBookingClient.tsx
- ui/OfferBookingClient.tsx, ui/RelatedSections.tsx
- listings/ListingClients.tsx, listings/BlogListingClient.tsx
