// Auto-generated types matching supabase/migrations/00001_init.sql
// Keep these in sync with the database schema.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: string;
          logo_url: string | null;
          hero_title: string | null;
          hero_media_url: string | null;
          faq_link: string | null;
          contact_email: string | null;
          whatsapp_number: string | null;
          instagram_link: string | null;
          facebook_link: string | null;
          tiktok_link: string | null;
          language_settings: Json | null;
          created_at: string;
          updated_at: string;
        };
      };
      destinations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          cover_image: string;
          short_description: string | null;
          full_description: string | null;
          starting_price: number | null;
          currency: string | null;
          is_featured: boolean | null;
          is_most_booked: boolean | null;
          homepage_order: number | null;
          created_at: string;
          updated_at: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          title: string;
          slug: string;
          cover_image: string;
          gallery: string[] | null;
          short_description: string | null;
          full_description: string | null;
          location: string | null;
          price: number | null;
          currency: string | null;
          duration: string | null;
          is_featured: boolean | null;
          homepage_order: number | null;
          whatsapp_message_template: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      offers: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          description: string | null;
          cover_image: string | null;
          original_price: number | null;
          promo_price: number | null;
          valid_from: string | null;
          valid_until: string | null;
          linked_experience_id: string | null;
          linked_destination_id: string | null;
          is_featured: boolean | null;
          display_order: number | null;
          created_at: string;
          updated_at: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          image: string | null;
          excerpt: string | null;
          body: string | null;
          publish_date: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      partners: {
        Row: {
          id: string;
          name: string;
          logo: string;
          link: string | null;
          display_order: number | null;
          is_active: boolean | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
