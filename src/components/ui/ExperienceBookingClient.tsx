"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, CalendarDays } from "lucide-react";
import { BookingModal } from "@/components/ui/BookingModal";

interface ExperienceBookingClientProps {
  experience: {
    id: string;
    title: string;
    slug: string;
    whatsappMessage: string;
    whatsappNumber?: string;
  };
}

export function ExperienceBookingClient({ experience }: ExperienceBookingClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${(experience.whatsappNumber || "").replace(/\D/g, '') || "212600000000"}?text=${encodeURIComponent(
    experience.whatsappMessage
  )}`;

  return (
    <>
      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col gap-3"
      >
        {/* Primary: WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-2 w-full px-8 py-3.5 bg-[var(--color-terracotta)] text-white font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[var(--color-terracotta-dark)] transition-colors duration-300 rounded-none"
        >
          <MessageCircle size={16} />
          Book on WhatsApp
        </a>

        {/* Secondary: Request Availability */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center justify-center gap-2 w-full px-8 py-3.5 border border-white/[0.15] text-[var(--color-sand-light)]/70 font-sans text-[13px] tracking-[0.15em] uppercase hover:border-white/[0.3] hover:text-[var(--color-sand-light)] transition-colors duration-300 rounded-none"
        >
          <CalendarDays size={16} />
          Request Availability
        </button>
      </motion.div>

      {/* Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={{
          id: experience.id,
          title: experience.title,
          slug: experience.slug,
          type: "experience",
          whatsappMessage: experience.whatsappMessage,
          whatsappNumber: experience.whatsappNumber,
          sourcePage: `/experiences/${experience.slug}`,
        }}
      />
    </>
  );
}

// ── Sticky mobile booking bar ──────────────────────────────────────────────────

export function MobileStickyBookingBar({ experience }: ExperienceBookingClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${(experience.whatsappNumber || "").replace(/\D/g, '') || "212600000000"}?text=${encodeURIComponent(
    experience.whatsappMessage
  )}`;

  return (
    <>
      {/* Sticky bar visible only on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--color-surface)] border-t border-[var(--color-gold)]/20 px-4 py-3 flex gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-[var(--color-terracotta)] text-white font-sans text-[11px] tracking-[0.15em] uppercase hover:bg-[var(--color-terracotta-dark)] transition-colors duration-300 rounded-none"
        >
          <MessageCircle size={14} />
          WhatsApp
        </a>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 h-11 border border-white/[0.15] text-[var(--color-sand-light)]/70 font-sans text-[11px] tracking-[0.15em] uppercase hover:border-white/[0.3] transition-colors duration-300 rounded-none"
        >
          <CalendarDays size={14} />
          Request
        </button>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={{
          id: experience.id,
          title: experience.title,
          slug: experience.slug,
          type: "experience",
          whatsappMessage: experience.whatsappMessage,
          whatsappNumber: experience.whatsappNumber,
          sourcePage: `/experiences/${experience.slug}`,
        }}
      />
    </>
  );
}
