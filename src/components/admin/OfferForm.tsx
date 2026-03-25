"use client";

import { useTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createOffer, updateOffer } from "@/app/actions/offers";
import { Save, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

interface OfferRow {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  cover_image: string | null;
  original_price: number | null;
  promo_price: number | null;
  valid_from: string | null;
  valid_until: string | null;
  is_featured: boolean | null;
  linked_experience_id: string | null;
  linked_destination_id: string | null;
}

interface ReferenceItem {
  id: string;
  name: string;
}

interface Props {
  initialData: OfferRow | null;
  experiences: ReferenceItem[];
  destinations: ReferenceItem[];
}

export function OfferForm({ initialData, experiences, destinations }: Props) {
  const isEditing = !!initialData;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [coverPreview, setCoverPreview] = useState(initialData?.cover_image || "");

  async function handleSubmit(formData: FormData) {
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      let result;
      if (isEditing) {
        result = await updateOffer(initialData.id, {}, formData);
      } else {
        result = await createOffer({}, formData);
      }

      if (result?.error) {
        setError(result.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (result?.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/admin/offers");
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-8 bg-white p-8 border border-zinc-200 shadow-sm"
    >
      {/* Messages */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg font-sans text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Basic Info */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl border-b border-zinc-100 pb-2 text-[var(--color-charcoal)]">
            Offer Details
          </h2>

          <div>
            <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
              Title *
            </label>
            <input
              name="title"
              type="text"
              defaultValue={initialData?.title}
              required
              placeholder="e.g. Winter Desert Special"
              className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
            />
            {fieldErrors.title && (
              <p className="mt-1 text-red-600 text-xs font-sans">{fieldErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
              Slug
            </label>
            <input
              name="slug"
              type="text"
              defaultValue={initialData?.slug || ""}
              placeholder="winter-desert-special"
              className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 font-mono text-zinc-600"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
                Original Price
              </label>
              <input
                name="original_price"
                type="number"
                defaultValue={initialData?.original_price ?? ""}
                placeholder="2000"
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
              />
            </div>
            <div className="flex-1">
              <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
                Promo Price *
              </label>
              <input
                name="promo_price"
                type="number"
                defaultValue={initialData?.promo_price ?? ""}
                placeholder="1500"
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
                Valid From
              </label>
              <input
                name="valid_from"
                type="date"
                defaultValue={initialData?.valid_from || ""}
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
              />
            </div>
            <div className="flex-1">
              <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
                Valid Until
              </label>
              <input
                name="valid_until"
                type="date"
                defaultValue={initialData?.valid_until || ""}
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Media & Connections */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl border-b border-zinc-100 pb-2 text-[var(--color-charcoal)]">
            Media & Connections
          </h2>

          <div>
            <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
              Cover Image URL
            </label>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-zinc-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden relative border border-zinc-200">
                {coverPreview ? (
                  <Image src={coverPreview} alt="Cover preview" fill className="object-cover" />
                ) : (
                  <ImageIcon className="text-zinc-400" size={24} />
                )}
              </div>
              <div className="flex-1">
                <input
                  name="cover_image"
                  type="url"
                  defaultValue={initialData?.cover_image || ""}
                  onChange={(e) => setCoverPreview(e.target.value)}
                  placeholder="https://example.com/promo.jpg"
                  className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-sans text-sm font-medium text-zinc-700">Link to Service (Optional)</h3>
            <div className="space-y-3 p-4 bg-zinc-50 border border-zinc-100 rounded-lg">
              <div>
                <label className="block font-sans text-xs font-medium text-zinc-500 mb-1">Linked Experience</label>
                <select
                  name="linked_experience_id"
                  defaultValue={initialData?.linked_experience_id || "none"}
                  className="w-full px-3 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 bg-white"
                >
                  <option value="none">No specific experience</option>
                  {experiences.map(exp => (
                    <option key={exp.id} value={exp.id}>{exp.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-sans text-xs font-medium text-zinc-500 mb-1">Linked Destination</label>
                <select
                  name="linked_destination_id"
                  defaultValue={initialData?.linked_destination_id || "none"}
                  className="w-full px-3 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 bg-white"
                >
                  <option value="none">No specific destination</option>
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>{dest.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                name="is_featured"
                type="checkbox"
                defaultChecked={initialData?.is_featured ?? false}
                className="w-5 h-5 accent-[var(--color-terracotta)] border-zinc-300 rounded cursor-pointer"
              />
              <span className="font-sans text-sm font-medium text-zinc-700 select-none">
                Featured on Homepage
              </span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
          Description / Details
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialData?.description || ""}
          placeholder="Specific details about what's included in this offer..."
          className="w-full px-4 py-3 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 resize-y"
        />
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-100">
        <Link
          href="/admin/offers"
          className="px-5 py-2.5 rounded-lg font-sans text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-charcoal)] hover:bg-black text-white font-sans text-sm font-medium tracking-wide rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : <><Save size={16} /> {isEditing ? "Save Offer" : "Create Offer"}</>}
        </button>
      </div>
    </form>
  );
}
