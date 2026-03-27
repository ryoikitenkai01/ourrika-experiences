import { adminDb, isFirebaseAdminConfigured } from "./firebase-admin";
import type {
  SiteSettings,
  ExperienceCard,
  ExperienceDetail,
  DestinationCard,
  DestinationDetail,
  BlogPost,
  PartnerLogo,
} from "./types/ui";

// ------------------------------------------------------------------
// Internal row shapes (Firestore document structure)
// ------------------------------------------------------------------

interface SiteSettingsRow {
  hero_title: string | null;
  hero_media_url: string | null;
  whatsapp_number: string | null;
  instagram_link: string | null;
  facebook_link: string | null;
  tiktok_link: string | null;
  faq_link: string | null;
  contact_email: string | null;
}

interface ExperienceRow {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  short_description: string | null;
  full_description?: string | null;
  gallery?: string[] | null;
  highlights?: string[] | null;
  price: number | null;
  currency: string | null;
  location: string | null;
  duration: string | null;
  whatsapp_message_template: string | null;
  is_featured?: boolean;
  homepage_order?: number;
}

interface DestinationRow {
  id: string;
  name: string;
  slug: string;
  cover_image: string;
  short_description: string | null;
  full_description?: string | null;
  gallery?: string[] | null;
  starting_price: number | null;
  currency: string | null;
  is_featured?: boolean;
  is_most_booked?: boolean;
  homepage_order?: number;
}


interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  excerpt: string | null;
  body: string | null;
  publish_date: string | null;
}

interface PartnerRow {
  id: string;
  name: string;
  logo: string;
  link: string | null;
  is_active?: boolean;
  display_order?: number;
}

export const WHATSAPP_FALLBACK = "212600000000";

const DEFAULT_SETTINGS: SiteSettings = {
  hero_title: "Escape. Breathe. Explore. Discover premium, authentic Moroccan experiences.",
  hero_media_url: null,
  whatsapp_number: WHATSAPP_FALLBACK,
  instagram_link: "https://instagram.com/ourrika",
  facebook_link: null,
  tiktok_link: null,
  faq_link: null,
  contact_email: "hello@ourrika.com",
};

const FALLBACK_EXPERIENCES: ExperienceCard[] = [
  {
    id: "1",
    title: "Table in the Desert",
    slug: "table-in-the-desert",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80",
    short_description: "Dinner under the stars in the Agafay stone desert.",
    price: 130,
    currency: "€",
    location: "Agafay Desert",
    duration: "4 hours",
    whatsappMessage: "Hi! I'd like to book Table in the Desert — can you send me availability?",
  },
  {
    id: "2",
    title: "Friday Rooftop",
    slug: "friday-rooftop",
    image: "https://picsum.photos/seed/marrakech-rooftop/1200/800",
    short_description: "DJ set, tapas, and the Marrakech skyline every Friday evening.",
    price: 45,
    currency: "€",
    location: "Marrakech Medina",
    duration: "3 hours",
    whatsappMessage: "Hi! I'd like to reserve a spot at Friday Rooftop — how do I book?",
  },
  {
    id: "3",
    title: "Blue Alley Photo Walk",
    slug: "blue-alley-photo-walk",
    image: "https://images.unsplash.com/photo-1548041019-7217fc7d7bc9?auto=format&fit=crop&w=1200&q=80",
    short_description: "Discover the hidden gems of Chefchaouen with a professional photographer.",
    price: 85,
    currency: "€",
    location: "Chefchaouen",
    duration: "2 hours",
    whatsappMessage: "Hi! I'm interested in the Blue Alley Photo Walk.",
  },
  {
    id: "4",
    title: "Sunset Camel Trek",
    slug: "sunset-camel-trek",
    image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1200&q=80",
    short_description: "An iconic Saharan journey into the golden dunes of Merzouga.",
    price: 150,
    currency: "€",
    location: "Merzouga",
    duration: "Overnight",
    whatsappMessage: "Hi! I'd like to book the Sunset Camel Trek.",
  },
  {
    id: "5",
    title: "Kasbah Cooking Class",
    slug: "kasbah-cooking-class",
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1200&q=80",
    short_description: "Learn the secrets of Moroccan spices in an ancient Kasbah in the Ourrika Valley.",
    price: 110,
    currency: "€",
    location: "Ourrika Valley",
    duration: "Half-day",
    whatsappMessage: "Hi! Tell me more about the Kasbah Cooking Class.",
  },
];

const FALLBACK_DESTINATIONS: DestinationCard[] = [
  {
    id: "1",
    name: "Marrakech",
    slug: "marrakech",
    image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80",
    short_description: "The medina, the souks, and the rooftops — all of it.",
    starting_price: 30,
    currency: "€",
  },
  {
    id: "2",
    name: "Ourika Valley",
    slug: "ourika-valley",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    short_description: "The Atlas foothills, an hour from the city.",
    starting_price: 65,
    currency: "€",
  },
  {
    id: "3",
    name: "Chefchaouen",
    slug: "chefchaouen",
    image: "https://images.unsplash.com/photo-1548041019-7217fc7d7bc9?auto=format&fit=crop&w=1200&q=80",
    short_description: "The Blue Pearl of the Rif Mountains.",
    starting_price: 90,
    currency: "€",
  },
  {
    id: "4",
    name: "Merzouga",
    slug: "merzouga",
    image: "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=1200&q=80",
    short_description: "Gateway to the majestic Erg Chebbi dunes.",
    starting_price: 140,
    currency: "€",
  },
  {
    id: "5",
    name: "Essaouira",
    slug: "essaouira",
    image: "https://images.unsplash.com/photo-1559586061-3c73ef795604?auto=format&fit=crop&w=1200&q=80",
    short_description: "The windy city by the Atlantic coast.",
    starting_price: 50,
    currency: "€",
  },
];

const FALLBACK_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Introducing Ourrika Experiences",
    slug: "intro-to-ourrika",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43",
    excerpt: "Discover our vision of curated, high-end Moroccan journeys.",
    body: "<p>At Ourrika, we believe that travel should be more than just visiting a place—it should be a profound connection to its soul.</p>",
    publish_date: "2024-03-24",
  },
];

function rowToExperienceCard(row: ExperienceRow): ExperienceCard {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    image: row.cover_image,
    short_description: row.short_description,
    price: row.price,
    currency: row.currency || "€",
    location: row.location,
    duration: row.duration,
    whatsappMessage: (row.whatsapp_message_template || "Hello, I'm interested in {title}.").replace("{title}", row.title),
  };
}

function rowToExperienceDetail(row: ExperienceRow): ExperienceDetail {
  return {
    ...rowToExperienceCard(row),
    full_description: row.full_description || null,
    gallery: row.gallery || [],
    highlights: row.highlights || [],
  };
}

function rowToDestinationCard(row: DestinationRow): DestinationCard {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    image: row.cover_image,
    short_description: row.short_description,
    starting_price: row.starting_price,
    currency: row.currency || "€",
  };
}

function rowToDestinationDetail(row: DestinationRow): DestinationDetail {
  return {
    ...rowToDestinationCard(row),
    full_description: row.full_description || null,
    gallery: row.gallery || [],
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) return DEFAULT_SETTINGS;

  try {
    const snapshot = await adminDb.collection("site_settings").limit(1).get();
    if (snapshot.empty) return DEFAULT_SETTINGS;

    const row = snapshot.docs[0].data() as SiteSettingsRow;
    return {
      hero_title: row.hero_title || DEFAULT_SETTINGS.hero_title,
      hero_media_url: row.hero_media_url,
      whatsapp_number: row.whatsapp_number || "",
      instagram_link: row.instagram_link,
      facebook_link: row.facebook_link,
      tiktok_link: row.tiktok_link,
      faq_link: row.faq_link,
      contact_email: row.contact_email,
    };
  } catch (error: unknown) {
    console.error("[getSiteSettings] Firebase error:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function getFeaturedExperiences(limit = 5): Promise<ExperienceCard[]> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) return FALLBACK_EXPERIENCES;

  try {
    const snapshot = await adminDb
      .collection("experiences")
      .where("is_featured", "==", true)
      .orderBy("homepage_order", "asc")
      .limit(limit)
      .get();

    if (snapshot.empty) return FALLBACK_EXPERIENCES;
    return snapshot.docs.map(doc => rowToExperienceCard({ id: doc.id, ...doc.data() } as ExperienceRow));
  } catch (error: unknown) {
    console.error("[getFeaturedExperiences] Firebase error:", error);
    return FALLBACK_EXPERIENCES;
  }
}

export async function getAllExperiences(): Promise<ExperienceCard[]> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) return FALLBACK_EXPERIENCES;

  try {
    const snapshot = await adminDb
      .collection("experiences")
      .orderBy("homepage_order", "asc")
      .get();

    if (snapshot.empty) return FALLBACK_EXPERIENCES;
    return snapshot.docs.map(doc => rowToExperienceCard({ id: doc.id, ...doc.data() } as ExperienceRow));
  } catch (error: unknown) {
    console.error("[getAllExperiences] Firebase error:", error);
    return FALLBACK_EXPERIENCES;
  }
}

export async function getExperienceBySlug(slug: string): Promise<ExperienceDetail | null> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) {
    const fallback = FALLBACK_EXPERIENCES.find((e) => e.slug === slug);
    return fallback ? { ...fallback, full_description: null, gallery: [], highlights: [] } : null;
  }

  try {
    const snapshot = await adminDb
      .collection("experiences")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return rowToExperienceDetail({ id: doc.id, ...doc.data() } as ExperienceRow);
    }

    const fallback = FALLBACK_EXPERIENCES.find((e) => e.slug === slug);
    return fallback ? { ...fallback, full_description: null, gallery: [], highlights: [] } : null;
  } catch (error: unknown) {
    console.error("[getExperienceBySlug] Firebase error:", error);
    const fallback = FALLBACK_EXPERIENCES.find((e) => e.slug === slug);
    return fallback ? { ...fallback, full_description: null, gallery: [], highlights: [] } : null;
  }
}

export async function getFeaturedDestinations(limit = 4): Promise<DestinationCard[]> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) return FALLBACK_DESTINATIONS;

  try {
    const snapshot = await adminDb
      .collection("destinations")
      .where("is_featured", "==", true)
      .orderBy("homepage_order", "asc")
      .limit(limit)
      .get();

    if (snapshot.empty) return FALLBACK_DESTINATIONS;
    return snapshot.docs.map(doc => rowToDestinationCard({ id: doc.id, ...doc.data() } as DestinationRow));
  } catch (error: unknown) {
    console.error("[getFeaturedDestinations] Firebase error:", error);
    return FALLBACK_DESTINATIONS;
  }
}

export async function getAllDestinations(): Promise<DestinationCard[]> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) return FALLBACK_DESTINATIONS;

  try {
    const snapshot = await adminDb
      .collection("destinations")
      .orderBy("homepage_order", "asc")
      .get();

    if (snapshot.empty) return FALLBACK_DESTINATIONS;
    return snapshot.docs.map(doc => rowToDestinationCard({ id: doc.id, ...doc.data() } as DestinationRow));
  } catch (error: unknown) {
    console.error("[getAllDestinations] Firebase error:", error);
    return FALLBACK_DESTINATIONS;
  }
}

export async function getDestinationBySlug(slug: string): Promise<DestinationDetail | null> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) {
    const fallback = FALLBACK_DESTINATIONS.find((d) => d.slug === slug);
    return fallback ? { ...fallback, full_description: null, gallery: [] } : null;
  }

  try {
    const snapshot = await adminDb
      .collection("destinations")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return rowToDestinationDetail({ id: doc.id, ...doc.data() } as DestinationRow);
    }

    const fallback = FALLBACK_DESTINATIONS.find((d) => d.slug === slug);
    return fallback ? { ...fallback, full_description: null, gallery: [] } : null;
  } catch (error: unknown) {
    console.error("[getDestinationBySlug] Firebase error:", error);
    const fallback = FALLBACK_DESTINATIONS.find((d) => d.slug === slug);
    return fallback ? { ...fallback, full_description: null, gallery: [] } : null;
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) return FALLBACK_BLOG_POSTS;

  try {
    const snapshot = await adminDb
      .collection("blog_posts")
      .orderBy("publish_date", "desc")
      .get();

    if (snapshot.empty) return FALLBACK_BLOG_POSTS;
    return snapshot.docs.map(doc => {
      const row = { id: doc.id, ...doc.data() } as BlogPostRow;
      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        image: row.image,
        excerpt: row.excerpt,
        body: null,
        publish_date: row.publish_date,
      };
    });
  } catch (error: unknown) {
    console.error("[getAllBlogPosts] Firebase error:", error);
    return FALLBACK_BLOG_POSTS;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) {
    return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }

  try {
    const snapshot = await adminDb
      .collection("blog_posts")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      const row = { id: doc.id, ...doc.data() } as BlogPostRow;
      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        image: row.image,
        excerpt: row.excerpt,
        body: row.body,
        publish_date: row.publish_date,
      };
    }

    return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  } catch (error: unknown) {
    console.error("[getBlogPostBySlug] Firebase error:", error);
    return FALLBACK_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getPartners(): Promise<PartnerLogo[]> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) return [];

  try {
    const snapshot = await adminDb
      .collection("partners")
      .where("is_active", "==", true)
      .orderBy("display_order", "asc")
      .get();
      
    return snapshot.docs.map(doc => {
      const row = { id: doc.id, ...doc.data() } as PartnerRow;
      return {
        id: row.id,
        name: row.name,
        logo: row.logo,
        link: row.link,
      };
    });
  } catch (error: unknown) {
    console.error("[getPartners] Firebase error:", error);
    return [];
  }
}

export async function getRelatedExperiences(excludeSlug: string, limitCount = 3): Promise<ExperienceCard[]> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) {
    return FALLBACK_EXPERIENCES.filter(e => e.slug !== excludeSlug).slice(0, limitCount);
  }

  try {
    const snapshot = await adminDb
      .collection("experiences")
      .where("slug", "!=", excludeSlug)
      .limit(limitCount)
      .get();
      
    return snapshot.docs.map(doc => rowToExperienceCard({ id: doc.id, ...doc.data() } as ExperienceRow));
  } catch (error: unknown) {
    console.error("[getRelatedExperiences] Firebase error:", error);
    return [];
  }
}

export async function getRelatedDestinations(excludeSlug: string, limitCount = 3): Promise<DestinationCard[]> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) {
    return FALLBACK_DESTINATIONS.filter(d => d.slug !== excludeSlug).slice(0, limitCount);
  }

  try {
    const snapshot = await adminDb
      .collection("destinations")
      .where("slug", "!=", excludeSlug)
      .limit(limitCount)
      .get();
      
    return snapshot.docs.map(doc => rowToDestinationCard({ id: doc.id, ...doc.data() } as DestinationRow));
  } catch (error: unknown) {
    console.error("[getRelatedDestinations] Firebase error:", error);
    return [];
  }
}

export async function getRelatedBlogPosts(excludeSlug: string, limitCount = 3): Promise<BlogPost[]> {
  const isConfigured = isFirebaseAdminConfigured();
  if (!isConfigured || !adminDb) return [];

  try {
    const snapshot = await adminDb
      .collection("blog_posts")
      .where("slug", "!=", excludeSlug)
      .limit(limitCount)
      .get();
      
    return snapshot.docs.map(doc => {
      const row = { id: doc.id, ...doc.data() } as BlogPostRow;
      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        image: row.image,
        excerpt: row.excerpt,
        body: null,
        publish_date: row.publish_date,
      };
    });
  } catch (error: unknown) {
    console.error("[getRelatedBlogPosts] Firebase error:", error);
    return [];
  }
}
