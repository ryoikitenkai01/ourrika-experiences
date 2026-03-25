"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { BlogCard } from "@/components/ui/PremiumCard";
import type { BlogPost } from "@/lib/types/ui";

interface BlogListingProps {
  posts: BlogPost[];
}

export function BlogListing({ posts }: BlogListingProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return posts;
    const q = query.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? "").toLowerCase().includes(q)
    );
  }, [query, posts]);

  return (
    <div>
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <SearchBar
          placeholder="Search articles..."
          onSearch={setQuery}
        />
        <p className="font-sans text-sm text-gray-400 tracking-wide">
          {filtered.length} article{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-px bg-[var(--color-terracotta)] mx-auto mb-6" />
          <p className="font-serif text-2xl text-[var(--color-charcoal)] mb-2">Nothing here yet</p>
          <p className="font-sans text-sm text-gray-400">
            {query ? `No articles found for "${query}"` : "No blog posts yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <BlogCard
              key={post.id}
              href={`/blog/${post.slug}`}
              image={post.image}
              title={post.title}
              excerpt={post.excerpt}
              date={post.publish_date}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
