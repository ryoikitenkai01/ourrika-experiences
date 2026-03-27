"use client";

import { Home, Compass, Map, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function MobileStickyBar({ whatsappNumber }: { whatsappNumber: string }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Experiences", href: "/experiences", icon: Compass },
    { label: "Destinations", href: "/destinations", icon: Map },
    { label: "Chat", href: `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`, icon: MessageCircle, isExternal: true },
  ];

  const isActive = (href: string) => 
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
    >
      <nav className="glass-dark border border-white/10 rounded-full px-6 py-4 flex items-center justify-between shadow-premium">
        {navItems.map((item) => {
          const Active = isActive(item.href);
          const Icon = item.icon;

          if (item.isExternal) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 group"
              >
                <Icon size={20} className="text-[var(--color-sand-light)]/60 group-hover:text-[var(--color-terracotta)] transition-colors" />
                <span className="text-[8px] uppercase tracking-widest text-[var(--color-sand-light)]/40 group-hover:text-[var(--color-terracotta)] transition-colors">
                  {item.label}
                </span>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 group"
            >
              <Icon 
                size={20} 
                className={Active ? "text-[var(--color-terracotta)]" : "text-[var(--color-sand-light)]/60 group-hover:text-[var(--color-terracotta)] transition-colors"} 
              />
              <span className={Active 
                ? "text-[8px] uppercase tracking-widest text-[var(--color-terracotta)]" 
                : "text-[8px] uppercase tracking-widest text-[var(--color-sand-light)]/40 group-hover:text-[var(--color-terracotta)] transition-colors"
              }>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
