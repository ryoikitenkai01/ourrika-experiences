"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

// ── Shared luxury card for Destinations, Experiences, Offers ──────────────────

interface PremiumCardProps {
  id: string;
  href: string;
  image: string | null;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  badge?: string | null;        // e.g. "SAVE 30%", "FEATURED"
  ctaLabel?: string;
  index?: number;
}

export function PremiumCard({
  href,
  image,
  title,
  subtitle,
  description,
  badge,
  ctaLabel = "Explore",
  index = 0,
}: PremiumCardProps) {
  const [error, setError] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="group bg-white border border-[rgba(224,214,200,0.4)] shadow-sm"
    >
      <Link href={href} className="flex flex-col h-full">
        {/* Image Block */}
        <div className="relative overflow-hidden aspect-[4/3] bg-[var(--color-sand)]">
          {image && !error ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={() => setError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-sand)] to-[var(--color-sand-dark)] flex items-center justify-center">
              <span className="text-[#5c605d] font-serif text-lg opacity-30">Ourrika</span>
            </div>
          )}

          {/* Badge */}
          {badge && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#C56B5C] text-white px-3 py-1 text-[10px] tracking-widest uppercase font-sans font-semibold">
              <Tag size={10} />
              {badge}
            </div>
          )}

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Content Block */}
        <div className="flex flex-col flex-1 p-6">
          {/* Title */}
          <h3 className="font-serif text-xl text-[#1A1A1A] leading-snug mb-1 group-hover:text-[#C56B5C] transition-colors duration-300">
            {title}
          </h3>

          {/* Subtitle (price / location / date) */}
          {subtitle && (
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#5c605d] mb-3">
              {subtitle}
            </p>
          )}

          {/* Description */}
          {description && (
            <p className="font-sans text-sm text-[#5c605d] leading-relaxed line-clamp-2 mb-4 flex-1">
              {description}
            </p>
          )}

          {/* Spacer if no description */}
          {!description && <div className="flex-1" />}

          {/* CTA Visual */}
          <div className="group/cta inline-flex items-center gap-2 mt-3 text-[#1A1A1A] font-sans text-xs tracking-[0.2em] uppercase group-hover:text-[#C56B5C] transition-colors duration-300 border-b border-transparent group-hover:border-[#C56B5C] pb-0.5 self-start">
            {ctaLabel}
            <ArrowRight size={12} className="transition-transform group-hover/cta:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Blog-specific card ────────────────────────────────────────────────────────

interface BlogCardProps {
  href: string;
  image: string | null;
  title: string;
  excerpt: string | null;
  date: string | null;
  index?: number;
}

export function BlogCard({ href, image, title, excerpt, date, index = 0 }: BlogCardProps) {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const [error, setError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="group bg-white border border-[rgba(224,214,200,0.4)] shadow-sm"
    >
      <Link href={href} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[16/9] bg-[var(--color-sand)]">
          {image && !error ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={() => setError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-sand)] to-[var(--color-sand-dark)] flex items-center justify-center">
               <span className="text-[#5c605d] font-serif text-xs opacity-30">Ourrika</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          {formattedDate && (
            <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#5c605d] mb-2">
              {formattedDate}
            </p>
          )}
          <h3 className="font-serif text-xl text-[#1A1A1A] leading-snug mb-2 group-hover:text-[#C56B5C] transition-colors duration-300">
            {title}
          </h3>
          {excerpt && (
            <p className="font-sans text-sm text-[#5c605d] leading-relaxed line-clamp-3 mb-4 flex-1">
              {excerpt}
            </p>
          )}
          <div className="group/cta inline-flex items-center gap-2 mt-auto text-[#1A1A1A] font-sans text-xs tracking-[0.2em] uppercase group-hover:text-[#C56B5C] transition-colors duration-300 border-b border-transparent group-hover:border-[#C56B5C] pb-0.5 self-start">
            Read more
            <ArrowRight size={12} className="transition-transform group-hover/cta:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
