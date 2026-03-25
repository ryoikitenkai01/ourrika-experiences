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
      <div className="bg-white border border-zinc-200 rounded-lg p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
          <Search size={24} className="text-zinc-400" />
        </div>
        <p className="font-sans text-zinc-500 text-sm mb-1">
          No experiences found.
        </p>
        <p className="font-sans text-zinc-400 text-xs">
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
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Search by title or location…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-zinc-200 rounded-lg font-sans text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500">
                  Experience
                </th>
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500 hidden md:table-cell">
                  Location
                </th>
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500 hidden sm:table-cell">
                  Price
                </th>
                <th className="text-center px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500 hidden lg:table-cell">
                  Featured
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
              {filtered.map((exp) => (
                <tr
                  key={exp.id}
                  className={`hover:bg-zinc-50/80 transition-colors ${
                    deletingId === exp.id ? "opacity-50" : ""
                  }`}
                >
                  {/* Experience Cell */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 relative">
                        {exp.cover_image ? (
                          <Image
                            src={exp.cover_image}
                            alt={exp.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-200" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-zinc-800 truncate">
                          {exp.title}
                        </p>
                        <p className="font-sans text-xs text-zinc-400 truncate">
                          /{exp.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 hidden md:table-cell">
                    {exp.location ? (
                      <span className="inline-flex items-center gap-1 font-sans text-sm text-zinc-600">
                        <MapPin size={13} className="text-zinc-400" />
                        {exp.location}
                      </span>
                    ) : (
                      <span className="font-sans text-sm text-zinc-300">—</span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 hidden sm:table-cell">
                    {exp.price != null ? (
                      <span className="font-sans text-sm text-zinc-700 font-medium">
                        {exp.price.toLocaleString()}{" "}
                        <span className="text-zinc-400 font-normal text-xs">
                          {exp.currency || "MAD"}
                        </span>
                      </span>
                    ) : (
                      <span className="font-sans text-sm text-zinc-300">—</span>
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
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>

                  {/* Order */}
                  <td className="px-5 py-4 hidden lg:table-cell text-center">
                    <span className="font-sans text-sm text-zinc-500">
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
                        className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === exp.id && (
                        <>
                          {/* Backdrop to close menu */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg border border-zinc-200 shadow-lg z-20 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            <Link
                              href={`/admin/experiences/${exp.id}`}
                              className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(exp.id)}
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

        {filtered.length === 0 && query && (
          <div className="py-12 text-center text-zinc-400 font-sans text-sm">
            No experiences match &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
