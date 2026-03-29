import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Clock, Star } from "lucide-react";
import {
  getExperienceBySlug,
  getRelatedExperiences,
  getSiteSettings,
} from "@/lib/data";
import {
  HeroSectionDetail,
  ExperienceMeta,
  RichContentSection,
  HighlightsBlock,
  GalleryBlock,
  ServiceDetailLayout,
  ServiceSidebarCard,
} from "@/components/ui/DetailPageBlocks";
import {
  ExperienceBookingClient,
} from "@/components/ui/ExperienceBookingClient";
import { RelatedExperiences } from "@/components/ui/RelatedSections";

import { generateDynamicMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperienceBySlug(slug);
  if (!exp) return { title: "Experience Not Found" };

  return generateDynamicMetadata({
    title: exp.title,
    description: exp.short_description ?? undefined,
    image: exp.image || undefined,
    path: `/experiences/${slug}`,
    type: "website",
  });
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;

  const [exp, relatedExperiences, settings] = await Promise.all([
    getExperienceBySlug(slug),
    getRelatedExperiences(slug, 3),
    getSiteSettings(),
  ]);

  if (!exp) notFound();

  const whatsappNumber = settings.whatsapp_number;

  const bookingProps = {
    id: exp.id,
    title: exp.title,
    slug: exp.slug,
    whatsappMessage: exp.whatsappMessage,
    whatsappNumber,
    location: exp.location,
    duration: exp.duration,
    price: exp.price,
    currency: exp.currency,
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-obsidian)]">

      {/* ── HERO ── */}
      <HeroSectionDetail
        image={exp.image}
        title={exp.title}
        backHref="/experiences"
        backLabel="All Activities"
        heightClass="h-[78vh] min-h-[480px]"
      >
        <ExperienceMeta
          location={exp.location}
          duration={exp.duration}
          price={exp.price}
          currency={exp.currency}
        />
      </HeroSectionDetail>

      {/* ── BODY ── unified two-column layout */}
      <ServiceDetailLayout
        contentSlot={
          <>
            <RichContentSection
              shortDescription={exp.short_description}
              fullDescription={exp.full_description}
              emptyMessage="Full experience details coming soon."
            />
            <HighlightsBlock highlights={exp.highlights} />
            <GalleryBlock images={exp.gallery} altPrefix={exp.title} />
          </>
        }
        sidebarSlot={
          <ServiceSidebarCard
            trustNote="No payment required now. We'll confirm availability and share details before any commitment."
          >
            <p className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-charcoal-light)] mb-1 mt-2">
              Starting from
            </p>
            {exp.price != null ? (
              <p className="font-serif text-3xl text-[var(--color-gold)] mb-1">
                {exp.price.toLocaleString("en-US")}
                <span className="text-sm ml-1 font-sans text-[var(--color-charcoal-light)]">
                  {exp.currency}
                </span>
              </p>
            ) : (
              <p className="font-serif text-2xl text-[var(--color-gold)] mb-1">
                Contact for pricing
              </p>
            )}

            {/* Meta list */}
            <div className="border-t border-white/[0.06] mt-4 pt-4 flex flex-col gap-3">
              {exp.location && (
                <div className="flex items-center gap-2.5 text-sm text-[var(--color-sand-light)]/60 font-sans">
                  <MapPin size={14} className="text-[var(--color-terracotta)] shrink-0" />
                  {exp.location}
                </div>
              )}
              {exp.duration && (
                <div className="flex items-center gap-2.5 text-sm text-[var(--color-sand-light)]/60 font-sans">
                  <Clock size={14} className="text-[var(--color-terracotta)] shrink-0" />
                  {exp.duration}
                </div>
              )}
              <div className="flex items-center gap-2.5 text-sm text-[var(--color-sand-light)]/60 font-sans">
                <Star size={14} className="text-[var(--color-terracotta)] shrink-0" />
                Premium curated experience
              </div>
            </div>

            {/* CTA — desktop only (mobile handled by mobileCTASlot) */}
            <div className="mt-6">
              <ExperienceBookingClient experience={bookingProps} />
            </div>
          </ServiceSidebarCard>
        }
        mobileCTASlot={<ExperienceBookingClient experience={bookingProps} />}
      />

      {/* Related experiences */}
      {relatedExperiences.length > 0 && (
        <RelatedExperiences
          experiences={relatedExperiences}
          title="More Activities"
        />
      )}

    </div>
  );
}
