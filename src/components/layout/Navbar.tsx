"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types/ui";

interface NavbarProps {
  settings: SiteSettings;
}

export function Navbar({ settings }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Destinations", href: "/destinations" },
    { label: "Ourrika Experience", href: "/experiences" },
    { label: "Journal", href: "/journal" },
  ];

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
             {/* Temporary Wordmark Placeholder (No circle, no icon) */}
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
                className="font-serif text-[14px] tracking-wide text-[#333333] transition-all hover:border-b hover:border-[#C0714F] py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT SIDE - Actions */}
          <div className="flex items-center gap-6">
            {/* WhatsApp Icon Link (Desktop Only per request, but usually good on both) 
               User said: "Desktop: WhatsApp icon ... Mobile: hamburger menu icon only"
            */}
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/\s+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block text-[#1A1A1A] hover:text-[#C0714F] transition-colors"
              title="Book on WhatsApp"
            >
              <MessageCircle size={22} strokeWidth={1.5} />
            </a>

            {/* Mobile Toggle - Hamburger icon only on mobile */}
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

      {/* MOBILE MENU OVERLAY - Restyled based on beige background from DESIGN.md */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[1001] bg-[#F5EFE4] flex flex-col p-8"
          >
            {/* Header in overlay */}
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

            {/* Links */}
            <nav className="flex flex-col items-center justify-center flex-1 gap-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-3xl tracking-wide text-[#333333] hover:text-[#C0714F] transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Footer in mobile menu */}
            <div className="text-center pt-8 border-t border-[#C0714F]/10">
              <p className="font-serif italic text-sm text-[#C0714F]/60">Escape, Breathe, Explore Morocco</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
