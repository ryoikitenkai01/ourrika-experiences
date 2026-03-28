"use client";

import { useTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createDestination, updateDestination } from "@/app/actions/destinations";
import { Save, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface DestinationRow {
  id: string;
  name: string;
  slug: string;
  cover_image: string;
  gallery: string[] | null;
  short_description: string | null;
  full_description: string | null;
  starting_price: number | null;
  currency: string | null;
  is_featured: boolean | null;
  is_most_booked: boolean | null;
  homepage_order: number | null;
}

interface Props {
  initialData: DestinationRow | null; // null if creating
}

export function DestinationForm({ initialData }: Props) {
  const isEditing = !!initialData;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const formRef = useRef<HTMLFormElement>(null);

  // States for dynamic rendering (preview)
  const [coverPreview, setCoverPreview] = useState(initialData?.cover_image || "");

  async function handleSubmit(formData: FormData) {
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      let result;
      if (isEditing) {
        result = await updateDestination(initialData.id, {}, formData);
      } else {
        result = await createDestination({}, formData);
      }

      if (result?.error) {
        setError(result.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (result?.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/admin/destinations");
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-8 bg-[var(--color-admin-surface)] p-8 border border-[var(--color-admin-border)]"
    >
      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg font-sans text-sm border border-red-500/20">
          {error}
        </div>
      )}

      {/* Grid wrapper for basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl border-b border-[var(--color-admin-border)] pb-2 text-[var(--color-charcoal)]">
            Basic Information
          </h2>

          <div>
            <label className="block font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
              Destination Name *
            </label>
            <input
              name="name"
              type="text"
              defaultValue={initialData?.name}
              required
              placeholder="e.g. Agafay Desert"
              className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-red-400 text-xs font-sans">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
              URL Slug *
            </label>
            <input
              name="slug"
              type="text"
              defaultValue={initialData?.slug}
              placeholder="agafay-desert (leave blank to auto-generate)"
              className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)] font-mono"
            />
            <p className="mt-1 text-[var(--color-admin-text-muted)] text-xs font-sans">
              Used in the URL: ourrika.com/destinations/<strong>slug</strong>
            </p>
            {fieldErrors.slug && (
              <p className="mt-1 text-red-400 text-xs font-sans">{fieldErrors.slug}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
                Starting Price
              </label>
              <input
                name="starting_price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={initialData?.starting_price ?? ""}
                placeholder="e.g. 500"
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] tracking-wide focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
              />
              {fieldErrors.starting_price && (
                <p className="mt-1 text-red-400 text-xs font-sans">{fieldErrors.starting_price}</p>
              )}
            </div>
            <div className="w-1/3">
              <label className="block font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
                Currency
              </label>
              <select
                name="currency"
                defaultValue={initialData?.currency || "USD"}
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
              >
                <option value="USD">USD</option>
                <option value="MAD">MAD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media & Display */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl border-b border-[var(--color-admin-border)] pb-2 text-[var(--color-charcoal)]">
            Media & Visibility
          </h2>

          <div>
            <label className="block font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
              Cover Image URL *
            </label>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-[var(--color-admin-surface-raised)] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden relative border border-[var(--color-admin-border)]">
                {coverPreview.startsWith("http") || coverPreview.startsWith("/") ? (
                  <Image src={coverPreview} alt="Cover preview" fill className="object-cover" />
                ) : (
                  <ImageIcon className="text-[var(--color-admin-text-muted)]" size={24} />
                )}
              </div>
              <div className="flex-1">
                <input
                  name="cover_image"
                  type="url"
                  required
                  defaultValue={initialData?.cover_image}
                  onChange={(e) => setCoverPreview(e.target.value)}
                  placeholder="https://example.com/dest.jpg"
                  className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
                />
                {fieldErrors.cover_image && (
                  <p className="mt-1 text-red-400 text-xs font-sans">{fieldErrors.cover_image}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-[var(--color-admin-surface-raised)] border border-[var(--color-admin-border)] rounded-lg space-y-4">
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  name="is_featured"
                  type="checkbox"
                  defaultChecked={initialData?.is_featured ?? false}
                  className="w-5 h-5 accent-[var(--color-terracotta)] border-zinc-300 rounded cursor-pointer"
                />
                <span className="font-sans text-sm font-medium text-[var(--color-admin-text)] select-none">
                  Featured Destination
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  name="is_most_booked"
                  type="checkbox"
                  defaultChecked={initialData?.is_most_booked ?? false}
                  className="w-5 h-5 accent-[var(--color-terracotta)] border-zinc-300 rounded cursor-pointer"
                />
                <span className="font-sans text-sm font-medium text-[var(--color-admin-text)] select-none">
                  Popular / Most Booked
                </span>
              </label>
            </div>

            <div className="ml-8 border-t border-[var(--color-admin-border)] pt-3">
              <label className="block font-sans text-xs font-medium text-[var(--color-admin-text-muted)] mb-1">
                Homepage Order
              </label>
              <input
                name="homepage_order"
                type="number"
                min="0"
                defaultValue={initialData?.homepage_order ?? "0"}
                className="w-24 px-3 py-1.5 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-[var(--color-admin-border)] my-8 w-full" />

      {/* Content */}
      <div className="space-y-6">
        <h2 className="font-serif text-xl border-b border-[var(--color-admin-border)] pb-2 text-[var(--color-charcoal)]">
          Descriptive Content
        </h2>

        <div>
          <label className="block font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
            Short Description
          </label>
          <textarea
            name="short_description"
            rows={2}
            defaultValue={initialData?.short_description || ""}
            placeholder="A brief hook for the listing card."
            className="w-full px-4 py-3 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)] resize-y"
          />
        </div>

        <div>
          <label className="block font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
            Full Description
          </label>
          <textarea
            name="full_description"
            rows={6}
            defaultValue={initialData?.full_description || ""}
            placeholder="The complete destination story..."
            className="w-full px-4 py-3 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)] resize-y leading-relaxed"
          />
        </div>

        <div>
          <label className="block font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
            Gallery Image URLs (One per line)
          </label>
          <textarea
            name="gallery"
            rows={5}
            defaultValue={initialData?.gallery?.join("\n") || ""}
            placeholder="https://example.com/gallery1.jpg&#10;https://example.com/gallery2.jpg"
            className="w-full px-4 py-3 border rounded-lg font-mono text-xs text-[var(--color-admin-text)] bg-[var(--color-admin-surface-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)] resize-y"
          />
        </div>
      </div>

      <div className="h-px bg-[var(--color-admin-border)] my-8 w-full" />

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Link
          href="/admin/destinations"
          className="px-5 py-2.5 rounded-lg font-sans text-sm font-medium text-[var(--color-admin-text-muted)] hover:bg-[var(--color-admin-hover)] transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-charcoal)] hover:bg-black text-white font-sans text-sm font-medium tracking-wide rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="inline-block animate-pulse">Saving...</span>
          ) : (
            <>
              <Save size={16} />
              {isEditing ? "Save Changes" : "Create Destination"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
