"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ExperienceCard } from "@/lib/types/ui";
import { CardSkeleton } from "@/components/ui/Skeleton";

interface FeaturedExperiencesProps {
  experiences: ExperienceCard[];
  whatsappNumber: string;
}

function ExperienceCardItem({
  exp,
  index,
  whatsappNumber,
}: {
  exp: ExperienceCard;
  index: number;
  whatsappNumber: string;
}) {
  const isOffset = index === 1 || index === 3;
  const number = whatsappNumber.replace(/\D/g, "");
  
  return (
    <motion.div
      key={exp.id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className={`group relative overflow-hidden bg-zinc-200 h-[600px] cursor-pointer ${isOffset ? 'md:translate-y-12' : ''}`}
    >
      <Link href={`/experiences/${exp.slug}`} className="absolute inset-0 z-10">
        <Image
          src={exp.image}
          alt={exp.title}
          fill
          sizes="(max-width: 768px) 100vw, 20vw"
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
      </Link>

      {/* Content Reveal - Lower Z-Index but visible because Link above is transparent */}
      <div className="absolute bottom-8 left-6 right-6 text-white overflow-hidden pointer-events-none z-20">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          whileHover={{ y: 0, opacity: 1 }}
          className="transition-all duration-700 ease-[0.22, 1, 0.36, 1] group-hover:translate-y-0 group-hover:opacity-100 translate-y-8 opacity-0"
        >
          <p className="font-serif italic text-xl mb-1">{exp.title}</p>
          <p className="text-[9px] uppercase tracking-[0.2em] opacity-80 mb-3">
            {exp.location || "Curated Experience"}
          </p>
          
          <a
            href={`https://wa.me/${number}?text=${encodeURIComponent(exp.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-block text-[8px] uppercase tracking-[0.3em] font-sans border-b border-white/40 pb-1 hover:border-white transition-colors pointer-events-auto"
          >
            Inquire via WhatsApp
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function FeaturedExperiences({ experiences, whatsappNumber }: FeaturedExperiencesProps) {
  return (
    <section id="experiences" className="py-32 bg-[var(--color-surface)]">
      <div className="container mx-auto px-6 lg:px-12 max-w-[1920px]">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-4">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-serif italic text-4xl text-[#1A1A1A]"
          >
            Ourrika Activities
          </motion.h2>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#5c605d]"
          >
            Curated Journeys — {new Date().getFullYear()}
          </motion.span>
        </div>

        {experiences.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[600px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={i} className={`h-full ${i === 1 || i === 3 ? 'md:translate-y-12' : ''}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:h-[700px] mb-12">
            {experiences.slice(0, 5).map((exp, index) => (
              <ExperienceCardItem 
                key={exp.id} 
                exp={exp} 
                index={index} 
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        )}

        <div className="mt-24 flex justify-center">
          <Link
            href="/experiences"
            className="group flex items-center space-x-4 text-[var(--color-on-surface)] font-sans text-[10px] tracking-[0.4em] uppercase hover:opacity-60 transition-all"
          >
            <span>Explore all activities</span>
            <div className="w-8 h-px bg-[var(--color-on-surface)] transition-all group-hover:w-12" />
          </Link>
        </div>
      </div>
    </section>
  );
}
