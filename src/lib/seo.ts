import { Metadata } from "next";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  path: string;
  type?: "website" | "article";
}

export function generateDynamicMetadata({
  title,
  description,
  image,
  path,
  type = "website",
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ourrika-experiences.com";
  const siteName = "Ourrika Experiences";
  const fullTitle = `${title} | ${siteName}`;
  const url = `${baseUrl}${path}`;
  const defaultDescription = "Escape. Breathe. Explore. Discover premium, authentic Moroccan experiences.";
  const finalDescription = description || defaultDescription;
  
  const images = image ? [{ url: image }] : [{ url: `${baseUrl}/og-image.jpg` }];

  return {
    title: fullTitle,
    description: finalDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: finalDescription,
      url: url,
      siteName: siteName,
      images: images,
      locale: "en_US",
      type: type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: finalDescription,
      images: images,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
