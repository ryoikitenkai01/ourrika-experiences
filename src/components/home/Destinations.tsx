"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { DestinationCard } from "@/lib/types/ui";
import { CardSkeleton } from "@/components/ui/Skeleton";

interface DestinationsProps {
  destinations: DestinationCard[];
}

export function Destinations({ destinations }: DestinationsProps) {
  return (
    <section id="destinations" className="py-32 bg-[var(--color-obsidian)]">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08, duration: 0.5, ease: "easeOut" }}
            className="font-serif italic text-4xl text-[var(--color-sand-light)]"
          >
            Most Booked Destinations
          </motion.h2>
        </div>

        {destinations.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} className="aspect-[4/5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.slice(0, 4).map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
                className="group"
              >
                <Link href={`/destinations/${dest.slug}`} className="block">
                  <div className="aspect-[4/5] overflow-hidden mb-6 rounded-sm bg-[var(--color-surface)] shadow-premium">
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      width={400}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-serif text-xl mb-1 text-[var(--color-sand-light)] group-hover:text-[var(--color-terracotta)] transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-[10px] tracking-widest uppercase text-[var(--color-sand-light)]/50">
                        {dest.short_description || "Discovery"}
                      </p>
                    </div>
                    {dest.starting_price != null && (
                      <p className="font-serif italic text-sm text-[var(--color-sand-light)]/70">
                        from {dest.currency}{dest.starting_price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
