"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

interface WhatsAppButtonProps {
  /** E.164 phone number from site_settings. Falls back to empty. */
  phoneNumber: string;
}

export function WhatsAppButton({ phoneNumber }: WhatsAppButtonProps) {
  const baseMessage = "Hello, I would like to know more about Ourrika Experiences.";
  const number = phoneNumber.replace(/\D/g, ""); // strip non-digits
  const url = `https://wa.me/${number}?text=${encodeURIComponent(baseMessage)}`;

  const handleClick = () => {
    trackEvent('whatsapp_click', { category: 'floating_cta' });
  };

  // If no number configured, still render but disable
  if (!number) return null;

  return (
    <motion.a
      href={url}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 z-50 bg-[#C56B5C] text-white p-4 rounded-full shadow-sm hover:bg-[#1A1A1A] transition-colors duration-300 focus:outline-none"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}
