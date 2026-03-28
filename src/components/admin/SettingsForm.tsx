"use client";

import { useTransition, useState } from "react";
import { updateSettings } from "@/app/actions/settings";
import { Save, Image as ImageIcon, Phone, Mail, Instagram, Facebook, Globe } from "lucide-react";
import Image from "next/image";

interface SettingsRow {
  hero_title: string | null;
  hero_media_url: string | null;
  whatsapp_number: string | null;
  contact_email: string | null;
  instagram_link: string | null;
  facebook_link: string | null;
  tiktok_link: string | null;
  faq_link: string | null;
}

interface Props {
  initialData: SettingsRow | null;
}

export function SettingsForm({ initialData }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [heroPreview, setHeroPreview] = useState(initialData?.hero_media_url || "");

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateSettings({}, formData);

      if (result?.error) {
        setError(result.error);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 rounded-lg font-sans text-sm border border-red-500/20">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg font-sans text-sm border border-emerald-200">
          Settings updated successfully.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Side: Hero Section */}
        <div className="space-y-6">
          <div className="bg-[var(--color-admin-surface)] p-6 border border-[var(--color-admin-border)] rounded-lg space-y-6">
            <h2 className="font-serif text-xl border-b border-[var(--color-admin-border)] pb-2 text-[var(--color-charcoal)]">
              Hero Content
            </h2>

            <div>
              <label className="block font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
                Hero Title
              </label>
              <textarea
                name="hero_title"
                rows={3}
                defaultValue={initialData?.hero_title || ""}
                placeholder="Escape. Breathe. Explore..."
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)] resize-y"
              />
              <p className="mt-1 text-[var(--color-admin-text-muted)] text-xs font-sans">
                Main headline on the homepage.
              </p>
            </div>

            <div>
              <label className="block font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
                Hero Background Media (URL)
              </label>
              <div className="flex gap-4">
                <div className="w-32 h-20 bg-[var(--color-admin-surface-raised)] rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden relative border border-[var(--color-admin-border)]">
                  {heroPreview.startsWith("http") || heroPreview.startsWith("/") ? (
                    <Image src={heroPreview} alt="Hero preview" fill className="object-cover" />
                  ) : (
                    <ImageIcon className="text-[var(--color-admin-text-muted)]" size={24} />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    name="hero_media_url"
                    type="url"
                    defaultValue={initialData?.hero_media_url || ""}
                    onChange={(e) => setHeroPreview(e.target.value)}
                    placeholder="https://example.com/hero.jpg"
                    className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
                  />
                  <p className="mt-2 text-[var(--color-admin-text-muted)] text-xs font-sans italic">
                    Images or direct video links (.mp4) supported.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-admin-surface)] p-6 border border-[var(--color-admin-border)] rounded-lg space-y-6">
            <h2 className="font-serif text-xl border-b border-[var(--color-admin-border)] pb-2 text-[var(--color-charcoal)]">
              Contact Channels
            </h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
                  <Phone size={14} className="text-[var(--color-admin-text-muted)]" /> WhatsApp Number
                </label>
                <input
                  name="whatsapp_number"
                  type="text"
                  defaultValue={initialData?.whatsapp_number || ""}
                  placeholder="+212 6..."
                  className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
                  <Mail size={14} className="text-[var(--color-admin-text-muted)]" /> Contact Email
                </label>
                <input
                  name="contact_email"
                  type="email"
                  defaultValue={initialData?.contact_email || ""}
                  placeholder="hello@ourrika.com"
                  className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Social & Links */}
        <div className="space-y-6">
          <div className="bg-[var(--color-admin-surface)] p-6 border border-[var(--color-admin-border)] rounded-lg space-y-6">
            <h2 className="font-serif text-xl border-b border-[var(--color-admin-border)] pb-2 text-[var(--color-charcoal)]">
              Social Media
            </h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
                  <Instagram size={14} className="text-[var(--color-admin-text-muted)]" /> Instagram Link
                </label>
                <input
                  name="instagram_link"
                  type="url"
                  defaultValue={initialData?.instagram_link || ""}
                  placeholder="https://instagram.com/ourrika"
                  className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
                  <Facebook size={14} className="text-[var(--color-admin-text-muted)]" /> Facebook Link
                </label>
                <input
                  name="facebook_link"
                  type="url"
                  defaultValue={initialData?.facebook_link || ""}
                  className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
                   Tiktok Link
                </label>
                <input
                  name="tiktok_link"
                  type="url"
                  defaultValue={initialData?.tiktok_link || ""}
                  className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
                />
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-admin-surface)] p-6 border border-[var(--color-admin-border)] rounded-lg space-y-6">
            <h2 className="font-serif text-xl border-b border-[var(--color-admin-border)] pb-2 text-[var(--color-charcoal)]">
              Support Links
            </h2>

            <div>
              <label className="flex items-center gap-2 font-sans text-sm font-medium text-[var(--color-admin-text)] mb-1">
                <Globe size={14} className="text-[var(--color-admin-text-muted)]" /> FAQ External Link
              </label>
              <input
                name="faq_link"
                type="url"
                defaultValue={initialData?.faq_link || ""}
                placeholder="https://help.ourrika.com"
                className="w-full px-4 py-2 border rounded-lg font-sans text-sm text-[var(--color-admin-text)] bg-[var(--color-admin-input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]/30 focus:border-[var(--color-terracotta)] border-[var(--color-admin-border)]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--color-charcoal)] hover:bg-black text-white font-sans text-sm font-medium tracking-wide rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="inline-block animate-pulse">Processing...</span>
              ) : (
                <>
                  <Save size={16} />
                  Save Global Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
