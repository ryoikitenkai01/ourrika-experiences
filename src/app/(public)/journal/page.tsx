import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { BlogListing } from "@/components/listings/BlogListingClient";
import { getAllBlogPosts } from "@/lib/data";

import { generateDynamicMetadata } from "@/lib/seo";

export const metadata: Metadata = generateDynamicMetadata({
  title: "The Journal",
  description: "Stories, guides, and inspiration from Morocco. Explore our travel journal for insider tips, destination guides, and authentic travel stories.",
  path: "/journal",
});

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title="The Journal"
        subtitle="Stories and guides from the heart of Morocco"
      />

      <section className="py-20 bg-[var(--color-sand-light)]">
        <div className="container mx-auto px-6 lg:px-12">
          <BlogListing posts={posts} />
        </div>
      </section>
    </div>
  );
}
