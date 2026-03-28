"use client";

import { motion } from "framer-motion";
import type { PartnerLogo } from "@/lib/types/ui";

interface PartnersProps {
  partners: PartnerLogo[];
}

export function Partners({ partners }: PartnersProps) {
  // If no partners are provided, use the ones from the design mockup as fallback
  const displayPartners = partners.length > 0 ? partners : [
    { id: '1', name: 'AMAN', logo: '', link: '#' },
    { id: '2', name: 'BELMOND', logo: '', link: '#' },
    { id: '3', name: 'SIX SENSES', logo: '', link: '#' },
    { id: '4', name: 'ROSEWOOD', logo: '', link: '#' },
    { id: '5', name: 'ONE&ONLY', logo: '', link: '#' },
  ];

  return (
    <section className="py-24 bg-[var(--color-surface)] border-t border-[var(--color-outline)]/10">
      <div className="container mx-auto px-8 max-w-[1200px]">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-30 grayscale hover:opacity-60 transition-opacity duration-700"
        >
          {displayPartners.map((partner, index) => (
            <motion.span 
              key={partner.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 0.3, y: 0 }}
              whileHover={{ opacity: 1, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
              className="font-sans text-[11px] tracking-[0.5em] uppercase cursor-default text-[var(--color-sand-light)]"
            >
              {partner.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
