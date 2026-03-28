import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo";

export const metadata: Metadata = generateDynamicMetadata({
  title: "Terms of Service",
  description: "Terms and conditions for booking with Ourrika Experiences.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-obsidian)]">
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-[var(--color-charcoal-light)] mb-6">
            Legal
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[var(--color-sand-light)] mb-12">
            Terms of Service
          </h1>
          <div className="font-sans text-sm text-[var(--color-sand-light)]/60 leading-relaxed space-y-6">
            <p>
              By using the Ourrika Experiences website or booking any service, you agree to these
              Terms of Service. These terms govern the relationship between you and Ourrika Experiences.
            </p>
            <p>
              All bookings are subject to availability and confirmed only after direct communication
              with our team. No payment is collected through the website — all arrangements are made
              via WhatsApp or email correspondence.
            </p>
            <p>
              Ourrika Experiences reserves the right to modify, cancel, or reschedule any experience
              due to weather, safety conditions, or other circumstances beyond our control. Guests
              will be notified and offered alternative arrangements.
            </p>
            <p>
              For any queries regarding these terms, please reach out at{" "}
              <a href="mailto:hello@ourrika.com" className="underline hover:text-[var(--color-sand-light)] transition-colors">
                hello@ourrika.com
              </a>
              .
            </p>
            <p className="text-[var(--color-charcoal-light)] text-[11px] tracking-wide uppercase">
              Last updated: March 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
