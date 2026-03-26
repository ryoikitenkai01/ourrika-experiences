"use client";

import { motion } from "framer-motion";
import Link from 'next/link';
import type { SiteSettings } from "@/lib/types/ui";

interface HeroProps {
  settings: SiteSettings;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-zinc-900 font-[var(--font-roboto)]">
      {/* Background with subtle parallax/scale effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
          style={{ 
            backgroundImage: `url('${settings.hero_media_url || "/hero-bg.jpg"}')`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 z-10" />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-semibold not-italic text-2xl md:text-3xl lg:text-4xl text-white mb-16 tracking-[0.15em] uppercase"
          style={{ fontFamily: 'var(--font-roboto)' }}
        >
          Escape, Breathe, Explore...
        </motion.h1>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link 
            href="/experiences" 
            className="px-12 py-5 bg-[#555555] text-white text-[11px] tracking-[0.3em] font-bold uppercase transition-all duration-500 hover:bg-zinc-800"
          >
            VIEW EXPERIENCES
          </Link>
          <Link 
            href="/destinations" 
            className="px-12 py-5 border border-white/20 text-white text-[11px] tracking-[0.3em] font-bold uppercase transition-all duration-500 hover:bg-white/10"
          >
            OUR DESTINATIONS
          </Link>
        </motion.div>
      </div>

      {/* Carousel Indicators / Scroll Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-4">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="h-[1px] bg-white" 
        />
        <div className="w-12 h-[1px] bg-white/30" />
        <div className="w-12 h-[1px] bg-white/30" />
      </div>
    </section>
  );
}
