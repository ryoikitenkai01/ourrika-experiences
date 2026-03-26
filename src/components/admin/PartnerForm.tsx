"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createPartner, updatePartner } from "@/app/actions/partners";
import { Save, Image as ImageIcon, Link as LinkIcon, Hash } from "lucide-react";
import Link from "next/link";

interface PartnerRow {
  id: string;
  name: string;
  logo: string;
  link: string | null;
  display_order: number | null;
  is_active: boolean | null;
}

interface Props {
  initialData: PartnerRow | null; // null if creating
}

export function PartnerForm({ initialData }: Props) {
  const isEditing = !!initialData;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [logoPreview, setLogoPreview] = useState(initialData?.logo || "");

  async function handleSubmit(formData: FormData) {
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      let result;
      if (isEditing) {
        result = await updatePartner(initialData.id, {}, formData);
      } else {
        result = await createPartner({}, formData);
      }

      if (result?.error) {
        setError(result.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (result?.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/admin/partners");
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className="max-w-3xl space-y-8 bg-white p-8 border border-zinc-200 shadow-sm rounded-lg animate-in fade-in duration-500"
    >
      {/* Messages */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg font-sans text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <h2 className="font-serif text-xl border-b border-zinc-100 pb-2 text-[var(--color-charcoal)]">
          Partner Details
        </h2>

        <div>
          <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
            Partner Name *
          </label>
          <input
            name="name"
            type="text"
            defaultValue={initialData?.name}
            required
            placeholder="e.g. Amanjena Resort"
            className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
          />
          {fieldErrors.name && (
            <p className="mt-1 text-red-600 text-xs font-sans">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
            Logo URL *
          </label>
          <div className="flex gap-4">
            <div className="w-32 h-20 bg-zinc-50 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-zinc-100 relative group">
              {logoPreview.startsWith("http") || logoPreview.startsWith("/") ? (
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <ImageIcon className="text-zinc-400" size={24} />
              )}
            </div>
            <div className="flex-1">
              <input
                name="logo"
                type="url"
                required
                defaultValue={initialData?.logo}
                onChange={(e) => setLogoPreview(e.target.value)}
                placeholder="https://example.com/logo.svg"
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
              />
              <p className="mt-2 text-zinc-400 text-[11px] font-sans">
                Prefer SVGs or transparent PNGs. Standardize logo heights for a clean layout.
              </p>
              {fieldErrors.logo && (
                <p className="mt-1 text-red-600 text-xs font-sans">{fieldErrors.logo}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
            External Website Link (Optional)
          </label>
          <div className="relative">
            <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              name="link"
              type="url"
              defaultValue={initialData?.link || ""}
              placeholder="https://amanjena.com"
              className="w-full pl-9 pr-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block font-sans text-sm font-medium text-zinc-700 mb-1">
              Display Order
            </label>
            <div className="relative w-32">
              <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                name="display_order"
                type="number"
                min="0"
                defaultValue={initialData?.display_order ?? "0"}
                className="w-full pl-9 pr-4 py-2 border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-zinc-200"
              />
            </div>
            <p className="mt-1 text-zinc-400 text-[11px] font-sans">
              Lower numbers appear first.
            </p>
          </div>

          <div className="flex flex-col justify-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                name="is_active"
                type="checkbox"
                defaultChecked={initialData?.is_active ?? true}
                className="w-5 h-5 accent-[var(--color-terracotta)] border-zinc-300 rounded cursor-pointer"
              />
              <span className="font-sans text-sm font-medium text-zinc-700 select-none">
                Active & Visible
              </span>
            </label>
            <p className="mt-1 text-zinc-400 text-[11px] font-sans ml-8">
              Uncheck to hide from the homepage.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-100">
        <Link
          href="/admin/partners"
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
              {isEditing ? "Save Changes" : "Create Partner"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
