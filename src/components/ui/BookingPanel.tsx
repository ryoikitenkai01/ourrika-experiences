"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Zap,
  Lock,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  User,
  Phone,
  Mail,
  Calendar,
  Users,
  MessageSquare,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { submitBookingRequest } from "@/app/actions/booking";
import type { BookingRequest } from "@/lib/types/booking";
import { trackEvent } from "@/lib/analytics";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BookingPanelProps {
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
  /** Optional metadata shown in Step 1 summary pills. */
  meta?: {
    location?: string;
    duration?: string;
    price?: string;
  };
}

type Step = 1 | 2;
type Status = "idle" | "loading" | "success" | "error";
type FormState = Omit<
  BookingRequest,
  "service_id" | "service_title" | "service_type" | "service_slug" | "source_page"
>;

const INITIAL_FORM: FormState = {
  full_name: "",
  phone: "",
  email: "",
  preferred_date: "",
  guests_count: 1,
  message: "",
};

// ── Main Component ─────────────────────────────────────────────────────────────

export function BookingPanel({
  isOpen,
  onClose,
  service,
  meta,
}: BookingPanelProps) {
  const [step, setStep] = useState<Step>(1);
  const [isMobile, setIsMobile] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showSpecialRequest, setShowSpecialRequest] = useState(false);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // ── Responsive: detect mobile after mount (avoids SSR mismatch)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Body scroll lock + Nav hide attribute
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-modal-open", "true");
    } else {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-modal-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-modal-open");
    };
  }, [isOpen]);

  // ── Escape key to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onCloseRef.current();
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── Reset state after panel closes (wait for exit animation)
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(1);
        setForm(INITIAL_FORM);
        setStatus("idle");
        setErrorMsg("");
        setErrors({});
        setShowSpecialRequest(false);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // ── Form handlers
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "guests_count" ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!form.full_name?.trim()) errs.full_name = "Name required";

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email?.trim()) errs.email = "Email required";
    else if (!emailRe.test(form.email)) errs.email = "Invalid email";

    const phoneDigits = form.phone?.replace(/\D/g, "") ?? "";
    if (!form.phone?.trim()) errs.phone = "Phone required";
    else if (phoneDigits.length < 8) errs.phone = "Min 8 digits";

    if (!form.preferred_date) {
      errs.preferred_date = "Date required";
    } else {
      const sel = new Date(form.preferred_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (sel < today) errs.preferred_date = "Can't be in the past";
    }

    if (!form.guests_count || form.guests_count < 1) errs.guests_count = "Min 1";
    else if (form.guests_count > 20) errs.guests_count = "Max 20";

    setErrors(errs);
    return Object.keys(errs).length === 0;
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
        trackEvent("booking_submit", {
          item_id: service.id,
          item_name: service.title,
          category: service.type,
        });
      } else {
        setStatus("error");
        setErrorMsg(
          result.error === "validation_failed"
            ? "Please check all fields and try again."
            : "Something went wrong. Please try again or contact us on WhatsApp."
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg(
        "Something went wrong. Please try again or contact us on WhatsApp."
      );
    }
  }

  // ── Derived values
  const whatsappUrl =
    service.whatsappMessage
      ? `https://wa.me/${(service.whatsappNumber ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(service.whatsappMessage)}`
      : null;

  // ── Animation: slide from right on desktop, from bottom on mobile
  const panelMotion = isMobile
    ? { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } }
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } };

  // ── Mobile sheet height expands when going to step 2 or success
  const isExpanded = step === 2 || status === "success";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop */}
          <motion.div
            key="bp-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Panel */}
          <motion.div
            key="bp-panel"
            {...panelMotion}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className={[
              "fixed z-[101] flex flex-col bg-[var(--color-surface)] shadow-2xl",
              // Desktop: right-side drawer, offset below navbar
              "md:top-[64px] md:right-0 md:h-[calc(100vh-64px)] md:w-full md:max-w-lg md:border-l md:border-white/5 md:overflow-y-auto",
              // Mobile: bottom sheet
              "bottom-0 left-0 right-0 md:bottom-auto md:left-auto rounded-t-2xl md:rounded-none border-t border-white/5 md:border-t-0",
              // Mobile height transition
              isMobile
                ? `overflow-hidden transition-[max-height] duration-300 ease-out ${isExpanded ? "max-h-[88vh]" : "max-h-[58vh]"}`
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bp-title"
          >
            {/* Gold gradient accent line */}
            <div
              className="h-px flex-shrink-0 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent"
              aria-hidden="true"
            />

            {/* Drag handle — mobile only */}
            {isMobile && (
              <div
                className="flex justify-center pt-3 pb-1 flex-shrink-0"
                aria-hidden="true"
              >
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>
            )}

            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait" initial={false}>
                {status === "success" ? (
                  <SuccessPanel
                    key="success"
                    whatsappUrl={whatsappUrl}
                    onClose={onClose}
                  />
                ) : step === 1 ? (
                  <Step1Panel
                    key="step1"
                    service={service}
                    meta={meta}
                    whatsappUrl={whatsappUrl}
                    onClose={onClose}
                    onContinue={() => setStep(2)}
                  />
                ) : (
                  <Step2Panel
                    key="step2"
                    service={service}
                    form={form}
                    errors={errors}
                    status={status}
                    errorMsg={errorMsg}
                    showSpecialRequest={showSpecialRequest}
                    onBack={() => setStep(1)}
                    onChange={handleChange}
                    onToggleSpecialRequest={() =>
                      setShowSpecialRequest((v) => !v)
                    }
                    onSubmit={handleSubmit}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Step 1 — "The Hook" ────────────────────────────────────────────────────────

interface Step1PanelProps {
  service: BookingPanelProps["service"];
  meta?: BookingPanelProps["meta"];
  whatsappUrl: string | null;
  onClose: () => void;
  onContinue: () => void;
}

function Step1Panel({
  service,
  meta,
  whatsappUrl,
  onClose,
  onContinue,
}: Step1PanelProps) {
  type Pill = { icon: React.ReactNode; text: string };
  const pills: Pill[] = [
    ...(meta?.location ? [{ icon: <MapPin size={11} />, text: meta.location }] : []),
    ...(meta?.duration ? [{ icon: <Clock size={11} />, text: meta.duration }] : []),
    ...(meta?.price ? [{ icon: null as React.ReactNode, text: meta.price }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-5 px-7 pt-6 pb-8"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[10px] tracking-widest uppercase text-[var(--color-terracotta)] mb-1.5">
            Request Availability
          </p>
          <h2
            id="bp-title"
            className="font-serif text-xl leading-snug text-[var(--color-sand-light)] truncate"
          >
            {service.title}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close booking panel"
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 mt-0.5 border border-white/10 text-[var(--color-sand-light)]/40 hover:text-[var(--color-sand-light)] hover:border-white/25 transition-colors duration-150"
        >
          <X size={16} />
        </button>
      </div>

      {/* Meta summary pills */}
      {pills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pills.map((pill, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-sand-light)]/[0.06] border border-white/[0.07] font-sans text-[11px] text-[var(--color-sand-light)]/65 rounded-sm"
            >
              {pill.icon}
              {pill.text}
            </span>
          ))}
        </div>
      )}

      {/* Trust signals */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="flex items-center gap-1.5 font-sans text-[10px] tracking-wide text-[var(--color-charcoal-light)]">
          <Zap size={11} className="text-[var(--color-gold)] flex-shrink-0" />
          Replies within 2 hours
        </span>
        <span className="flex items-center gap-1.5 font-sans text-[10px] tracking-wide text-[var(--color-charcoal-light)]">
          <Lock size={11} className="text-[var(--color-gold)] flex-shrink-0" />
          No payment required now
        </span>
      </div>

      {/* Primary CTA — terracotta with glow */}
      <button
        onClick={onContinue}
        className="flex items-center justify-center h-14 w-full bg-[var(--color-terracotta)] text-white font-sans text-sm tracking-widest uppercase hover:brightness-110 active:brightness-95 transition-all duration-200"
        style={{ boxShadow: "0 0 24px rgba(197,107,92,0.35)" }}
      >
        BOOK NOW →
      </button>

      {/* WhatsApp soft link */}
      {whatsappUrl && (
        <div className="text-center pt-0.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-sans text-[12px] text-[var(--color-charcoal-light)] hover:text-[var(--color-sand-light)] transition-colors duration-150"
          >
            <MessageCircle size={13} />
            or chat directly on WhatsApp
          </a>
        </div>
      )}
    </motion.div>
  );
}

// ── Step 2 — "The Form" ────────────────────────────────────────────────────────

interface Step2PanelProps {
  service: BookingPanelProps["service"];
  form: FormState;
  errors: Record<string, string>;
  status: Status;
  errorMsg: string;
  showSpecialRequest: boolean;
  onBack: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onToggleSpecialRequest: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

function Step2Panel({
  service,
  form,
  errors,
  status,
  errorMsg,
  showSpecialRequest,
  onBack,
  onChange,
  onToggleSpecialRequest,
  onSubmit,
}: Step2PanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 px-7 pt-5 pb-8"
    >
      {/* Header: back arrow + title + progress */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back to step 1"
          className="flex-shrink-0 flex items-center justify-center w-8 h-8 border border-white/10 text-[var(--color-sand-light)]/40 hover:text-[var(--color-sand-light)] hover:border-white/25 transition-colors duration-150"
        >
          <ArrowLeft size={16} />
        </button>

        <h2
          id="bp-title"
          className="flex-1 font-serif text-lg leading-snug text-[var(--color-sand-light)] truncate min-w-0"
        >
          {service.title}
        </h2>

        {/* Progress: 2 dots, second active */}
        <div className="flex-shrink-0 flex items-center gap-1.5" aria-label="Step 2 of 2">
          <div className="w-4 h-1 rounded-full bg-[var(--color-charcoal-light)]/25" />
          <div className="w-4 h-1 rounded-full bg-[var(--color-terracotta)]" />
        </div>
      </div>

      <p className="font-sans text-[10px] tracking-widest uppercase text-[var(--color-charcoal-light)] -mt-1">
        Step 2 of 2 — Your Details
      </p>

      {/* Error banner */}
      <AnimatePresence>
        {status === "error" && errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[var(--color-obsidian)] border border-[var(--color-terracotta)]/35 text-[var(--color-terracotta)] font-sans text-[12px] px-4 py-3 leading-relaxed"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {/* Row 1: Name + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            icon={<User size={13} />}
            label="Name *"
            name="full_name"
            type="text"
            placeholder="Your name"
            value={form.full_name}
            onChange={onChange}
            error={errors.full_name}
          />
          <InputField
            icon={<Phone size={13} />}
            label="Phone *"
            name="phone"
            type="tel"
            placeholder="+212 6xx"
            value={form.phone}
            onChange={onChange}
            error={errors.phone}
          />
        </div>

        {/* Row 2: Email */}
        <InputField
          icon={<Mail size={13} />}
          label="Email *"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={onChange}
          error={errors.email}
        />

        {/* Row 3: Date + Guests */}
        <div className="grid grid-cols-2 gap-3">
          <InputField
            icon={<Calendar size={13} />}
            label="Date *"
            name="preferred_date"
            type="date"
            value={form.preferred_date}
            onChange={onChange}
            error={errors.preferred_date}
          />
          <InputField
            icon={<Users size={13} />}
            label="Guests *"
            name="guests_count"
            type="number"
            min={1}
            max={20}
            placeholder="1"
            value={String(form.guests_count)}
            onChange={onChange}
            error={errors.guests_count}
          />
        </div>

        {/* Special request — collapsible */}
        <div>
          <button
            type="button"
            onClick={onToggleSpecialRequest}
            className="flex items-center gap-1.5 font-sans text-[11px] tracking-wide text-[var(--color-charcoal-light)] hover:text-[var(--color-sand-light)] transition-colors duration-150"
          >
            <ChevronDown
              size={13}
              className={`transition-transform duration-200 ${showSpecialRequest ? "rotate-180" : ""}`}
            />
            Add a special request? (optional)
          </button>

          <AnimatePresence>
            {showSpecialRequest && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-3">
                  <div className="relative">
                    <MessageSquare
                      size={13}
                      className="absolute top-3.5 left-3.5 text-[var(--color-charcoal-light)]/45 pointer-events-none"
                    />
                    <textarea
                      name="message"
                      rows={3}
                      placeholder="Dietary needs, accessibility, special occasion…"
                      value={form.message}
                      onChange={onChange}
                      className="w-full pl-10 pr-4 py-3 bg-[var(--color-obsidian)] border border-white/10 font-sans text-sm text-[var(--color-sand-light)] placeholder-[var(--color-charcoal-light)]/40 focus:outline-none focus:border-[var(--color-terracotta)]/40 transition-colors resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center justify-center gap-2 h-14 w-full bg-[var(--color-terracotta)] text-white font-sans text-sm tracking-widest uppercase hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 mt-1"
          style={{ boxShadow: "0 0 24px rgba(197,107,92,0.35)" }}
        >
          {status === "loading" ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Sending…
            </>
          ) : (
            "SEND REQUEST →"
          )}
        </button>
      </form>
    </motion.div>
  );
}

// ── Input Field ────────────────────────────────────────────────────────────────

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  error?: string;
}

function InputField({
  icon,
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  min,
  max,
  error,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={`bp-${name}`}
        className="font-sans text-[10px] tracking-widest uppercase text-[var(--color-charcoal-light)]"
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute top-1/2 -translate-y-1/2 left-3.5 text-[var(--color-charcoal-light)]/50 pointer-events-none">
          {icon}
        </div>
        <input
          id={`bp-${name}`}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          className={[
            "w-full h-11 pl-10 pr-4 bg-[var(--color-obsidian)] border font-sans text-sm text-[var(--color-sand-light)] placeholder-[var(--color-charcoal-light)]/40 focus:outline-none transition-colors",
            error
              ? "border-[var(--color-terracotta)]"
              : "border-white/10 focus:border-[var(--color-terracotta)]/40",
          ].join(" ")}
        />
      </div>
      {error && (
        <p className="font-sans text-[10px] text-[var(--color-terracotta)] mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}

// ── Success Panel ──────────────────────────────────────────────────────────────

function SuccessPanel({
  whatsappUrl,
  onClose,
}: {
  whatsappUrl: string | null;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center text-center px-7 py-12 gap-6"
    >
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[var(--color-terracotta)]/10">
        <CheckCircle2 size={40} className="text-[var(--color-terracotta)]" />
      </div>

      <div>
        <h3 className="font-serif text-2xl text-[var(--color-sand-light)] mb-3">
          Request Sent!
        </h3>
        <p className="font-sans text-sm text-[var(--color-charcoal-light)] leading-relaxed max-w-[240px] mx-auto">
          We&apos;ll confirm within 2 hours. Check your email &amp; WhatsApp.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full mt-2">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 h-12 bg-[var(--color-terracotta)] text-white font-sans text-[12px] tracking-[0.15em] uppercase hover:brightness-110 transition-all duration-200"
          >
            <MessageCircle size={14} />
            Speed things up on WhatsApp
          </a>
        )}
        <button
          onClick={onClose}
          className="h-12 border border-white/10 text-[var(--color-sand-light)]/55 font-sans text-[12px] tracking-[0.15em] uppercase hover:border-white/20 hover:text-[var(--color-sand-light)] transition-colors duration-150"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
