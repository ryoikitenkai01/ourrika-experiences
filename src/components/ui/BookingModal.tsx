"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Mail, Calendar, Users, MessageSquare, MessageCircle, CheckCircle2, Loader2 } from "lucide-react";
import { submitBookingRequest } from "@/app/actions/booking";
import type { BookingRequest } from "@/lib/types/booking";
import { trackEvent } from "@/lib/analytics";

// ── Types ──────────────────────────────────────────────────────────────────────

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    title: string;
    slug: string;
    type: "experience" | "destination" | "offer";
    whatsappMessage?: string;
    whatsappNumber?: string;
    sourcePage?: string;
  };
}

type FormState = Omit<BookingRequest, "service_id" | "service_title" | "service_type" | "service_slug" | "source_page">;

const INITIAL_FORM: FormState = {
  full_name: "",
  phone: "",
  email: "",
  preferred_date: "",
  guests_count: 1,
  message: "",
};

// ── Component ──────────────────────────────────────────────────────────────────

export function BookingModal({ isOpen, onClose, service }: BookingModalProps) {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setForm(INITIAL_FORM);
        setStatus("idle");
        setErrorMsg("");
      }, 300);
    }
  }, [isOpen]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "guests_count" ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const result = await submitBookingRequest({
      ...form,
      service_id: service.id,
      service_title: service.title,
      service_type: service.type,
      service_slug: service.slug,
      source_page: service.sourcePage ?? "",
    });

    if (result.success) {
      setStatus("success");
      trackEvent('booking_submit', {
        item_id: service.id,
        item_name: service.title,
        category: service.type,
      });
    } else {
      setStatus("error");
      setErrorMsg(result.error ?? "Something went wrong.");
    }
  }

  const whatsappUrl = service.whatsappMessage
    ? `https://wa.me/${service.whatsappNumber ?? ""}?text=${encodeURIComponent(service.whatsappMessage)}`
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-[var(--color-sand-light)] z-[101] flex flex-col shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-white">
              <div>
                <p className="font-sans text-[10px] tracking-widest uppercase text-[var(--color-terracotta)] mb-0.5">
                  Request Availability
                </p>
                <h2 className="font-serif text-xl text-[var(--color-charcoal)] leading-snug max-w-xs">
                  {service.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-[var(--color-charcoal)] transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 px-8 py-8">
              {status === "success" ? (
                <SuccessState
                  title={service.title}
                  whatsappUrl={whatsappUrl}
                  onClose={onClose}
                />
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Full Name */}
                  <InputField
                    icon={<User size={15} />}
                    label="Full Name *"
                    name="full_name"
                    type="text"
                    placeholder="Your name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                  />

                  {/* Phone */}
                  <InputField
                    icon={<Phone size={15} />}
                    label="Phone / WhatsApp"
                    name="phone"
                    type="tel"
                    placeholder="+212 6xx xxx xxx"
                    value={form.phone}
                    onChange={handleChange}
                  />

                  {/* Email */}
                  <InputField
                    icon={<Mail size={15} />}
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />

                  {/* Date + Guests row */}
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      icon={<Calendar size={15} />}
                      label="Preferred Date"
                      name="preferred_date"
                      type="date"
                      value={form.preferred_date}
                      onChange={handleChange}
                    />
                    <InputField
                      icon={<Users size={15} />}
                      label="Guests"
                      name="guests_count"
                      type="number"
                      min={1}
                      max={50}
                      placeholder="1"
                      value={String(form.guests_count)}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-sans text-[10px] tracking-widest uppercase text-[var(--color-charcoal-light)]">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare size={15} className="absolute top-3.5 left-3.5 text-gray-400 pointer-events-none" />
                      <textarea
                        name="message"
                        rows={3}
                        placeholder="Any special requests or questions..."
                        value={form.message}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 font-sans text-sm text-[var(--color-charcoal)] placeholder-gray-400 focus:outline-none focus:border-[var(--color-terracotta)] transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {status === "error" && errorMsg && (
                    <p className="font-sans text-xs text-red-500 bg-red-50 px-4 py-3 border border-red-200">
                      {errorMsg}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center gap-2 h-12 bg-[var(--color-terracotta)] text-white font-sans text-sm tracking-widest uppercase hover:bg-[var(--color-terracotta-dark)] disabled:opacity-60 disabled:pointer-events-none transition-colors mt-2"
                  >
                    {status === "loading" ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending…</>
                    ) : (
                      "Send Request"
                    )}
                  </button>

                  {/* WhatsApp alternative */}
                  {whatsappUrl && (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="font-sans text-[10px] uppercase tracking-widest text-gray-400">or</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                  )}
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      onClick={() => trackEvent('whatsapp_click', {
                        item_id: service.id,
                        item_name: service.title,
                        category: service.type,
                        location: 'modal_alternative'
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 h-12 bg-[#25D366] text-white font-sans text-sm tracking-widest uppercase hover:bg-[#1ebe5d] transition-colors"
                    >
                      <MessageCircle size={16} />
                      Book on WhatsApp
                    </a>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  max?: number;
}

function InputField({ icon, label, name, type, placeholder, value, onChange, required, min, max }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-[10px] tracking-widest uppercase text-[var(--color-charcoal-light)]">
        {label}
      </label>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-3.5 text-gray-400 pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          className="w-full h-11 pl-10 pr-4 bg-white border border-gray-200 font-sans text-sm text-[var(--color-charcoal)] placeholder-gray-400 focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
        />
      </div>
    </div>
  );
}

function SuccessState({
  title,
  whatsappUrl,
  onClose,
}: {
  title: string;
  whatsappUrl: string | null;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center py-8 gap-6"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50">
        <CheckCircle2 size={32} className="text-green-500" />
      </div>

      <div>
        <h3 className="font-serif text-2xl text-[var(--color-charcoal)] mb-2">
          Request Received
        </h3>
        <p className="font-sans text-sm text-gray-500 leading-relaxed max-w-xs">
          Thank you for your interest in <strong>{title}</strong>. Our team will reach
          out within 24 hours to confirm availability.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-12 bg-[#25D366] text-white font-sans text-sm tracking-widest uppercase hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle size={16} />
            Continue on WhatsApp
          </a>
        )}
        <button
          onClick={onClose}
          className="h-12 border border-gray-300 text-[var(--color-charcoal)] font-sans text-sm tracking-widest uppercase hover:bg-gray-50 transition-colors"
        >
          Back to site
        </button>
      </div>
    </motion.div>
  );
}
