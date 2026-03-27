import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { DestinationsListing } from "@/components/listings/ListingClients";
import { getAllDestinations } from "@/lib/data";

import { generateDynamicMetadata } from "@/lib/seo";

export const metadata: Metadata = generateDynamicMetadata({
  title: "Destinations",
  description: "Discover Morocco's most breathtaking destinations — from the Sahara to the Atlas mountains. Explore curated luxury travel with Ourrika.",
  path: "/destinations",
});

export default async function DestinationsPage() {
  const destinations = await getAllDestinations();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-obsidian)]">
      <PageHero
        title="Our Destinations"
        subtitle="Discover the beauty of Morocco"
      />

      <section className="py-20 bg-[var(--color-obsidian)]">
        <div className="container mx-auto px-6 lg:px-12">
          <DestinationsListing destinations={destinations} />
        </div>
      </section>
    </div>
  );
}
