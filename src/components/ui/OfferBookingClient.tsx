"use client";

import { useState } from "react";
import { MessageCircle, Gift } from "lucide-react";
import { BookingModal } from "@/components/ui/BookingModal";

interface OfferBookingClientProps {
  offer: {
    id: string;
    title: string;
    slug: string;
  };
  whatsappUrl: string;
  whatsappMessage: string;
  whatsappNumber?: string;
}

export function OfferBookingClient({ offer, whatsappUrl, whatsappMessage, whatsappNumber }: OfferBookingClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 mt-5">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 h-12 bg-[var(--color-surface)] text-[var(--color-sand-light)] font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[var(--color-terracotta)] transition-colors duration-300 rounded-none"
        >
          <Gift size={15} />
          Claim Offer
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-12 bg-[var(--color-terracotta)] text-[var(--color-sand-light)] font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[var(--color-surface)] transition-colors duration-300 rounded-none"
        >
          <MessageCircle size={15} />
          Claim on WhatsApp
        </a>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={{
          id: offer.id,
          title: offer.title,
          slug: offer.slug,
          type: "offer",
          whatsappMessage: whatsappMessage,
          whatsappNumber: whatsappNumber,
          sourcePage: `/offers/${offer.slug}`,
        }}
      />
    </>
  );
}

