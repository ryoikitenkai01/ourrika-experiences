// ------------------------------------------------------------------
// UI-level data contracts.
// These are what components receive — not raw DB rows.
// ------------------------------------------------------------------

export interface SiteSettings {
  hero_title: string;
  hero_media_url: string | null;
  whatsapp_number: string;
  instagram_link: string | null;
  facebook_link: string | null;
  tiktok_link: string | null;
  faq_link: string | null;
  contact_email: string | null;
}

export interface ExperienceCard {
  id: string;
  title: string;
  slug: string;
  image: string;
  short_description: string | null;
  price: number | null;
  currency: string;
  location: string | null;
  duration: string | null;
  /** Pre-filled WhatsApp message ready for `wa.me` URL */
  whatsappMessage: string;
}

export interface ExperienceDetail extends ExperienceCard {
  full_description: string | null;
  gallery: string[];
  highlights: string[];
}

export interface DestinationCard {
  id: string;
  name: string;
  slug: string;
  image: string;
  short_description: string | null;
  starting_price: number | null;
  currency: string;
}

export interface DestinationDetail extends DestinationCard {
  full_description: string | null;
  gallery: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  /** Plain text teaser */
  excerpt: string | null;
  /** Full article body, supports basic HTML strings */
  body: string | null;
  publish_date: string | null;
}

export interface PartnerLogo {
  id: string;
  name: string;
  logo: string;
  link: string | null;
}
