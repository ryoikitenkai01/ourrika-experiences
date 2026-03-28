"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ExperienceCard } from "@/lib/types/ui";
import { CardSkeleton } from "@/components/ui/Skeleton";

interface FeaturedExperiencesProps {
  experiences: ExperienceCard[];
}

function ExperienceCardItem({
  exp,
  index,
}: {
  exp: ExperienceCard;
  index: number;
}) {
  const isFeatured = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className={`relative flex flex-col bg-[var(--color-surface)] overflow-hidden group shadow-premium ${
        isFeatured
          ? "border border-[var(--color-gold)]/35"
          : "border border-white/[0.04]"
      }`}
    >
      <Link href={`/experiences/${exp.slug}`} className="absolute inset-0 z-20" aria-label={`Book ${exp.title}`} />
      
      <div className="relative h-52 overflow-hidden">
        {exp.image && (
          <Image
            src={exp.image}
            alt={exp.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {isFeatured && (
          <div className="absolute top-3 left-3 bg-[var(--color-gold)] text-[var(--color-obsidian)] font-sans text-[7px] font-bold tracking-[0.15em] uppercase px-2 py-1">
            Featured
          </div>
        )}

        {isFeatured && (
          <div className="absolute top-3 right-3 bg-[var(--color-terracotta)] text-[var(--color-sand-light)] font-sans text-[7px] font-semibold tracking-[0.1em] uppercase px-2 py-1">
            High demand
          </div>
        )}

        {(exp.location || exp.duration) && (
          <span className="absolute bottom-3 left-3 font-sans text-[8px] uppercase tracking-[0.15em] text-[var(--color-sand-light)]/60">
            {[exp.location, exp.duration].filter(Boolean).join(" · ")}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <p className="font-serif italic text-[15px] text-[var(--color-sand-light)] mb-2">{exp.title}</p>
          {exp.short_description && (
            <p className="font-sans text-[9px] text-[var(--color-sand-light)]/40 leading-relaxed mb-3 line-clamp-2">
              {exp.short_description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          {exp.price != null ? (
            <span className="font-serif text-[16px] text-[var(--color-gold)]">
              {exp.price.toLocaleString()}
              <span className="font-sans text-[10px] opacity-70 ml-1">{exp.currency}</span>
            </span>
          ) : (
            <span className="font-sans text-[10px] text-[var(--color-charcoal-light)] uppercase tracking-wide">
              On request
            </span>
          )}

          <span className="bg-[var(--color-terracotta)] text-[var(--color-sand-light)] font-sans text-[8px] font-semibold tracking-[0.12em] uppercase px-4 py-2 group-hover:bg-[var(--color-terracotta-dark)] transition-colors">
            Book Now
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedExperiences({ experiences }: FeaturedExperiencesProps) {
  return (
    <section id="experiences" className="py-24 bg-[var(--color-obsidian)]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1920px]">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4">
          <div>
            <div className="w-7 h-px bg-[var(--color-gold)] mb-4" />
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="font-serif italic text-4xl text-[var(--color-sand-light)]"
            >
              Featured Experiences
            </motion.h2>
          </div>
          <Link
            href="/experiences"
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-[var(--color-terracotta)] hover:opacity-70 transition-opacity"
          >
            View all →
          </Link>
        </div>

        {experiences.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} className="h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.slice(0, 3).map((exp, index) => (
              <ExperienceCardItem
                key={exp.id}
                exp={exp}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
