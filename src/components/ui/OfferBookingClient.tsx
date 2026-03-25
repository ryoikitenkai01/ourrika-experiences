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
          className="flex items-center justify-center gap-2 h-12 bg-[var(--color-terracotta)] text-white font-sans text-sm tracking-widest uppercase hover:bg-[var(--color-terracotta-dark)] transition-colors"
        >
          <Gift size={15} />
          Claim Offer
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-12 bg-[#25D366] text-white font-sans text-sm tracking-widest uppercase hover:bg-[#1ebe5d] transition-colors"
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

export function MobileStickyOfferBar({
  offer,
  whatsappUrl,
  whatsappMessage,
  whatsappNumber,
}: OfferBookingClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 px-4 py-3 flex gap-3 shadow-lg">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-[var(--color-terracotta)] text-white font-sans text-xs tracking-widest uppercase"
        >
          <Gift size={14} />
          Claim
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-[#25D366] text-white font-sans text-xs tracking-widest uppercase"
        >
          <MessageCircle size={14} />
          WhatsApp
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
