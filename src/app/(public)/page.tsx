import { Metadata } from "next";
import { generateDynamicMetadata } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { FeaturedExperiences } from "@/components/home/FeaturedExperiences";
import { Destinations } from "@/components/home/Destinations";
import { Philosophy } from "@/components/home/Philosophy";
import { Newsletter } from "@/components/home/Newsletter";
import { Partners } from "@/components/home/Partners";
import { TrustBand } from "@/components/home/TrustBand";
import {
  getSiteSettings,
  getFeaturedExperiences,
  getFeaturedDestinations,
  getPartners,
} from "@/lib/data";

export const metadata: Metadata = generateDynamicMetadata({
  title: "Escape. Breathe. Explore. | Travel Morocco",
  description: "Discover premium, authentic Moroccan experiences with Ourrika. Curated travel for discerning explorers.",
  path: "/",
});

// This is a React Server Component — all fetches run on the server.
// No useEffect, no client-side loading spinners needed for initial data.
export default async function Home() {
  const [settings, experiences, destinations, partners] = await Promise.all([
    getSiteSettings(),
    getFeaturedExperiences(3),
    getFeaturedDestinations(4),
    getPartners(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero settings={settings} />
      <TrustBand />
      <FeaturedExperiences experiences={experiences} />
      <Destinations destinations={destinations} />
      <Philosophy />
      <Newsletter />
      <Partners partners={partners} />
    </div>
  );
}
