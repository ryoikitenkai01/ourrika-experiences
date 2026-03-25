"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  MapPin,
  Tent,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/passcode";
import { useTransition } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: Inbox },
  { label: "Experiences", href: "/admin/experiences", icon: Tent },
  { label: "Destinations", href: "/admin/destinations", icon: MapPin },
  { label: "Partners", href: "/admin/partners", icon: Users }, 
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      logoutAdmin();
    });
  }

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full text-zinc-300">
      <div className="h-16 flex items-center px-6 border-b border-zinc-800/50 flex-shrink-0">
        <Link
          href="/admin"
          className="font-serif text-lg text-white tracking-wide"
        >
          Ourrika Admin
        </Link>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-sans font-medium tracking-wider text-zinc-500 uppercase">
          Operations
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm transition-colors ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-800 mt-auto">
        <button
          onClick={handleLogout}
          disabled={isPending}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 w-full text-left transition-colors disabled:opacity-50"
        >
          <LogOut size={18} />
          {isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
