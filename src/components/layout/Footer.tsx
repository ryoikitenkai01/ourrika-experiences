import Link from "next/link";
import type { SiteSettings } from "@/lib/types/ui";

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-[var(--color-obsidian)] w-full py-24 px-8 border-t border-[var(--color-gold)]/15">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-lg font-serif italic tracking-[0.3em] text-[var(--color-sand-light)] uppercase">
          Ourrika
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="/about" className="text-[var(--color-charcoal-light)] hover:text-[var(--color-sand-light)] font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
            About
          </Link>
          <Link href="/privacy" className="text-[var(--color-charcoal-light)] hover:text-[var(--color-sand-light)] font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[var(--color-charcoal-light)] hover:text-[var(--color-sand-light)] font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
            Terms of Service
          </Link>
          <Link href={settings.contact_email ? `mailto:${settings.contact_email}` : "mailto:hello@ourrika.com"} className="text-[var(--color-charcoal-light)] hover:text-[var(--color-sand-light)] font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
            Contact Us
          </Link>
          {settings.instagram_link && (
            <Link href={settings.instagram_link} target="_blank" className="text-[var(--color-charcoal-light)] hover:text-[var(--color-sand-light)] font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
              Instagram
            </Link>
          )}
        </div>

        {/* Copyright */}
        <div className="text-[var(--color-charcoal-light)] font-sans text-[10px] tracking-widest uppercase text-center md:text-right">
          © {new Date().getFullYear()} OURRIKA EXPERIENCES. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
