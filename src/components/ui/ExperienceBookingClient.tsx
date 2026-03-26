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

  const whatsappUrl = `https://wa.me/${experience.whatsappNumber ?? ""}?text=${encodeURIComponent(
    experience.whatsappMessage
  )}`;

  return (
    <>
      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center justify-center gap-2 h-13 px-8 py-3.5 bg-[#1A1A1A] text-white font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[#C56B5C] transition-colors duration-300 rounded-none"
        >
          <CalendarDays size={16} />
          Request Availability
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-2 h-13 px-8 py-3.5 bg-[#C56B5C] text-white font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[#1A1A1A] transition-colors duration-300 rounded-none"
        >
          <MessageCircle size={16} />
          Book on WhatsApp
        </a>
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

  const whatsappUrl = `https://wa.me/${experience.whatsappNumber ?? ""}?text=${encodeURIComponent(
    experience.whatsappMessage
  )}`;

  return (
    <>
      {/* Sticky bar visible only on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-[rgba(224,214,200,0.4)] px-4 py-3 flex gap-3 shadow-sm">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-[#1A1A1A] text-white font-sans text-[11px] tracking-[0.15em] uppercase hover:bg-[#C56B5C] transition-colors duration-300 rounded-none"
        >
          <CalendarDays size={14} />
          Request
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-[#C56B5C] text-white font-sans text-[11px] tracking-[0.15em] uppercase hover:bg-[#1A1A1A] transition-colors duration-300 rounded-none"
        >
          <MessageCircle size={14} />
          WhatsApp
        </a>
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
