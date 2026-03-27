"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import type { SiteSettings } from "@/lib/types/ui";

interface HeroProps {
  settings: SiteSettings;
}

export function Hero({ settings }: HeroProps) {
  const whatsappNumber = (settings.whatsapp_number || "212600000000").replace(/\D/g, "");

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[var(--color-obsidian)]">
      {/* Background image with scale-in */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: `url('${settings.hero_media_url || "/hero-bg.jpg"}')`,
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70 z-10" />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-sans text-[10px] tracking-[0.3em] uppercase text-[var(--color-gold)] mb-6"
        >
          Morocco · Curated Experiences
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
          className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-[var(--color-sand-light)] mb-4 max-w-3xl leading-tight"
          style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
        >
          Feel Morocco. Don&apos;t just visit it.
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14, ease: "easeOut" }}
          className="font-sans text-[var(--color-sand-light)]/60 text-sm tracking-wide mb-10 max-w-md"
        >
          Private, handcrafted journeys in the heart of Morocco
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <Link
            href="/experiences"
            className="px-10 py-4 bg-[var(--color-terracotta)] text-white text-[11px] tracking-[0.25em] font-sans uppercase transition-colors duration-300 hover:bg-[var(--color-terracotta-dark)] rounded-none"
          >
            Explore Experiences
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 border border-[var(--color-gold)] text-[var(--color-gold)] text-[11px] tracking-[0.25em] font-sans uppercase transition-colors duration-300 hover:bg-[var(--color-gold)]/10 rounded-none"
          >
            Book on WhatsApp
          </a>
        </motion.div>

        {/* Trust micro-copy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-[var(--color-sand-light)]/40 font-sans text-[10px] tracking-wide"
        >
          <span>4.9 · 120+ guests</span>
          <span>Reply in 2hrs</span>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4 items-center">
        <div className="relative w-12 h-[1px] overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
            className="absolute inset-0 bg-[var(--color-gold)] origin-left"
          />
        </div>
        <div className="w-12 h-[1px] bg-[var(--color-sand-light)]/20" />
        <div className="w-12 h-[1px] bg-[var(--color-sand-light)]/20" />
      </div>
    </section>
  );
}
