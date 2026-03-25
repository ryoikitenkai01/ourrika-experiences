"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Pencil,
  Trash2,
  Calendar,
  Search,
  MoreVertical,
  Tag,
} from "lucide-react";
import { deleteOffer } from "@/app/actions/offers";

interface OfferRow {
  id: string;
  title: string;
  slug: string | null;
  cover_image: string | null;
  original_price: number | null;
  promo_price: number | null;
  valid_from: string | null;
  valid_until: string | null;
  is_featured: boolean | null;
  created_at: string;
}

interface Props {
  offers: OfferRow[];
}

export function OffersTable({ offers }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = offers.filter(
    (o) =>
      o.title.toLowerCase().includes(query.toLowerCase()) ||
      (o.slug && o.slug.toLowerCase().includes(query.toLowerCase()))
  );

  async function handleDelete(id: string) {
    if (!confirm("Delete this offer permanently? This cannot be undone."))
      return;

    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteOffer(id);
      if (result.error) {
        alert("Failed to delete: " + result.error);
      }
      setDeletingId(null);
      setOpenMenuId(null);
      router.refresh();
    });
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (offers.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
          <Tag size={24} className="text-zinc-400" />
        </div>
        <p className="font-sans text-zinc-500 text-sm mb-1">
          No offers found.
        </p>
        <p className="font-sans text-zinc-400 text-xs">
          Create seasonal offers or discounts here.
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
          placeholder="Search offers…"
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
                  Offer Details
                </th>
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500 hidden sm:table-cell">
                  Pricing
                </th>
                <th className="text-left px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500 hidden lg:table-cell">
                  Validity
                </th>
                <th className="text-right px-5 py-3.5 font-sans text-xs font-medium tracking-wider uppercase text-zinc-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filtered.map((offer) => (
                <tr
                  key={offer.id}
                  className={`hover:bg-zinc-50/80 transition-colors ${
                    deletingId === offer.id ? "opacity-50" : ""
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0 relative">
                        {offer.cover_image ? (
                          <Image
                            src={offer.cover_image}
                            alt={offer.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                             <Tag size={16} className="text-zinc-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans text-sm font-medium text-zinc-800 truncate">
                          {offer.title}
                        </p>
                        <p className="font-sans text-xs text-zinc-400 truncate">
                          /{offer.slug || "no-slug"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 hidden sm:table-cell">
                    <div className="flex flex-col">
                      <span className="font-sans text-sm text-emerald-600 font-medium">
                        {offer.promo_price ? offer.promo_price.toLocaleString() : "—"}{" "}
                        <span className="text-zinc-400 font-normal text-xs uppercase">MAD</span>
                      </span>
                      {offer.original_price && (
                        <span className="font-sans text-xs text-zinc-400 line-through">
                          {offer.original_price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1.5 font-sans text-xs text-zinc-600">
                        <Calendar size={12} className="text-zinc-300" />
                        {formatDate(offer.valid_from)} - {formatDate(offer.valid_until)}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="relative inline-block">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === offer.id ? null : offer.id
                          )
                        }
                        className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {openMenuId === offer.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg border border-zinc-200 shadow-lg z-20 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                            <Link
                              href={`/admin/offers/${offer.id}`}
                              className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <Pencil size={14} />
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(offer.id)}
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
