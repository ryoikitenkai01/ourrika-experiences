"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Stable ref so the keydown handler never recreates on every render
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape — stable handler, never re-registers
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onCloseRef.current();
  }, []);

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
        setErrors({});
      }, 300);
    }
  }, [isOpen]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "guests_count" ? Number(value) : value }));
    if (errors[name]) {
      setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!form.full_name?.trim()) newErrors.full_name = "Full name is required";
    
    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone: numbers only, at least 8 digits
    const phoneDigits = form.phone?.replace(/\D/g, "") || "";
    if (!form.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (phoneDigits.length < 8) {
      newErrors.phone = "Phone must be at least 8 digits";
    }

    // Date: not in the past
    if (!form.preferred_date) {
      newErrors.preferred_date = "Please select a date";
    } else {
      const selected = new Date(form.preferred_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.preferred_date = "Date cannot be in the past";
      }
    }

    // Guests: 1-20
    if (!form.guests_count || form.guests_count < 1) {
      newErrors.guests_count = "Minimum 1 guest required";
    } else if (form.guests_count > 20) {
      newErrors.guests_count = "Maximum 20 guests per booking";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validate()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
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
        if (result.error === "validation_failed") {
          setErrorMsg("Please check all fields and try again.");
        } else {
          setErrorMsg("Something went wrong. Please try again or contact us on WhatsApp.");
        }
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or contact us on WhatsApp.");
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-[var(--color-surface)]/95 backdrop-blur-md border-l border-white/5 z-[101] flex flex-col shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[rgba(224,214,200,0.6)] bg-[#F5EFE4]/90">
              <div>
                <p className="font-sans text-[10px] tracking-widest uppercase text-[var(--color-terracotta)] mb-0.5">
                  Request Availability
                </p>
                <h2 id="modal-title" className="font-serif text-xl text-[var(--color-sand-light)] leading-snug max-w-xs">
                  {service.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-9 h-9 border border-white/10 text-[var(--color-sand-light)]/40 hover:text-[var(--color-sand-light)] hover:border-white/20 transition-colors"
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
                  {/* Server Error Banner */}
                  {status === "error" && errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#F5EFE4] border border-[#C56B5C]/30 text-[#C56B5C] text-[13px] p-4 flex gap-3"
                    >
                      <p>{errorMsg}</p>
                    </motion.div>
                  )}

                  {/* Full Name */}
                  <InputField
                    icon={<User size={15} />}
                    label="Full Name *"
                    name="full_name"
                    type="text"
                    placeholder="Your name"
                    value={form.full_name}
                    onChange={handleChange}
                    error={errors.full_name}
                  />

                  {/* Phone */}
                  <InputField
                    icon={<Phone size={15} />}
                    label="Phone / WhatsApp *"
                    name="phone"
                    type="tel"
                    placeholder="+212 6xx xxx xxx"
                    value={form.phone}
                    onChange={handleChange}
                    error={errors.phone}
                  />

                  {/* Email */}
                  <InputField
                    icon={<Mail size={15} />}
                    label="Email *"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                  />

                  {/* Date + Guests row */}
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      icon={<Calendar size={15} />}
                      label="Preferred Date *"
                      name="preferred_date"
                      type="date"
                      value={form.preferred_date}
                      onChange={handleChange}
                      error={errors.preferred_date}
                    />
                    <InputField
                      icon={<Users size={15} />}
                      label="Guests *"
                      name="guests_count"
                      type="number"
                      min={1}
                      max={20}
                      placeholder="1"
                      value={String(form.guests_count)}
                      onChange={handleChange}
                      error={errors.guests_count}
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
                        className="w-full pl-10 pr-4 py-3 bg-[var(--color-obsidian)] border border-white/10 font-sans text-sm text-[var(--color-sand-light)] placeholder-[var(--color-charcoal-light)]/40 focus:outline-none focus:border-[var(--color-terracotta)]/40 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center gap-2 h-12 bg-[#1A1A1A] text-white font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[#C56B5C] disabled:opacity-60 disabled:pointer-events-none transition-colors duration-300 rounded-none mt-2"
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
                      className="flex items-center justify-center gap-2 h-12 bg-[#C56B5C] text-white font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[#1A1A1A] transition-colors duration-300 rounded-none"
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
  error?: string;
}

function InputField({ icon, label, name, type, placeholder, value, onChange, required, min, max, error }: InputFieldProps) {
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
          className={`w-full h-11 pl-10 pr-4 bg-[var(--color-obsidian)] border font-sans text-sm text-[var(--color-sand-light)] placeholder-[var(--color-charcoal-light)]/40 focus:outline-none transition-colors ${
            error ? "border-[var(--color-terracotta)]" : "border-white/10 focus:border-[var(--color-terracotta)]/40"
          }`}
        />
      </div>
      {error && (
        <p className="text-[11px] text-[#C56B5C] tracking-wide mt-1">
          {error}
        </p>
      )}
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
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/5">
        <CheckCircle2 size={40} className="text-[var(--color-gold)]" />
      </div>

      <div>
        <h3 className="font-serif text-3xl text-[var(--color-sand-light)] mb-4">
          Request Received
        </h3>
        <p className="font-sans text-sm text-[var(--color-sand-light)]/60 leading-relaxed max-w-sm">
          Your request for <strong>{title}</strong> has been received. 
          We&apos;ll be in touch shortly via WhatsApp to confirm details and availability.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full mt-4">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-14 bg-[#C56B5C] text-white font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-[#1A1A1A] transition-colors duration-300 rounded-none"
          >
            <MessageCircle size={18} />
            Immediate WhatsApp Claim
          </a>
        )}
        <button
          onClick={onClose}
          className="h-14 border border-white/10 text-[var(--color-sand-light)] font-sans text-[13px] tracking-[0.15em] uppercase hover:bg-white/5 transition-colors duration-300 rounded-none"
        >
          Back to site
        </button>
      </div>
    </motion.div>
  );
}
