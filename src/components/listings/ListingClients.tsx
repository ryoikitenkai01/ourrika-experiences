"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { PremiumCard } from "@/components/ui/PremiumCard";

// ── Destinations Listing ─────────────────────────────────────────────────────

import type { DestinationCard } from "@/lib/types/ui";

interface DestinationsListingProps {
  destinations: DestinationCard[];
}

export function DestinationsListing({ destinations }: DestinationsListingProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return destinations;
    const q = query.toLowerCase();
    return destinations.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.short_description ?? "").toLowerCase().includes(q)
    );
  }, [query, destinations]);

  return (
    <div>
      {/* Search */}
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <SearchBar
          placeholder="Search destinations..."
          onSearch={setQuery}
        />
        <p className="font-sans text-sm text-gray-400 tracking-wide">
          {filtered.length} destination{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState message={query ? `No destinations found for "${query}"` : "No destinations yet."} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((dest, i) => (
            <PremiumCard
              key={dest.id}
              id={dest.id}
              href={`/destinations/${dest.slug}`}
              image={dest.image}
              title={dest.name}
              subtitle={
                dest.starting_price != null
                  ? `From ${dest.starting_price.toLocaleString()} ${dest.currency}`
                  : undefined
              }
              description={dest.short_description}
              ctaLabel="Discover"
              index={i}
            />
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

export function ExperiencesListing({ experiences }: ExperiencesListingProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return experiences;
    const q = query.toLowerCase();
    return experiences.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q) ||
        (e.short_description ?? "").toLowerCase().includes(q)
    );
  }, [query, experiences]);

  return (
    <div>
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <SearchBar
          placeholder="Search experiences..."
          onSearch={setQuery}
        />
        <p className="font-sans text-sm text-gray-400 tracking-wide">
          {filtered.length} experience{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={query ? `No experiences found for "${query}"` : "No experiences yet."} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exp, i) => (
            <PremiumCard
              key={exp.id}
              id={exp.id}
              href={`/experiences/${exp.slug}`}
              image={exp.image}
              title={exp.title}
              subtitle={[
                exp.location,
                exp.duration,
                exp.price != null ? `From ${exp.price.toLocaleString()} ${exp.currency}` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
              description={exp.short_description}
              ctaLabel="Explore"
              index={i}
            />
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
      <p className="font-serif text-2xl text-[var(--color-charcoal)] mb-2">Nothing here yet</p>
      <p className="font-sans text-sm text-gray-400">{message}</p>
    </div>
  );
}
