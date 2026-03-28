import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import { HeroSectionDetail, ArticleContent } from "@/components/ui/DetailPageBlocks";
import { RelatedBlogPosts } from "@/components/ui/RelatedSections";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/data";
import { generateDynamicMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  return generateDynamicMetadata({
    title: post.title,
    description: post.excerpt ?? undefined,
    image: post.image || undefined,
    path: `/journal/${slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const [post, relatedPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getRelatedBlogPosts(slug, 3),
  ]);

  if (!post) notFound();

  const formattedDate = post.publish_date
    ? new Date(post.publish_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-obsidian)]">

      {/* ── HERO ── */}
      <HeroSectionDetail
        image={post.image}
        title={post.title}
        backHref="/journal"
        backLabel="The Journal"
        heightClass="h-[62vh] min-h-[380px]"
      >
        {formattedDate && (
          <p className="flex items-center gap-1.5 font-sans text-white/60 text-xs tracking-widest uppercase mt-1">
            <Calendar size={11} /> {formattedDate}
          </p>
        )}
      </HeroSectionDetail>

      {/* ── ARTICLE BODY ── uses ArticleContent reusable component */}
      <ArticleContent
        excerpt={post.excerpt}
        body={post.body}
        backHref="/journal"
        backLabel="Back to Journal"
        forwardHref="/experiences"
        forwardLabel="Explore experiences"
      />

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <RelatedBlogPosts posts={relatedPosts} title="More from the Journal" />
      )}
    </div>
  );
}
