/**
 * Reusable detail-page building blocks.
 *
 * Components exported:
 *   HeroSectionDetail  — full-bleed hero for all detail pages
 *   GalleryBlock       — responsive masonry gallery from an image array
 *   HighlightsBlock    — "What's included" checklist for experience pages
 *   CTASection         — bottom CTA band with optional WhatsApp + primary action
 */

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, MessageCircle, MapPin, Clock } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

// ── Helpers ──────────────────────────────────────────────────────────────────

function ImageWithFallback({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);

  return (
    <div className={className}>
      {!error ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-sand)] to-[var(--color-sand-dark)] flex items-center justify-center">
            <span className="text-[var(--color-charcoal-light)] font-serif text-xs opacity-20 italic">Ourrika</span>
        </div>
      )}
    </div>
  );
}

// ── HeroSectionDetail ─────────────────────────────────────────────────────────

export interface HeroSectionDetailProps {
  image: string | null;
  /** Optional video URL (Firebase Storage or direct). Plays muted/looped behind the image. */
  video?: string | null;
  title: string;
  subtitle?: string | null;
  backHref: string;
  backLabel: string;
  /** Extra content rendered in the hero bottom area (e.g. meta chips) */
  children?: React.ReactNode;
  /** Height class, default "h-[75vh] min-h-[460px]" */
  heightClass?: string;
}

export function HeroSectionDetail({
  image,
  video,
  title,
  subtitle,
  backHref,
  backLabel,
  children,
  heightClass = "h-[75vh] min-h-[460px]",
}: HeroSectionDetailProps) {
  const [error, setError] = useState(false);

  return (
    <section className={`relative ${heightClass} bg-[var(--color-charcoal)]`}>
      {/* Video background — image acts as poster frame while video loads */}
      {video ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={image ?? undefined}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={video} />
        </video>
      ) : image && !error && (
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onError={() => setError(true)}
        />
      )}
      {/* Multi-layer gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/25 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

      {/* Back link */}
      <Link
        href={backHref}
        className="absolute top-28 left-6 lg:left-12 flex items-center gap-2 text-[var(--color-sand-light)]/70 hover:text-[var(--color-sand-light)] text-xs font-sans tracking-widest uppercase transition-colors z-10 group"
      >
        <ArrowLeft
          size={14}
          className="transition-transform group-hover:-translate-x-1"
        />
        {backLabel}
      </Link>

      {/* Text block */}
      <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-10 lg:pb-14 z-10 max-w-5xl">
        <div className="w-10 h-px bg-[var(--color-terracotta)] mb-5" />
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[var(--color-sand-light)] leading-tight mb-4" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-[var(--color-sand-light)]/70 text-sm tracking-[0.2em] uppercase mb-4" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

// ── GalleryBlock ──────────────────────────────────────────────────────────────

export interface GalleryBlockProps {
  images: string[];
  altPrefix: string;
  title?: string;
}

export function GalleryBlock({
  images,
  altPrefix,
  title = "Gallery",
}: GalleryBlockProps) {
  if (!images.length) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-8 h-px bg-[var(--color-terracotta)]" />
        <h2 className="font-serif text-2xl text-[var(--color-sand-light)]">
          {title}
        </h2>
      </div>
      {/* Masonry-style: first image is large, rest are square */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3">
        {images.map((img, i) => (
          <ImageWithFallback
             key={i}
             src={img}
             alt={`${altPrefix} — photo ${i + 1}`}
             className={`relative overflow-hidden bg-[var(--color-surface)] group ${
              i === 0
                ? "col-span-2 row-span-2 aspect-[4/3]"
                : "aspect-square"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ── HighlightsBlock ───────────────────────────────────────────────────────────

export interface HighlightsBlockProps {
  highlights: string[];
  title?: string;
}

export function HighlightsBlock({
  highlights,
  title = "What's included",
}: HighlightsBlockProps) {
  if (!highlights.length) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-8 h-px bg-[var(--color-terracotta)]" />
        <h2 className="font-serif text-2xl text-[var(--color-sand-light)]">{title}</h2>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {highlights.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 font-sans text-sm text-[var(--color-sand-light)]/70"
          >
            <CheckCircle2
              size={16}
              className="text-[var(--color-terracotta)] shrink-0 mt-0.5"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── CTASection ────────────────────────────────────────────────────────────────

export interface CTASectionProps {
  /** Primary button label and handler */
  primaryLabel: string;
  onPrimary?: () => void;
  primaryHref?: string;
  /** WhatsApp URL — renders a green WhatsApp button */
  whatsappUrl?: string;
  whatsappLabel?: string;
  /** Trust note below buttons */
  note?: string;
}

/**
 * Vertical CTA stack — primary action + optional WhatsApp link.
 * Pass `onPrimary` for a button (opens modal); pass `primaryHref` for a link.
 */
export function CTASection({
  primaryLabel,
  onPrimary,
  primaryHref,
  whatsappUrl,
  whatsappLabel = "Book on WhatsApp",
  note,
}: CTASectionProps) {
  return (
    <div className="flex flex-col gap-3">
      {onPrimary ? (
        <button
          onClick={onPrimary}
          className="flex items-center justify-center gap-2 h-12 bg-[var(--color-surface)] text-[var(--color-sand-light)] font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[var(--color-terracotta)] transition-colors duration-300 rounded-none"
        >
          {primaryLabel}
        </button>
      ) : primaryHref ? (
        <Link
          href={primaryHref}
          className="flex items-center justify-center gap-2 h-12 bg-[var(--color-surface)] text-[var(--color-sand-light)] font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[var(--color-terracotta)] transition-colors duration-300 rounded-none"
        >
          {primaryLabel}
        </Link>
      ) : null}

      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-12 bg-[var(--color-terracotta)] text-[var(--color-sand-light)] font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[var(--color-surface)] transition-colors duration-300 rounded-none"
        >
          <MessageCircle size={15} />
          {whatsappLabel}
        </a>
      )}

      {note && (
        <p className="font-sans text-[11px] text-[var(--color-charcoal-light)] text-center leading-relaxed">
          {note}
        </p>
      )}
    </div>
  );
}
// ── ExperienceMeta ───────────────────────────────────────────────────────────

export interface ExperienceMetaProps {
  location?: string | null;
  duration?: string | null;
  price?: number | null;
  currency?: string;
}

/**
 * Frosted-glass meta chips shown in the hero area of an experience page.
 * Renders location, duration, and price pills inline.
 */
export function ExperienceMeta({ location, duration, price, currency }: ExperienceMetaProps) {
  const items = [
    location ? { icon: <MapPin size={11} />, label: location } : null,
    duration ? { icon: <Clock size={11} />, label: duration } : null,
    price != null
      ? { icon: null, label: `From ${price.toLocaleString()} ${currency ?? ""}`, highlight: true }
      : null,
  ].filter(Boolean) as Array<{ icon: React.ReactNode; label: string; highlight?: boolean }>;

  if (!items.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 font-sans text-xs tracking-widest uppercase">
      {items.map((item, i) => (
        <span
          key={i}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm ${
            item.highlight
              ? "bg-[var(--color-terracotta)]/90 text-[var(--color-sand-light)] font-semibold"
              : "bg-[var(--color-sand-light)]/10 backdrop-blur-sm text-[var(--color-sand-light)]/70"
          }`}
        >
          {item.icon}
          {item.label}
        </span>
      ))}
    </div>
  );
}

// ── RichContentSection ────────────────────────────────────────────────────────

export interface RichContentSectionProps {
  shortDescription?: string | null;
  fullDescription?: string | null;
  emptyMessage?: string;
}

/**
 * Editorial content section: serif pull-quote (short_description)
 * followed by body text (full_description).
 * Used consistently across Experience, Destination, and Offer detail pages.
 */
export function RichContentSection({
  shortDescription,
  fullDescription,
  emptyMessage = "Full details coming soon.",
}: RichContentSectionProps) {
  return (
    <>
      {shortDescription && (
        <p className="font-serif text-xl md:text-2xl text-[var(--color-sand-light)] leading-relaxed mb-10 border-l-2 border-[var(--color-terracotta)] pl-6 py-1">
          {shortDescription}
        </p>
      )}
      {fullDescription && (
        <div className="font-sans text-base text-[var(--color-sand-light)]/70 leading-[1.85] whitespace-pre-line">
          {fullDescription}
        </div>
      )}
      {!shortDescription && !fullDescription && (
        <p className="text-[var(--color-charcoal-light)] italic font-sans">{emptyMessage}</p>
      )}
    </>
  );
}

// ── ArticleContent ────────────────────────────────────────────────────────────

export interface ArticleContentProps {
  excerpt?: string | null;
  body?: string | null;
  /** Back/forward nav links at the bottom */
  backHref?: string;
  backLabel?: string;
  forwardHref?: string;
  forwardLabel?: string;
}

/**
 * Blog article reading layout: excerpt as pull-quote, body text,
 * and optional two-directional footer nav.
 * Constrains width to 680px for comfortable reading.
 */
export function ArticleContent({
  excerpt,
  body,
  backHref,
  backLabel,
  forwardHref,
  forwardLabel,
}: ArticleContentProps) {
  return (
    <article className="py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-[680px] mx-auto">
          {excerpt && (
            <p className="font-serif text-xl md:text-2xl text-[var(--color-sand-light)] leading-relaxed mb-10 border-l-2 border-[var(--color-terracotta)] pl-6 py-1">
              {excerpt}
            </p>
          )}
          {body ? (
            <div
              className="prose prose-invert prose-sm md:prose-base !max-w-none text-[var(--color-sand-light)]/70 font-sans leading-relaxed transition-all"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body) }}
            />
          ) : (
            <p className="text-[var(--color-charcoal-light)] italic font-sans">Full article coming soon.</p>
          )}

          {(backHref || forwardHref) && (
            <div className="mt-16 pt-10 border-t border-white/10 flex items-center justify-between">
              {backHref && backLabel && (
                <Link
                  href={backHref}
                  className="group inline-flex items-center gap-2 text-[var(--color-sand-light)] font-sans text-xs tracking-widest uppercase hover:text-[var(--color-terracotta)] transition-colors"
                >
                  <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
                  {backLabel}
                </Link>
              )}
              {forwardHref && forwardLabel && (
                <Link
                  href={forwardHref}
                  className="group inline-flex items-center gap-2 text-[var(--color-sand-light)] font-sans text-xs tracking-widest uppercase hover:text-[var(--color-terracotta)] transition-colors ml-auto"
                >
                  {forwardLabel}
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
