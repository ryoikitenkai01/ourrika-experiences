import Link from "next/link";
import type { SiteSettings } from "@/lib/types/ui";

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 w-full py-20 px-8 border-t border-zinc-200/20">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0 w-full max-w-[1920px] mx-auto">
        {/* Logo */}
        <div className="text-lg font-serif italic tracking-[0.3em] text-zinc-900 dark:text-zinc-100 uppercase">
          OURRIKA
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8">
          <Link href="/journal" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
            Privacy Policy
          </Link>
          <Link href="/journal" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
            Terms of Service
          </Link>
          <Link href={settings.contact_email ? `mailto:${settings.contact_email}` : "/journal"} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
            Contact Us
          </Link>
          {settings.instagram_link && (
            <Link href={settings.instagram_link} target="_blank" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-sans text-[10px] tracking-widest uppercase transition-colors duration-300">
              Instagram
            </Link>
          )}
        </div>

        {/* Copyright */}
        <div className="text-zinc-400 font-sans text-[10px] tracking-widest uppercase text-center md:text-right">
          © {new Date().getFullYear()} OURRIKA EXPERIENCES. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
}
