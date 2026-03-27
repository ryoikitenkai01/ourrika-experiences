import type { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo";

export const metadata: Metadata = generateDynamicMetadata({
  title: "Privacy Policy",
  description: "How Ourrika Experiences handles your personal data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5EFE4]">
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#9d9d9b] mb-6">
            Legal
          </p>
          <h1 className="font-serif italic text-4xl md:text-5xl text-[#1A1A1A] mb-12">
            Privacy Policy
          </h1>
          <div className="font-sans text-sm text-[#5c605d] leading-relaxed space-y-6">
            <p>
              This Privacy Policy describes how Ourrika Experiences collects, uses, and protects
              information you provide when using our website or booking services.
            </p>
            <p>
              We collect only the information necessary to respond to your inquiries and confirm
              reservations — including your name, email, phone number, and travel preferences.
              This information is never sold or shared with third parties outside of your booking.
            </p>
            <p>
              For questions about your data, contact us at{" "}
              <a href="mailto:hello@ourrika.com" className="underline hover:text-[#1A1A1A] transition-colors">
                hello@ourrika.com
              </a>
              .
            </p>
            <p className="text-[#9d9d9b] text-[11px] tracking-wide uppercase">
              Last updated: March 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
