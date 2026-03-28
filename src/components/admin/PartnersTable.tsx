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
      <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-lg p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-admin-surface-raised)] flex items-center justify-center mb-4">
          <CheckCircle2 size={24} className="text-[var(--color-admin-text-muted)]" />
        </div>
        <p className="font-sans text-[var(--color-admin-text-muted)] text-sm mb-1">
          No partners found.
        </p>
        <p className="font-sans text-[var(--color-admin-text-muted)] text-xs">
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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-admin-text-muted)]"
        />
        <input
          type="text"
          placeholder="Search by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-admin-input-bg)] border border-[var(--color-admin-border)] rounded-lg font-sans text-sm text-[var(--color-admin-text)] placeholder:text-[var(--color-admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] transition-all"
        />
      </div>

      <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-admin-border)]">
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-[var(--color-admin-text-muted)]">
                  Partner
                </th>
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-[var(--color-admin-text-muted)] hidden sm:table-cell">
                  Link
                </th>
                <th className="text-center px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-[var(--color-admin-text-muted)] hidden lg:table-cell">
                  Status
                </th>
                <th className="text-center px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-[var(--color-admin-text-muted)] hidden lg:table-cell">
                   Order
                </th>
                <th className="text-right px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-[var(--color-admin-text-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-admin-border)]">
              {filtered.map((partner) => (
                <tr
                  key={partner.id}
                  className={`hover:bg-[var(--color-admin-hover)] transition-colors ${
                    deletingId === partner.id ? "opacity-50" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded bg-[var(--color-admin-surface-raised)] flex items-center justify-center p-2 relative overflow-hidden border border-[var(--color-admin-border)] group">
                        {partner.logo ? (
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--color-admin-border)]" />
                        )}
                      </div>
                      <span className="font-sans text-sm font-medium text-[var(--color-admin-text)]">
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
                        className="inline-flex items-center gap-1.5 text-[var(--color-admin-text-muted)] hover:text-[var(--color-terracotta)] transition-colors"
                      >
                         <ExternalLink size={14} />
                         <span className="font-sans text-xs max-w-[150px] truncate">
                           {partner.link.replace(/^https?:\/\//, "")}
                         </span>
                      </a>
                    ) : (
                      <span className="text-[var(--color-admin-text-muted)] font-sans text-xs">—</span>
                    )}
                  </td>

                  <td className="px-5 py-4 hidden lg:table-cell text-center">
                    {partner.is_active ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[var(--color-admin-surface-raised)] text-[var(--color-admin-text-muted)] rounded-full font-sans text-[10px] font-bold uppercase tracking-wider">
                        Hidden
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 hidden lg:table-cell text-center font-sans text-sm text-[var(--color-admin-text-muted)]">
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
                        className="p-1.5 rounded-md hover:bg-[var(--color-admin-hover)] text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === partner.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-40 bg-[var(--color-admin-surface)] rounded-lg border border-[var(--color-admin-border)] shadow-lg z-20 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            <Link
                              href={`/admin/partners/${partner.id}`}
                              className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-[var(--color-admin-text)] hover:bg-[var(--color-admin-hover)] transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(partner.id)}
                              disabled={isPending}
                              className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full text-left disabled:opacity-50"
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
