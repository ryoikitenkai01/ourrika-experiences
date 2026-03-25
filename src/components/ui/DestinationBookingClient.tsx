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
          className="flex items-center justify-center gap-2 h-12 bg-[var(--color-terracotta)] text-white font-sans text-sm tracking-widest uppercase hover:bg-[var(--color-terracotta-dark)] transition-colors"
        >
          <FileText size={15} />
          Request Details
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-12 bg-[#25D366] text-white font-sans text-sm tracking-widest uppercase hover:bg-[#1ebe5d] transition-colors"
        >
          <MessageCircle size={15} />
          Enquire on WhatsApp
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

export function MobileStickyDestinationBar({
  destination,
  whatsappUrl,
  whatsappMessage,
  whatsappNumber,
}: DestinationBookingClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 px-4 py-3 flex gap-3 shadow-lg">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 h-11 bg-[var(--color-terracotta)] text-white font-sans text-xs tracking-widest uppercase"
        >
          <FileText size={14} />
          Request
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
