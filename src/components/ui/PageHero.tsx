"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** Optional background image URL */
  backgroundImage?: string | null;
}

export function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section
      className="relative flex items-end min-h-[38vh] pb-16 pt-40"
      style={
        backgroundImage
          ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
          : {}
      }
    >
      {/* Overlay — always shown, stronger when no bg image */}
      <div
        className={`absolute inset-0 ${
          backgroundImage
            ? "bg-gradient-to-t from-black/70 via-black/30 to-black/40"
            : "bg-[var(--color-obsidian)]"
        }`}
      />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* Eyebrow line */}
        <div className="w-12 h-px bg-[var(--color-gold)] mb-6" />

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--color-sand-light)] leading-tight max-w-3xl"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5, ease: "easeOut" }}
            className="font-sans text-[var(--color-sand-light)]/70 text-sm tracking-[0.2em] uppercase mt-4 max-w-xl"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
