"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/lib/types/ui";

interface NavbarProps {
  settings: SiteSettings;
}

export function Navbar({ settings }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Destinations", href: "/destinations" },
    { label: "Activities", href: "/experiences" },
    { label: "Journal", href: "/journal" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-[#E0D6C8]/40 py-4"
            : "bg-white/10 backdrop-blur-md py-6"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* LOGO - Left */}
          <Link href="/" className="flex items-center group transition-opacity hover:opacity-70">
            <span className="font-serif text-[15px] tracking-[0.25em] text-[#1A1A1A] uppercase">
              Ourrika
            </span>
          </Link>

          {/* NAV LINKS - Centered Desktop */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-serif text-[14px] tracking-wide text-[#333333] transition-all py-1 border-b ${
                  isActive(link.href)
                    ? "border-[#C56B5C] text-[#C56B5C]"
                    : "border-transparent hover:border-[#C56B5C] hover:text-[#333333]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE - Actions */}
          <div className="flex items-center gap-6">
            <a
              href={`https://wa.me/${(settings.whatsapp_number || "").replace(/\D/g, '') || "212600000000"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block text-[#1A1A1A] hover:text-[#C56B5C] transition-colors"
              title="Book on WhatsApp"
            >
              <MessageCircle size={22} strokeWidth={1.5} />
            </a>

            <button
              className="md:hidden text-[#1A1A1A] p-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-[1001] bg-[#F5EFE4] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif text-[15px] tracking-[0.25em] text-[#1A1A1A] uppercase">Ourrika</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#1A1A1A] p-2"
                aria-label="Close menu"
              >
                <X size={32} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex flex-col items-center justify-center flex-1 gap-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-serif text-3xl tracking-wide transition-colors ${
                      isActive(link.href) ? "text-[#C56B5C]" : "text-[#333333] hover:text-[#C56B5C]"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="text-center pt-8 border-t border-[#C56B5C]/10">
              <p className="font-serif italic text-sm text-[#C56B5C]/60">Escape, Breathe, Explore Morocco</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
