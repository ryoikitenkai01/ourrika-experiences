"use client";

import { motion } from "framer-motion";
import { PremiumCard, BlogCard } from "@/components/ui/PremiumCard";
import type { ExperienceCard, DestinationCard, BlogPost } from "@/lib/types/ui";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// ── RelatedExperiences ────────────────────────────────────────────────────────

interface RelatedExperiencesProps {
  experiences: ExperienceCard[];
  title?: string;
  viewAllHref?: string;
}

export function RelatedExperiences({
  experiences,
  title = "Related Experiences",
  viewAllHref = "/experiences",
}: RelatedExperiencesProps) {
  if (!experiences.length) return null;

  return (
    <RelatedSection title={title} viewAllHref={viewAllHref}>
      {experiences.slice(0, 3).map((exp, i) => (
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
    </RelatedSection>
  );
}

// ── RelatedDestinations ───────────────────────────────────────────────────────

interface RelatedDestinationsProps {
  destinations: DestinationCard[];
  title?: string;
}

export function RelatedDestinations({
  destinations,
  title = "Discover More Destinations",
}: RelatedDestinationsProps) {
  if (!destinations.length) return null;

  return (
    <RelatedSection title={title} viewAllHref="/destinations">
      {destinations.slice(0, 3).map((dest, i) => (
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
    </RelatedSection>
  );
}

// ── RelatedBlogPosts ──────────────────────────────────────────────────────────

interface RelatedBlogPostsProps {
  posts: BlogPost[];
  title?: string;
}

export function RelatedBlogPosts({
  posts,
  title = "From the Journal",
}: RelatedBlogPostsProps) {
  if (!posts.length) return null;

  return (
    <RelatedSection title={title} viewAllHref="/journal">
      {posts.slice(0, 3).map((post, i) => (
        <BlogCard
          key={post.id}
          href={`/journal/${post.slug}`}
          image={post.image}
          title={post.title}
          excerpt={post.excerpt}
          date={post.publish_date}
          index={i}
        />
      ))}
    </RelatedSection>
  );
}

// ── Shared Section Wrapper ────────────────────────────────────────────────────

function RelatedSection({
  title,
  viewAllHref,
  children,
}: {
  title: string;
  viewAllHref: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-20 bg-[var(--color-sand)]">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div className="w-10 h-px bg-[var(--color-terracotta)] mb-4" />
            <h2 className="font-serif text-3xl text-[var(--color-charcoal)]">{title}</h2>
          </div>
          <Link
            href={viewAllHref}
            className="group hidden sm:flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-[var(--color-charcoal-light)] hover:text-[var(--color-terracotta)] transition-colors"
          >
            View all
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    </section>
  );
}
