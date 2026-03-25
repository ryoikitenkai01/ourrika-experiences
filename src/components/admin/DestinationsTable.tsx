"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Pencil,
  Trash2,
  Star,
  Search,
  MoreVertical,
  Check,
} from "lucide-react";
import { deleteDestination } from "@/app/actions/destinations";

interface DestinationRow {
  id: string;
  name: string;
  slug: string;
  cover_image: string;
  starting_price: number | null;
  currency: string | null;
  is_featured: boolean | null;
  is_most_booked: boolean | null;
  homepage_order: number | null;
  created_at: string;
}

interface Props {
  destinations: DestinationRow[];
}

export function DestinationsTable({ destinations }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.slug.toLowerCase().includes(query.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm("Delete this destination permanently? This cannot be undone."))
      return;

    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteDestination(id);
      if (result.error) {
        alert("Failed to delete: " + result.error);
      }
      setDeletingId(null);
      setOpenMenuId(null);
      router.refresh();
    });
  }

  if (destinations.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
          <Search size={24} className="text-zinc-400" />
        </div>
        <p className="font-sans text-zinc-500 text-sm mb-1">
          No destinations found.
        </p>
        <p className="font-sans text-zinc-400 text-xs">
          Create your first destination to get started.
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
          placeholder="Search by name or slug…"
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
                  Destination
                </th>
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500 hidden sm:table-cell">
                  Starting Price
                </th>
                <th className="text-center px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500 hidden lg:table-cell">
                  Featured
                </th>
                <th className="text-center px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500 hidden lg:table-cell">
                  Popular
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
              {filtered.map((dest) => (
                <tr
                  key={dest.id}
                  className={`hover:bg-zinc-50/80 transition-colors ${
                    deletingId === dest.id ? "opacity-50" : ""
                  }`}
                >
                  {/* Destination Cell */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 relative">
                        {dest.cover_image ? (
                          <Image
                            src={dest.cover_image}
                            alt={dest.name}
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
                          {dest.name}
                        </p>
                        <p className="font-sans text-xs text-zinc-400 truncate">
                          /{dest.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Starting Price */}
                  <td className="px-5 py-4 hidden sm:table-cell">
                    {dest.starting_price != null ? (
                      <span className="font-sans text-sm text-zinc-700 font-medium">
                        {dest.starting_price.toLocaleString()}{" "}
                        <span className="text-zinc-400 font-normal text-xs">
                          {dest.currency || "USD"}
                        </span>
                      </span>
                    ) : (
                      <span className="font-sans text-sm text-zinc-300">—</span>
                    )}
                  </td>

                  {/* Featured */}
                  <td className="px-5 py-4 hidden lg:table-cell text-center">
                    {dest.is_featured ? (
                      <Star
                        size={16}
                        className="inline text-amber-500 fill-amber-500"
                      />
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>

                  {/* Most Booked (Popular) */}
                  <td className="px-5 py-4 hidden lg:table-cell text-center">
                    {dest.is_most_booked ? (
                      <Check
                        size={16}
                        className="inline text-emerald-500"
                      />
                    ) : (
                      <span className="text-zinc-300">—</span>
                    )}
                  </td>

                  {/* Order */}
                  <td className="px-5 py-4 hidden lg:table-cell text-center">
                    <span className="font-sans text-sm text-zinc-500">
                      {dest.homepage_order ?? "—"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === dest.id ? null : dest.id
                          )
                        }
                        className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === dest.id && (
                        <>
                          {/* Backdrop to close menu */}
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg border border-zinc-200 shadow-lg z-20 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            <Link
                              href={`/admin/destinations/${dest.id}`}
                              className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(dest.id)}
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
            No destinations match &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
