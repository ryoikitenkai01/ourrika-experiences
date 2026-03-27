"use client";

import { motion } from "framer-motion";

export function Newsletter() {
  return (
    <section className="py-32 px-8 bg-[var(--color-surface)] text-center">
      <div className="max-w-xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-serif italic text-3xl text-[#1A1A1A] mb-6"
        >
          Stay Inspired
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.5, ease: "easeOut" }}
          className="text-[#5c605d] text-sm mb-12 font-light"
        >
          Join our inner circle for exclusive experience launches and editorial travel stories.
        </motion.p>
        <form className="relative group max-w-sm mx-auto">
          <input 
            className="w-full bg-transparent border-b border-[var(--color-outline)]/30 py-4 px-2 focus:outline-none focus:border-[var(--color-on-surface)] transition-colors placeholder:text-[var(--color-outline)]/50 text-sm font-light" 
            placeholder="Your Email Address" 
            aria-label="Your Email Address"
            type="email" 
            required
          />
          <button 
            className="absolute right-0 bottom-4 font-sans text-[10px] tracking-[0.2em] uppercase text-[var(--color-on-surface)] hover:opacity-60 transition-opacity" 
            type="submit"
          >
            Join
          </button>
        </form>
      </div>
    </section>
  );
}
