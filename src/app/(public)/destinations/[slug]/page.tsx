import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getDestinationBySlug,
  getRelatedExperiences,
  getSiteSettings,
} from "@/lib/data";
import {
  HeroSectionDetail,
  RichContentSection,
  GalleryBlock,
  ServiceDetailLayout,
  ServiceSidebarCard,
} from "@/components/ui/DetailPageBlocks";
import { RelatedExperiences } from "@/components/ui/RelatedSections";
import { DestinationBookingClient } from "@/components/ui/DestinationBookingClient";

import { generateDynamicMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = await getDestinationBySlug(slug);
  if (!dest) return { title: "Destination Not Found" };

  return generateDynamicMetadata({
    title: dest.name,
    description: dest.short_description ?? undefined,
    image: dest.image || undefined,
    path: `/destinations/${slug}`,
  });
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;

  const [dest, relatedExperiences, settings] = await Promise.all([
    getDestinationBySlug(slug),
    getRelatedExperiences(slug, 3),
    getSiteSettings(),
  ]);

  if (!dest) notFound();

  const whatsappText = `Hello, I am interested in visiting ${dest.name}. Can you share more details?`;
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(whatsappText)}`;

  const bookingProps = {
    destination: { id: dest.id, name: dest.name, slug: dest.slug },
    whatsappUrl,
    whatsappMessage: whatsappText,
    whatsappNumber: settings.whatsapp_number,
    startingPrice: dest.starting_price,
    currency: dest.currency,
  };

  const browseLink = (
    <Link
      href="/experiences"
      className="flex items-center justify-center h-12 border border-white/10 text-[var(--color-sand-light)] font-sans text-sm tracking-widest uppercase hover:bg-white/5 transition-colors"
    >
      Browse Experiences
    </Link>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-obsidian)]">

      {/* ── HERO ── */}
      <HeroSectionDetail
        image={dest.image}
        title={dest.name}
        backHref="/destinations"
        backLabel="All Destinations"
        heightClass="h-[75vh] min-h-[460px]"
      >
        {dest.starting_price != null && (
          <span className="inline-block font-sans text-xs tracking-widest uppercase text-[var(--color-sand-light)] bg-[var(--color-terracotta)]/90 px-3 py-1.5 mt-1">
            Experiences from {dest.starting_price.toLocaleString("en-US")}{" "}
            {dest.currency}
          </span>
        )}
      </HeroSectionDetail>

      {/* ── BODY ── unified two-column layout */}
      <ServiceDetailLayout
        pyClass="py-16 lg:py-24"
        contentSlot={
          <>
            <RichContentSection
              shortDescription={dest.short_description}
              fullDescription={dest.full_description}
              emptyMessage="Destination details coming soon."
            />
            <GalleryBlock
              images={dest.gallery}
              altPrefix={dest.name}
              title="Photography"
            />
          </>
        }
        sidebarSlot={
          <ServiceSidebarCard
            title="Plan Your Visit"
            trustNote="Our team will craft a personalised itinerary to fit your preferences."
          >
            {dest.starting_price != null && (
              <div className="mb-5">
                <p className="font-sans text-[10px] uppercase tracking-widest text-[var(--color-charcoal-light)]/70 mb-1">
                  Experiences from
                </p>
                <p className="font-serif text-2xl text-[var(--color-gold)]">
                  {dest.starting_price.toLocaleString("en-US")}{" "}
                  <span className="text-sm font-sans text-[var(--color-charcoal-light)]/70">
                    {dest.currency}
                  </span>
                </p>
              </div>
            )}

            {/* CTA — desktop only (mobile handled by mobileCTASlot) */}
            <DestinationBookingClient {...bookingProps} />
            <div className="mt-3">{browseLink}</div>
          </ServiceSidebarCard>
        }
        mobileCTASlot={
          <>
            <DestinationBookingClient {...bookingProps} />
            <div className="mt-3">{browseLink}</div>
          </>
        }
      />

      {/* Related experiences */}
      {relatedExperiences.length > 0 && (
        <RelatedExperiences
          experiences={relatedExperiences}
          title={`Experiences in ${dest.name}`}
        />
      )}

    </div>
  );
}
