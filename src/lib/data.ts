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

// Default SiteSettings returned when Firebase is not yet configured
const DEFAULT_SETTINGS: SiteSettings = {
  hero_title: "Escape. Breathe. Explore. Discover premium, authentic Moroccan experiences.",
  hero_media_url: null,
  whatsapp_number: "+212 600 000 000",
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
    image: "https://images.unsplash.com/photo-1504198266315-b77da2928503",
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
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0",
    short_description: "DJ set, tapas, and the Marrakech skyline every Friday evening.",
    price: 45,
    currency: "€",
    location: "Marrakech Medina",
    duration: "3 hours",
    whatsappMessage: "Hi! I'd like to reserve a spot at Friday Rooftop — how do I book?",
  },
];

const FALLBACK_DESTINATIONS: DestinationCard[] = [
  {
    id: "1",
    name: "Marrakech",
    slug: "marrakech",
    image: "https://images.unsplash.com/photo-1539020290-7389a19c67ee",
    short_description: "The medina, the souks, and the rooftops — all of it.",
    starting_price: 30,
    currency: "€",
  },
  {
    id: "2",
    name: "Ourika Valley",
    slug: "ourika-valley",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    short_description: "The Atlas foothills, an hour from the city.",
    starting_price: 65,
    currency: "€",
  },
  {
    id: "3",
    name: "Fez",
    slug: "fez",
    image: "https://images.unsplash.com/photo-1548013146-72479768bada",
    short_description: "The oldest medina in the world. Unchanged for centuries.",
    starting_price: 180,
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
    body: "<p>At Ourrika, we believe that travel should be more than just visiting a place—it should be a profound connection to its soul.</p><p>Our mission is to curate exclusive experiences that reveal the authentic heart of Morocco, from the vibrant streets of Marrakech to the silent majesty of the Sahara.</p><ul><li>Exclusive access</li><li>Private curated paths</li><li>Expert local storytellers</li></ul>",
    publish_date: "2024-03-24",
  },
];

// ------------------------------------------------------------------
// Helpers: Transformers
// ------------------------------------------------------------------

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


// ------------------------------------------------------------------
// SITE SETTINGS
// ------------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isFirebaseAdminConfigured || !adminDb) return DEFAULT_SETTINGS;

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
    console.error("[getSiteSettings] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return DEFAULT_SETTINGS;
  }
}

// ------------------------------------------------------------------
// EXPERIENCES — Featured (homepage)
// ------------------------------------------------------------------

export async function getFeaturedExperiences(limit = 5): Promise<ExperienceCard[]> {
  if (!isFirebaseAdminConfigured || !adminDb) return FALLBACK_EXPERIENCES;

  try {
    const snapshot = await adminDb
      .collection("experiences")
      .where("is_featured", "==", true)
      .orderBy("homepage_order", "asc")
      .limit(limit)
      .get();
      
    if (snapshot.empty) return FALLBACK_EXPERIENCES;
    const dbExperiences = snapshot.docs.map(doc => rowToExperienceCard({ id: doc.id, ...doc.data() } as ExperienceRow));
    return [...FALLBACK_EXPERIENCES, ...dbExperiences].slice(0, limit);
  } catch (error: unknown) {
    console.error("[getFeaturedExperiences] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return FALLBACK_EXPERIENCES;
  }
}

// ------------------------------------------------------------------
// EXPERIENCES — All (listing page)
// ------------------------------------------------------------------

export async function getAllExperiences(): Promise<ExperienceCard[]> {
  if (!isFirebaseAdminConfigured || !adminDb) return FALLBACK_EXPERIENCES;

  try {
    const snapshot = await adminDb
      .collection("experiences")
      .orderBy("homepage_order", "asc")
      .get();
      
    if (snapshot.empty) return FALLBACK_EXPERIENCES;
    const dbExperiences = snapshot.docs.map(doc => rowToExperienceCard({ id: doc.id, ...doc.data() } as ExperienceRow));
    return [...FALLBACK_EXPERIENCES, ...dbExperiences];
  } catch (error: unknown) {
    console.error("[getAllExperiences] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return FALLBACK_EXPERIENCES;
  }
}

// ------------------------------------------------------------------
// EXPERIENCES — Detail by slug
// ------------------------------------------------------------------

export async function getExperienceBySlug(slug: string): Promise<ExperienceDetail | null> {
  // 1. Check fallback data first
  const fallback = FALLBACK_EXPERIENCES.find((e) => e.slug === slug);
  if (fallback) {
    // Transform Card to Detail for fallback
    return {
      ...fallback,
      full_description: null,
      gallery: [],
      highlights: [],
    };
  }

  if (!isFirebaseAdminConfigured || !adminDb) return null;

  try {
    const snapshot = await adminDb
      .collection("experiences")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return rowToExperienceDetail({ id: doc.id, ...doc.data() } as ExperienceRow);
  } catch (error: unknown) {
    console.error("[getExperienceBySlug] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return null;
  }
}

// ------------------------------------------------------------------
// DESTINATIONS — Featured (homepage)
// ------------------------------------------------------------------

export async function getFeaturedDestinations(limit = 4): Promise<DestinationCard[]> {
  if (!isFirebaseAdminConfigured || !adminDb) return FALLBACK_DESTINATIONS;

  try {
    // Note: This uses compound index for destinations: is_featured + homepage_order
    const snapshot = await adminDb
      .collection("destinations")
      .where("is_featured", "==", true)
      .orderBy("homepage_order", "asc")
      .limit(limit)
      .get();
      
    if (snapshot.empty) return FALLBACK_DESTINATIONS;
    const dbDestinations = snapshot.docs.map(doc => rowToDestinationCard({ id: doc.id, ...doc.data() } as DestinationRow));
    return [...FALLBACK_DESTINATIONS, ...dbDestinations].slice(0, limit);
  } catch (error: unknown) {
    console.error("[getFeaturedDestinations] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return FALLBACK_DESTINATIONS;
  }
}

// ------------------------------------------------------------------
// DESTINATIONS — All (listing page)
// ------------------------------------------------------------------

export async function getAllDestinations(): Promise<DestinationCard[]> {
  if (!isFirebaseAdminConfigured || !adminDb) return FALLBACK_DESTINATIONS;

  try {
    const snapshot = await adminDb
      .collection("destinations")
      .orderBy("homepage_order", "asc")
      .get();
      
    if (snapshot.empty) return FALLBACK_DESTINATIONS;
    const dbDestinations = snapshot.docs.map(doc => rowToDestinationCard({ id: doc.id, ...doc.data() } as DestinationRow));
    return [...FALLBACK_DESTINATIONS, ...dbDestinations];
  } catch (error: unknown) {
    console.error("[getAllDestinations] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return FALLBACK_DESTINATIONS;
  }
}

// ------------------------------------------------------------------
// DESTINATIONS — Detail by slug
// ------------------------------------------------------------------

export async function getDestinationBySlug(slug: string): Promise<DestinationDetail | null> {
  // 1. Check fallback data first
  const fallback = FALLBACK_DESTINATIONS.find((d) => d.slug === slug);
  if (fallback) {
    return {
      ...fallback,
      full_description: null,
      gallery: [],
    };
  }

  if (!isFirebaseAdminConfigured || !adminDb) return null;

  try {
    const snapshot = await adminDb
      .collection("destinations")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return rowToDestinationDetail({ id: doc.id, ...doc.data() } as DestinationRow);
  } catch (error: unknown) {
    console.error("[getDestinationBySlug] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return null;
  }
}


// ------------------------------------------------------------------
// BLOG POSTS — All
// ------------------------------------------------------------------

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (!isFirebaseAdminConfigured || !adminDb) return FALLBACK_BLOG_POSTS;

  try {
    const snapshot = await adminDb
      .collection("blog_posts")
      .orderBy("publish_date", "desc")
      .get();
      
    const dbPosts = snapshot.docs.map(doc => {
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

    return [...FALLBACK_BLOG_POSTS, ...dbPosts];
  } catch (error: unknown) {
    console.error("[getAllBlogPosts] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return FALLBACK_BLOG_POSTS;
  }
}

// ------------------------------------------------------------------
// BLOG POSTS — Detail by slug
// ------------------------------------------------------------------

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  // 1. Check fallback data first
  const fallback = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug);
  if (fallback) return fallback;

  if (!isFirebaseAdminConfigured || !adminDb) return null;

  try {
    const snapshot = await adminDb
      .collection("blog_posts")
      .where("slug", "==", slug)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
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
  } catch (error: unknown) {
    console.error("[getBlogPostBySlug] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return null;
  }
}

// ------------------------------------------------------------------
// PARTNERS — All active
// ------------------------------------------------------------------

export async function getPartners(): Promise<PartnerLogo[]> {
  if (!isFirebaseAdminConfigured || !adminDb) return [];

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
    console.error("[getPartners] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return [];
  }
}

// ------------------------------------------------------------------
// RELATED — Experiences in same category
// ------------------------------------------------------------------

export async function getRelatedExperiences(excludeSlug: string, limitCount = 3): Promise<ExperienceCard[]> {
  if (!isFirebaseAdminConfigured || !adminDb) return [];

  try {
    // Simple similar logic: same category or just everything else if category not set
    const snapshot = await adminDb
      .collection("experiences")
      .where("slug", "!=", excludeSlug)
      .limit(limitCount)
      .get();
      
    return snapshot.docs.map(doc => rowToExperienceCard({ id: doc.id, ...doc.data() } as ExperienceRow));
  } catch (error: unknown) {
    console.error("[getRelatedExperiences] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return [];
  }
}

export async function getRelatedDestinations(excludeSlug: string, limitCount = 3): Promise<DestinationCard[]> {
  if (!isFirebaseAdminConfigured || !adminDb) return [];

  try {
    const snapshot = await adminDb
      .collection("destinations")
      .where("slug", "!=", excludeSlug)
      .limit(limitCount)
      .get();
      
    return snapshot.docs.map(doc => rowToDestinationCard({ id: doc.id, ...doc.data() } as DestinationRow));
  } catch (error: unknown) {
    console.error("[getRelatedDestinations] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return [];
  }
}


export async function getRelatedBlogPosts(excludeSlug: string, limitCount = 3): Promise<BlogPost[]> {
  if (!isFirebaseAdminConfigured || !adminDb) return [];

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
    console.error("[getRelatedBlogPosts] Firebase error:", (error instanceof Error ? error.message : String(error)));
    return [];
  }
}
