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

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-obsidian)]">

      {/* ── HERO ── reusable HeroSectionDetail + ExperienceMeta chips */}
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

      {/* ── BODY ── two-column: content + sticky booking sidebar */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

            {/* Left: Content */}
            <div className="lg:col-span-2">
              {/* RichContentSection: pull-quote + body */}
              <RichContentSection
                shortDescription={exp.short_description}
                fullDescription={exp.full_description}
                emptyMessage="Full experience details coming soon."
              />

              {/* HighlightsBlock: what's included */}
              <HighlightsBlock highlights={exp.highlights} />

              {/* GalleryBlock: masonry photo grid */}
              <GalleryBlock images={exp.gallery} altPrefix={exp.title} />
            </div>

            {/* Right: Sticky booking sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div className="bg-[var(--color-surface)] border border-[var(--color-gold)]/20 mb-6 overflow-hidden">
                  {/* Urgency bar */}
                  <div className="bg-[var(--color-terracotta)] px-5 py-2.5 text-center">
                    <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-[var(--color-sand-light)] font-semibold">
                      High demand — reply within 2hrs
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="mx-5 h-px bg-[var(--color-gold)]/20 mt-4" />

                  <div className="p-5">
                    <p className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-charcoal-light)] mb-1 mt-2">
                      Starting from
                    </p>
                    {exp.price != null ? (
                      <p className="font-serif text-3xl text-[var(--color-gold)] mb-1">
                        {exp.price.toLocaleString()}
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

                    {/* Desktop CTA */}
                    <div className="mt-6 hidden md:block">
                      <ExperienceBookingClient
                        experience={{
                          id: exp.id,
                          title: exp.title,
                          slug: exp.slug,
                          whatsappMessage: exp.whatsappMessage,
                          whatsappNumber: whatsappNumber,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <p className="font-sans text-[11px] text-[var(--color-charcoal-light)] text-center leading-relaxed">
                  No payment required now. We&apos;ll confirm availability and
                  share details before any commitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Mobile CTA (shown at the bottom of content, above nav bar) */}
      <div className="md:hidden px-6 pb-24 border-t border-white/[0.06] pt-12">
        <ExperienceBookingClient
          experience={{
            id: exp.id,
            title: exp.title,
            slug: exp.slug,
            whatsappMessage: exp.whatsappMessage,
            whatsappNumber: whatsappNumber,
          }}
        />
      </div>

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
