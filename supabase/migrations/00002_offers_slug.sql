-- Migration: Add slug column to offers table for clean URL routing
-- Also add order column for consistent listing sort

ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

-- Auto-populate slug from id for any existing rows that don't have one
-- New rows should set slug explicitly (e.g. via Supabase dashboard/API)
UPDATE public.offers
  SET slug = REPLACE(LOWER(title), ' ', '-')
  WHERE slug IS NULL;
