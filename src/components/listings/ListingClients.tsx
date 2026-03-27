"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// ── Destinations Listing ─────────────────────────────────────────────────────

import type { DestinationCard } from "@/lib/types/ui";

interface DestinationsListingProps {
  destinations: DestinationCard[];
}

function DarkDestinationCard({
  dest,
  index,
  isHero,
}: {
  dest: DestinationCard;
  index: number;
  isHero: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className={`relative overflow-hidden bg-[var(--color-surface)] border border-white/[0.06] flex flex-col ${
        isHero ? "col-span-full" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${isHero ? "h-64 md:h-80" : "h-44"}`}>
        {dest.image && (
          <Image
            src={dest.image}
            alt={dest.name}
            fill
            sizes={isHero ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {isHero && (
          <div className="absolute bottom-6 left-6 z-10">
            <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-[var(--color-gold)] mb-2">
              Morocco
            </p>
            <h2 className="font-serif italic text-3xl text-[var(--color-sand-light)]">{dest.name}</h2>
          </div>
        )}

        {isHero && (
          <div className="absolute bottom-6 right-6 z-10">
            <Link
              href={`/destinations/${dest.slug}`}
              className="border border-[var(--color-gold)]/50 text-[var(--color-gold)] font-sans text-[9px] tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-[var(--color-gold)]/10 transition-colors"
            >
              Explore →
            </Link>
          </div>
        )}
      </div>

      {!isHero && (
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="font-serif italic text-[17px] text-[var(--color-sand-light)]">{dest.name}</p>
            {dest.short_description && (
              <p className="font-sans text-[9px] text-[var(--color-sand-light)]/40 mt-1 line-clamp-1">
                {dest.short_description}
              </p>
            )}
          </div>
          <Link
            href={`/destinations/${dest.slug}`}
            className="ml-4 shrink-0 border border-[var(--color-gold)]/40 text-[var(--color-gold)] font-sans text-[8px] tracking-[0.12em] uppercase px-3.5 py-2 hover:bg-[var(--color-gold)]/10 transition-colors"
          >
            Explore →
          </Link>
        </div>
      )}
    </motion.div>
  );
}

export function DestinationsListing({ destinations }: DestinationsListingProps) {
  return (
    <div>
      {destinations.length === 0 ? (
        <EmptyState message="No destinations yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {destinations.map((dest, i) => (
            <DarkDestinationCard key={dest.id} dest={dest} index={i} isHero={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Experiences Listing ──────────────────────────────────────────────────────

import type { ExperienceCard } from "@/lib/types/ui";

interface ExperiencesListingProps {
  experiences: ExperienceCard[];
}

type FilterKey = "All" | "Desert" | "City" | "Mountains" | "Under 100€";

const FILTERS: FilterKey[] = ["All", "Desert", "City", "Mountains", "Under 100€"];

function matchesFilter(exp: ExperienceCard, filter: FilterKey): boolean {
  if (filter === "All") return true;
  if (filter === "Under 100€") return exp.price != null && exp.price < 100;
  const loc = (exp.location ?? "").toLowerCase();
  if (filter === "Desert") return /desert|agafay|sahara/i.test(loc);
  if (filter === "City") return /marrakech|city|medina|fes|casablanca|rabat/i.test(loc);
  if (filter === "Mountains") return /atlas|mountain|mountains/i.test(loc);
  return true;
}

function DarkExperienceCard({ exp, index }: { exp: ExperienceCard; index: number }) {
  const isFeatured = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.06, duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col bg-[var(--color-surface)] overflow-hidden ${
        isFeatured
          ? "border border-[var(--color-gold)]/35"
          : "border border-white/[0.06]"
      }`}
    >
      <div className="relative h-40 overflow-hidden">
        {exp.image && (
          <Image
            src={exp.image}
            alt={exp.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {isFeatured && (
          <>
            <div className="absolute top-2.5 left-2.5 bg-[var(--color-gold)] text-[var(--color-obsidian)] font-sans text-[7px] font-bold tracking-[0.15em] uppercase px-2 py-1">
              Featured
            </div>
            <div className="absolute top-2.5 right-2.5 bg-[var(--color-terracotta)] text-white font-sans text-[7px] font-semibold tracking-[0.1em] uppercase px-2 py-1">
              High demand
            </div>
          </>
        )}

        {(exp.location || exp.duration) && (
          <span className="absolute bottom-2.5 left-2.5 font-sans text-[8px] uppercase tracking-[0.12em] text-[var(--color-sand-light)]/60">
            {[exp.location, exp.duration].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <p className="font-serif italic text-[15px] text-[var(--color-sand-light)] mb-1.5">{exp.title}</p>
          {exp.short_description && (
            <p className="font-sans text-[9px] text-[var(--color-sand-light)]/40 leading-relaxed mb-2.5 line-clamp-2">
              {exp.short_description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          {exp.price != null ? (
            <span className="font-serif text-[16px] text-[var(--color-gold)]">
              {exp.price.toLocaleString()}
              <span className="font-sans text-[10px] opacity-70 ml-1">{exp.currency}</span>
            </span>
          ) : (
            <span className="font-sans text-[9px] text-[var(--color-charcoal-light)] uppercase tracking-wide">
              On request
            </span>
          )}

          <Link
            href={`/experiences/${exp.slug}`}
            className="bg-[var(--color-terracotta)] text-white font-sans text-[8px] font-semibold tracking-[0.12em] uppercase px-3.5 py-2 hover:bg-[var(--color-terracotta-dark)] transition-colors"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function ExperiencesListing({ experiences }: ExperiencesListingProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");

  const filtered = useMemo(
    () => experiences.filter((e) => matchesFilter(e, activeFilter)),
    [experiences, activeFilter]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 pb-5 border-b border-white/[0.06]">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`font-sans text-[9px] tracking-[0.1em] uppercase px-4 py-1.5 transition-colors ${
              activeFilter === f
                ? "bg-[var(--color-terracotta)] text-white"
                : "border border-white/[0.1] text-[var(--color-sand-light)]/50 hover:text-[var(--color-sand-light)] hover:border-white/[0.25]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No activities found for this filter." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((exp, i) => (
            <DarkExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Shared Empty State ───────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-px bg-[var(--color-terracotta)] mx-auto mb-6" />
      <p className="font-serif text-2xl text-[var(--color-sand-light)] mb-2">Nothing here yet</p>
      <p className="font-sans text-sm text-[var(--color-charcoal-light)]">{message}</p>
    </div>
  );
}
