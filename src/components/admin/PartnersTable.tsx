"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Pencil,
  Trash2,
  Search,
  MoreVertical,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { deletePartner } from "@/app/actions/partners";

interface PartnerRow {
  id: string;
  name: string;
  logo: string;
  link: string | null;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
}

interface Props {
  partners: PartnerRow[];
}

export function PartnersTable({ partners }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = partners.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm("Remove this partner permanently? This cannot be undone."))
      return;

    setDeletingId(id);
    startTransition(async () => {
      const result = await deletePartner(id);
      if (result.error) {
        alert("Failed to delete: " + result.error);
      }
      setDeletingId(null);
      setOpenMenuId(null);
      router.refresh();
    });
  }

  if (partners.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
          <CheckCircle2 size={24} className="text-zinc-400" />
        </div>
        <p className="font-sans text-zinc-500 text-sm mb-1">
          No partners found.
        </p>
        <p className="font-sans text-zinc-400 text-xs">
          Add your first brand partner to showcase them on the public site.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Search by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg font-sans text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] transition-all"
        />
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500">
                  Partner
                </th>
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500 hidden sm:table-cell">
                  Link
                </th>
                <th className="text-center px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500 hidden lg:table-cell">
                  Status
                </th>
                <th className="text-center px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500 hidden lg:table-cell">
                   Order
                </th>
                <th className="text-right px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.map((partner) => (
                <tr
                  key={partner.id}
                  className={`hover:bg-zinc-50/80 transition-colors ${
                    deletingId === partner.id ? "opacity-50" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded bg-zinc-50 flex items-center justify-center p-2 relative overflow-hidden border border-zinc-100 group">
                        {partner.logo ? (
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-200" />
                        )}
                      </div>
                      <span className="font-sans text-sm font-medium text-zinc-800">
                        {partner.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 hidden sm:table-cell">
                    {partner.link ? (
                      <a
                        href={partner.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-[var(--color-terracotta)] transition-colors"
                      >
                         <ExternalLink size={14} />
                         <span className="font-sans text-xs max-w-[150px] truncate">
                           {partner.link.replace(/^https?:\/\//, "")}
                         </span>
                      </a>
                    ) : (
                      <span className="text-zinc-300 font-sans text-xs">—</span>
                    )}
                  </td>

                  <td className="px-5 py-4 hidden lg:table-cell text-center">
                    {partner.is_active ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-zinc-100 text-zinc-400 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider">
                        Hidden
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 hidden lg:table-cell text-center font-sans text-sm text-zinc-500">
                    {partner.display_order ?? "—"}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === partner.id ? null : partner.id
                          )
                        }
                        className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === partner.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg border border-zinc-200 shadow-lg z-20 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            <Link
                              href={`/admin/partners/${partner.id}`}
                              className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(partner.id)}
                              disabled={isPending}
                              className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
