"use client";

import { motion } from "framer-motion";

const stats = [
  { number: "120+", label: "Guests hosted" },
  { number: "4.9 ★", label: "Average rating" },
  { number: "< 2hrs", label: "WhatsApp reply time" },
];

export function TrustBand() {
  return (
    <section className="bg-[var(--color-surface)] border-y border-[var(--color-gold)]/20">
      <div className="container mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-0 sm:divide-x sm:divide-[var(--color-gold)]/15">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center text-center sm:px-8"
            >
              <span className="font-serif text-3xl text-[var(--color-gold)] mb-1">
                {stat.number}
              </span>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[var(--color-charcoal-light)]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
