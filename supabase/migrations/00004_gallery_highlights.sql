-- Migration: add gallery to destinations, highlights to experiences
-- Gallery: array of image URLs (same pattern as experiences.gallery)
-- Highlights: JSONB array of strings, e.g. ["Sunrise view","Expert guide","All equipment"]

ALTER TABLE public.destinations
  ADD COLUMN IF NOT EXISTS gallery TEXT[];

ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]';
-- highlights stored as a JSONB array of text, e.g. ["Private guide","Camel ride","Sunset"]
