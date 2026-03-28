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
}

export function DestinationBookingClient({ destination, whatsappUrl, whatsappMessage, whatsappNumber }: DestinationBookingClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 mt-5">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 h-12 bg-[var(--color-surface)] text-[var(--color-sand-light)] font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[var(--color-terracotta)] transition-colors duration-300 rounded-none"
        >
          <FileText size={15} />
          Book Now
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-12 bg-[var(--color-terracotta)] text-[var(--color-sand-light)] font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[var(--color-surface)] transition-colors duration-300 rounded-none"
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
      />
    </>
  );
}

