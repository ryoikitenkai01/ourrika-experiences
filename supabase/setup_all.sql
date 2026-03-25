-- ============================================================
-- OURRIKA EXPERIENCES — FULL DATABASE SETUP
-- Run this entire file once in the Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Extension needed for uuid generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── site_settings ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logo_url TEXT,
    hero_title TEXT DEFAULT 'Escape. Breathe. Explore...',
    hero_media_url TEXT,
    faq_link TEXT,
    contact_email TEXT,
    whatsapp_number TEXT,
    instagram_link TEXT,
    facebook_link TEXT,
    tiktok_link TEXT,
    language_settings JSONB DEFAULT '{"en": true}',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── destinations ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cover_image TEXT NOT NULL,
    gallery TEXT[],
    short_description TEXT,
    full_description TEXT,
    starting_price NUMERIC,
    currency TEXT DEFAULT 'MAD',
    is_featured BOOLEAN DEFAULT false,
    is_most_booked BOOLEAN DEFAULT false,
    homepage_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── experiences ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cover_image TEXT NOT NULL,
    gallery TEXT[],
    highlights JSONB DEFAULT '[]',
    short_description TEXT,
    full_description TEXT,
    location TEXT,
    price NUMERIC,
    currency TEXT DEFAULT 'MAD',
    duration TEXT,
    is_featured BOOLEAN DEFAULT false,
    homepage_order INT DEFAULT 0,
    whatsapp_message_template TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── offers ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    cover_image TEXT,
    original_price NUMERIC,
    promo_price NUMERIC,
    valid_from DATE,
    valid_until DATE,
    display_order INT DEFAULT 0,
    linked_experience_id UUID REFERENCES public.experiences(id) ON DELETE SET NULL,
    linked_destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── blog_posts ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image TEXT,
    excerpt TEXT,
    body TEXT,
    publish_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── partners ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    link TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── booking_requests (leads) ───────────────────────────────
CREATE TABLE IF NOT EXISTS public.booking_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name   TEXT NOT NULL,
    phone       TEXT,
    email       TEXT,
    preferred_date  DATE,
    guests_count    INT DEFAULT 1,
    message         TEXT,
    service_id      TEXT,
    service_title   TEXT,
    service_type    TEXT,
    source_page     TEXT,
    status          TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Row-Level Security for booking_requests
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON public.booking_requests
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON public.booking_requests
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates" ON public.booking_requests
    FOR UPDATE USING (auth.role() = 'authenticated');

-- ── Initial site_settings row ──────────────────────────────
-- Edit whatsapp_number, instagram_link etc. to your real values
INSERT INTO public.site_settings (
    whatsapp_number,
    hero_title,
    instagram_link,
    facebook_link,
    tiktok_link,
    contact_email
) VALUES (
    '212600000000',       -- ← Replace with your WhatsApp number (no + or spaces)
    'Crafted Journeys for Discerning Travellers',
    'https://instagram.com/ourrika',  -- ← Replace with yours
    'https://facebook.com/ourrika',   -- ← Replace with yours
    '',
    'hello@ourrika.com'               -- ← Replace with yours
);
