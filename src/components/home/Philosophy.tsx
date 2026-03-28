"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Philosophy() {
  return (
    <section className="flex flex-col md:flex-row min-h-[800px] bg-[var(--color-obsidian)] overflow-hidden">
      {/* Image Side */}
      <div className="w-full md:w-1/2 relative min-h-[500px] md:min-h-auto">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80"
            alt="A traveller looking out over a Moroccan landscape at dusk"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Text Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-24 bg-[var(--color-surface)]">
        <div className="max-w-md text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-[var(--color-charcoal-light)] mb-12"
          >
            Our Philosophy
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="font-serif italic text-3xl md:text-5xl text-[var(--color-sand-light)] mb-10 leading-tight"
          >
            &quot;Travel is not about the destination, but the perspective.&quot;
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
            className="text-[var(--color-sand-light)]/70 font-light leading-relaxed mb-12 text-sm"
          >
            At Ourrika, we believe in slow travel. We curate experiences that challenge your viewpoint and immerse you in the quiet luxury of genuine human connection and raw natural beauty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
          >
            <Link
              href="/about"
              className="inline-flex items-center text-[var(--color-sand-light)] font-sans text-[10px] tracking-widest uppercase group"
            >
              <span>Explore Our Story</span>
              <div className="ml-4 w-8 h-px bg-[var(--color-sand-light)]/40 transition-all group-hover:w-12 group-hover:bg-[var(--color-sand-light)]" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
