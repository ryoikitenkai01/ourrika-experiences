"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Pencil,
  Trash2,
  Star,
  MapPin,
  Search,
  MoreVertical,
} from "lucide-react";
import { deleteExperience } from "@/app/actions/experiences";

interface ExperienceRow {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  location: string | null;
  price: number | null;
  currency: string | null;
  is_featured: boolean | null;
  homepage_order: number | null;
  created_at: string;
}

interface Props {
  experiences: ExperienceRow[];
}

export function ExperiencesTable({ experiences }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = experiences.filter(
    (e) =>
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.location?.toLowerCase().includes(query.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm("Delete this experience permanently? This cannot be undone."))
      return;

    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteExperience(id);
      if (result.error) {
        alert("Failed to delete: " + result.error);
      }
      setDeletingId(null);
      setOpenMenuId(null);
      router.refresh();
    });
  }

  if (experiences.length === 0) {
    return (
      <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-lg p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--color-admin-surface-raised)] flex items-center justify-center mb-4">
          <Search size={24} className="text-[var(--color-admin-text-muted)]" />
        </div>
        <p className="font-sans text-[var(--color-admin-text-muted)] text-sm mb-1">
          No experiences found.
        </p>
        <p className="font-sans text-[var(--color-admin-text-muted)] text-xs">
          Create your first experience to get started.
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
          placeholder="Search by title or location…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-[var(--color-admin-input-bg)] border border-[var(--color-admin-border)] rounded-lg font-sans text-sm text-[var(--color-admin-text)] placeholder:text-[var(--color-admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-[var(--color-admin-surface)] border border-[var(--color-admin-border)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-admin-border)]">
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-[var(--color-admin-text-muted)]">
                  Experience
                </th>
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-[var(--color-admin-text-muted)] hidden md:table-cell">
                  Location
                </th>
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-[var(--color-admin-text-muted)] hidden sm:table-cell">
                  Price
                </th>
                <th className="text-center px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-[var(--color-admin-text-muted)] hidden lg:table-cell">
                  Featured
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
              {filtered.map((exp) => (
                <tr
                  key={exp.id}
                  className={`hover:bg-[var(--color-admin-hover)] transition-colors ${
                    deletingId === exp.id ? "opacity-50" : ""
                  }`}
                >
                  {/* Experience Cell */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--color-admin-surface-raised)] flex-shrink-0 relative">
                        {exp.cover_image ? (
                          <Image
                            src={exp.cover_image}
                            alt={exp.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[var(--color-admin-border)]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-[var(--color-admin-text)] truncate">
                          {exp.title}
                        </p>
                        <p className="font-sans text-xs text-[var(--color-admin-text-muted)] truncate">
                          /{exp.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    {exp.location ? (
                      <span className="inline-flex items-center gap-1 font-sans text-sm text-[var(--color-admin-text)]">
                        <MapPin size={13} className="text-[var(--color-admin-text-muted)]" />
                        {exp.location}
                      </span>
                    ) : (
                      <span className="font-sans text-sm text-[var(--color-admin-text-muted)]">—</span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 hidden sm:table-cell">
                    {exp.price != null ? (
                      <span className="font-sans text-sm text-[var(--color-admin-text)] font-medium">
                        {exp.price.toLocaleString()}{" "}
                        <span className="text-[var(--color-admin-text-muted)] font-normal text-xs">
                          {exp.currency || "MAD"}
                        </span>
                      </span>
                    ) : (
                      <span className="font-sans text-sm text-[var(--color-admin-text-muted)]">—</span>
                    )}
                  </td>

                  {/* Featured */}
                  <td className="px-5 py-4 hidden lg:table-cell text-center">
                    {exp.is_featured ? (
                      <Star
                        size={16}
                        className="inline text-amber-500 fill-amber-500"
                      />
                    ) : (
                      <span className="text-[var(--color-admin-text-muted)]">—</span>
                    )}
                  </td>

                  {/* Order */}
                  <td className="px-5 py-4 hidden lg:table-cell text-center">
                    <span className="font-sans text-sm text-[var(--color-admin-text-muted)]">
                      {exp.homepage_order ?? "—"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === exp.id ? null : exp.id
                          )
                        }
                        className="p-1.5 rounded-md hover:bg-[var(--color-admin-hover)] text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text)] transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === exp.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-40 bg-[var(--color-admin-surface-raised)] rounded-lg border border-[var(--color-admin-border)] shadow-lg z-20 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            <Link
                              href={`/admin/experiences/${exp.id}`}
                              className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-[var(--color-admin-text)] hover:bg-[var(--color-admin-hover)] transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(exp.id)}
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

        {filtered.length === 0 && query && (
          <div className="py-12 text-center text-[var(--color-admin-text-muted)] font-sans text-sm">
            No experiences match &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
