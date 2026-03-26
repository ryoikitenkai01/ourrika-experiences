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
} from "@/components/ui/DetailPageBlocks";
import { RelatedExperiences } from "@/components/ui/RelatedSections";
import { DestinationBookingClient, MobileStickyDestinationBar } from "@/components/ui/DestinationBookingClient";

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

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-sand-light)]">

      {/* ── HERO ── */}
      <HeroSectionDetail
        image={dest.image}
        title={dest.name}
        backHref="/destinations"
        backLabel="All Destinations"
        heightClass="h-[75vh] min-h-[460px]"
      >
        {dest.starting_price != null && (
          <span className="inline-block font-sans text-xs tracking-widest uppercase text-white bg-[var(--color-terracotta)]/90 px-3 py-1.5 mt-1">
            Experiences from {dest.starting_price.toLocaleString()}{" "}
            {dest.currency}
          </span>
        )}
      </HeroSectionDetail>

      {/* ── EDITORIAL BODY ── */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Content — 8 cols */}
            <div className="lg:col-span-8">
              <RichContentSection
                shortDescription={dest.short_description}
                fullDescription={dest.full_description}
                emptyMessage="Destination details coming soon."
              />

              {/* Photo gallery */}
              <GalleryBlock
                images={dest.gallery}
                altPrefix={dest.name}
                title="Photography"
              />
            </div>

            {/* Sidebar — 4 cols */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28">
                <div className="bg-white border border-gray-100 shadow-sm p-6">
                  <div className="w-8 h-px bg-[var(--color-terracotta)] mb-4" />
                  <h3 className="font-serif text-xl text-[var(--color-charcoal)] mb-5">
                    Plan Your Visit
                  </h3>

                  {dest.starting_price != null && (
                    <div className="mb-5">
                      <p className="font-sans text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                        Experiences from
                      </p>
                      <p className="font-serif text-2xl text-[var(--color-charcoal)]">
                        {dest.starting_price.toLocaleString()}{" "}
                        <span className="text-sm font-sans text-gray-400">
                          {dest.currency}
                        </span>
                      </p>
                    </div>
                  )}

                  <DestinationBookingClient
                    destination={{ id: dest.id, name: dest.name, slug: dest.slug }}
                    whatsappUrl={whatsappUrl}
                    whatsappMessage={whatsappText}
                    whatsappNumber={settings.whatsapp_number}
                  />
                  <div className="flex flex-col gap-3 mt-3">
                    <Link
                      href="/experiences"
                      className="flex items-center justify-center h-12 border border-[var(--color-charcoal)] text-[var(--color-charcoal)] font-sans text-sm tracking-widest uppercase hover:bg-[var(--color-charcoal)] hover:text-white transition-colors"
                    >
                      Browse Experiences
                    </Link>
                  </div>
                </div>

                <p className="mt-4 font-sans text-[11px] text-gray-400 text-center leading-relaxed">
                  Our team will craft a personalised itinerary to fit your
                  preferences.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related experiences */}
      {relatedExperiences.length > 0 && (
        <RelatedExperiences
          experiences={relatedExperiences}
          title={`Experiences in ${dest.name}`}
        />
      )}

      {/* Mobile sticky bar */}
      <MobileStickyDestinationBar
        destination={{ id: dest.id, name: dest.name, slug: dest.slug }}
        whatsappUrl={whatsappUrl}
        whatsappMessage={whatsappText}
        whatsappNumber={settings.whatsapp_number}
      />

      {/* Spacer so sticky bar doesn't cover content */}
      <div className="md:hidden h-20" />
    </div>
  );
}
