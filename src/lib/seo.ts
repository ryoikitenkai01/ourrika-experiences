import { Metadata } from "next";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
}

export function generateDynamicMetadata({
  title,
  description,
  image,
  path,
  type = "website",
  publishedTime,
  authors,
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ourrika-experiences.com");
  const siteName = "Ourrika Experiences";
  const fullTitle = `${title} | ${siteName}`;
  const url = `${baseUrl}${path}`;
  const defaultDescription = "Escape. Breathe. Explore. Discover premium, authentic Moroccan experiences.";
  const finalDescription = description || defaultDescription;

  const fallbackImage = { url: `${baseUrl}/hero-agafay.jpg`, width: 1200, height: 630 };
  const images = image ? [{ url: image, width: 1200, height: 630 }] : [fallbackImage];

  const openGraph =
    type === "article"
      ? {
          title: fullTitle,
          description: finalDescription,
          url,
          siteName,
          images,
          locale: "en_US",
          type: "article" as const,
          ...(publishedTime ? { publishedTime } : {}),
          ...(authors?.length ? { authors } : {}),
        }
      : {
          title: fullTitle,
          description: finalDescription,
          url,
          siteName,
          images,
          locale: "en_US",
          type: "website" as const,
        };

  return {
    title: fullTitle,
    description: finalDescription,
    alternates: {
      canonical: url,
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: finalDescription,
      images,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
