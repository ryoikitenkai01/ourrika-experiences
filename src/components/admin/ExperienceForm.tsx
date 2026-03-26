"use client";

import { useTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImageIcon, Save } from "lucide-react";
import { createExperience, updateExperience } from "@/app/actions/experiences";
import Link from "next/link";

interface ExperienceRow {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  gallery: string[] | null;
  highlights: string[] | null;
  short_description: string | null;
  full_description: string | null;
  location: string | null;
  price: number | null;
  currency: string | null;
  duration: string | null;
  is_featured: boolean | null;
  homepage_order: number | null;
  whatsapp_message_template: string | null;
}

interface Props {
  initialData: ExperienceRow | null; // null if creating
}

export function ExperienceForm({ initialData }: Props) {
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
        result = await updateExperience(initialData.id, {}, formData);
      } else {
        result = await createExperience({}, formData);
      }

      if (result?.error) {
        setError(result.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (result?.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // Success
        router.push("/admin/experiences");
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-8 bg-white p-8 border border-zinc-200 shadow-sm"
    >
      {/* Messages */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg font-sans text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Grid wrapper for basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl border-b border-zinc-100 pb-2 text-[var(--color-charcoal)]">
            Basic Information
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
              placeholder="e.g. Desert Safari Adventure"
              className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
            />
            {fieldErrors.title && (
              <p className="mt-1 text-red-600 text-xs font-sans">{fieldErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
              URL Slug *
            </label>
            <input
              name="slug"
              type="text"
              defaultValue={initialData?.slug}
              placeholder="desert-safari (leave blank to auto-generate)"
              className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 font-mono text-zinc-600"
            />
            <p className="mt-1 text-zinc-400 text-xs font-sans">
              Used in the URL: ourrika.com/experiences/<strong>slug</strong>
            </p>
            {fieldErrors.slug && (
              <p className="mt-1 text-red-600 text-xs font-sans">{fieldErrors.slug}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
                Price
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={initialData?.price ?? ""}
                placeholder="e.g. 1500"
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
              />
              {fieldErrors.price && (
                <p className="mt-1 text-red-600 text-xs font-sans">{fieldErrors.price}</p>
              )}
            </div>
            <div className="w-1/3">
              <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
                Currency
              </label>
              <select
                name="currency"
                defaultValue={initialData?.currency || "MAD"}
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 bg-white"
              >
                <option value="MAD">MAD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
                Location
              </label>
              <input
                name="location"
                type="text"
                defaultValue={initialData?.location || ""}
                placeholder="e.g. Agafay Desert"
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
              />
            </div>
            <div className="flex-1">
              <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
                Duration
              </label>
              <input
                name="duration"
                type="text"
                defaultValue={initialData?.duration || ""}
                placeholder="e.g. 2 Days, 1 Night"
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
              />
            </div>
          </div>
        </div>

        {/* Media & Display */}
        <div className="space-y-6">
          <h2 className="font-serif text-xl border-b border-zinc-100 pb-2 text-[var(--color-charcoal)]">
            Media & Visibility
          </h2>

          <div>
            <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
              Cover Image URL *
            </label>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-zinc-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden relative border border-zinc-200">
                {coverPreview.startsWith("http") || coverPreview.startsWith("/") ? (
                  <Image src={coverPreview} alt="Cover preview" fill className="object-cover" />
                ) : (
                  <ImageIcon className="text-zinc-400" size={24} />
                )}
              </div>
              <div className="flex-1">
                <input
                  name="cover_image"
                  type="url"
                  required
                  defaultValue={initialData?.cover_image}
                  onChange={(e) => setCoverPreview(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
                />
                <p className="mt-2 text-zinc-400 text-xs font-sans">
                  Use a high-resolution, uncropped image URL. Used in hero backgrounds and cards.
                </p>
                {fieldErrors.cover_image && (
                  <p className="mt-1 text-red-600 text-xs font-sans">{fieldErrors.cover_image}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-lg space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                name="is_featured"
                type="checkbox"
                defaultChecked={initialData?.is_featured ?? false}
                className="w-5 h-5 accent-[var(--color-terracotta)] border-zinc-300 rounded cursor-pointer"
              />
              <span className="font-sans text-sm font-medium text-zinc-700 select-none">
                Featured Experience
              </span>
            </label>
            <p className="text-xs text-zinc-500 font-sans ml-8 mt-1">
              Featured experiences are highlighted on the homepage based on their
              display order.
            </p>

            <div className="ml-8">
              <label className="block font-sans text-xs font-medium text-zinc-600 mb-1">
                Homepage Order
              </label>
              <input
                name="homepage_order"
                type="number"
                min="0"
                defaultValue={initialData?.homepage_order ?? ""}
                placeholder="e.g. 1"
                className="w-24 px-3 py-1.5 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-zinc-100 my-8 w-full" />

      {/* Content */}
      <div className="space-y-6">
        <h2 className="font-serif text-xl border-b border-zinc-100 pb-2 text-[var(--color-charcoal)]">
          Descriptive Content
        </h2>

        <div>
          <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
            Short Description
          </label>
          <textarea
            name="short_description"
            rows={2}
            defaultValue={initialData?.short_description || ""}
            placeholder="A brief 1-2 sentence hook for the listing card."
            className="w-full px-4 py-3 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 resize-y"
          />
        </div>

        <div>
          <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
            Full Description
          </label>
          <textarea
            name="full_description"
            rows={6}
            defaultValue={initialData?.full_description || ""}
            placeholder="The complete, emotive description of the experience..."
            className="w-full px-4 py-3 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 resize-y leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
              Highlights (One per line)
            </label>
            <textarea
              name="highlights"
              rows={5}
              defaultValue={initialData?.highlights?.join("\n") || ""}
              placeholder={"Sunset camel ride\nTraditional Berber dinner\nFire show"}
              className="w-full px-4 py-3 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 resize-y"
            />
          </div>

          <div>
            <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
              Gallery Image URLs (One per line)
            </label>
            <textarea
              name="gallery"
              rows={5}
              defaultValue={initialData?.gallery?.join("\n") || ""}
              placeholder="https://example.com/gallery1.jpg&#10;https://example.com/gallery2.jpg"
              className="w-full px-4 py-3 border rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 resize-y bg-zinc-50"
            />
          </div>
        </div>

        <div className="pt-4">
          <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
            Custom WhatsApp Pre-filled Message (Optional)
          </label>
          <textarea
            name="whatsapp_message_template"
            rows={2}
            defaultValue={initialData?.whatsapp_message_template || ""}
            placeholder="Hello! I would love to book the Agafay Desert Safari..."
            className="w-full px-4 py-3 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200 resize-y"
          />
          <p className="mt-1 text-zinc-400 text-xs font-sans">
            Overrides the default &quot;Hello I&apos;d like to book [Title]&quot; message.
          </p>
        </div>
      </div>

      <div className="h-px bg-zinc-100 my-8 w-full" />

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <Link
          href="/admin/experiences"
          className="px-5 py-2.5 rounded-lg font-sans text-sm font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-charcoal)] hover:bg-black text-white font-sans text-sm font-medium tracking-wide rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="inline-block animate-pulse">Saving...</span>
          ) : (
            <>
              <Save size={16} />
              {isEditing ? "Save Changes" : "Create Experience"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
