import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ExperiencesListing } from "@/components/listings/ListingClients";
import { getAllExperiences } from "@/lib/data";
import { generateDynamicMetadata } from "@/lib/seo";

export const metadata: Metadata = generateDynamicMetadata({
  title: "Moroccan Activities",
  description: "Explore our curated collection of authentic Moroccan activities — from desert dinners to mountain escapes.",
  path: "/experiences",
});

export default async function ExperiencesPage() {
  const experiences = await getAllExperiences();

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="Ourrika Activities"
        subtitle="Crafted journeys for discerning travellers"
      />

      <section className="py-20 bg-[var(--color-sand-light)]">
        <div className="container mx-auto px-6 lg:px-12">
          <ExperiencesListing experiences={experiences} />
        </div>
      </section>
    </div>
  );
}
