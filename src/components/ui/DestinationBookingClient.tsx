"use client";

import { useState } from "react";
import { MessageCircle, FileText } from "lucide-react";
import { BookingModal } from "@/components/ui/BookingModal";

interface DestinationBookingClientProps {
  destination: {
    id: string;
    name: string;
    slug: string;
  };
  whatsappUrl: string;
  whatsappMessage: string;
  whatsappNumber?: string;
  startingPrice?: number | null;
  currency?: string | null;
}

export function DestinationBookingClient({ destination, whatsappUrl, whatsappMessage, whatsappNumber, startingPrice, currency }: DestinationBookingClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 mt-8">
        {/* Primary: Book Now */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 h-12 bg-[var(--color-terracotta)] text-white font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[var(--color-terracotta-dark)] transition-colors duration-300 rounded-none shadow-premium"
        >
          <FileText size={15} />
          Book Now
        </button>

        {/* Secondary: WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-12 border border-white/10 text-[var(--color-sand-light)]/70 font-sans text-[13px] tracking-[0.15em] uppercase hover:border-white/25 hover:text-[var(--color-sand-light)] transition-colors duration-300 rounded-none"
        >
          <MessageCircle size={15} />
          Book now on WhatsApp
        </a>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={{
          id: destination.id,
          title: destination.name,
          slug: destination.slug,
          type: "destination",
          whatsappMessage: whatsappMessage,
          whatsappNumber: whatsappNumber,
          sourcePage: `/destinations/${destination.slug}`,
        }}
        meta={{
          price: startingPrice != null
            ? `from ${startingPrice.toLocaleString("en-US")} ${currency ?? ""}`.trim()
            : undefined,
        }}
      />
    </>
  );
}

