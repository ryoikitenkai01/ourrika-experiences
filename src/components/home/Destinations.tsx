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
    <section id="destinations" className="py-32 bg-[var(--color-surface-container-low)]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1400px]">
        <div className="mb-16">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-sans text-[10px] tracking-[0.3em] uppercase text-[var(--color-outline)] mb-2"
          >
            Featured Collection
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-serif italic text-4xl text-[var(--color-on-surface)]"
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="group"
              >
                <Link href={`/destinations/${dest.slug}`} className="block">
                  <div className="aspect-[4/5] overflow-hidden mb-6 rounded-sm bg-zinc-200">
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
                      <h3 className="font-serif text-xl mb-1 group-hover:text-[var(--color-terracotta)] transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-[10px] tracking-widest uppercase text-[var(--color-outline)]">
                        {dest.short_description || "Discovery"}
                      </p>
                    </div>
                    {dest.starting_price != null && (
                      <p className="font-sans text-sm text-[var(--color-on-surface)]">
                        from {dest.currency} {dest.starting_price.toLocaleString()}
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
