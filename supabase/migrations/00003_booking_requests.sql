-- Migration: bookings_leads / leads table
-- Captures user inquiries from experience, destination, and offer pages.

CREATE TABLE IF NOT EXISTS public.bookings_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Contact info
    full_name   TEXT NOT NULL,
    phone       TEXT,
    email       TEXT,

    -- Booking intent
    preferred_date  DATE,
    guests_count    INT DEFAULT 1,
    message         TEXT,

    -- Which service triggered the request
    service_id      TEXT,          -- UUID or slug of the linked record
    service_title   TEXT,          -- human-readable copy at time of submission
    service_type    TEXT,          -- 'experience' | 'destination' | 'offer'

    -- Tracking
    source_page TEXT,             -- e.g. '/experiences/hot-air-balloon'
    status      TEXT DEFAULT 'new', -- new | contacted | confirmed | cancelled

    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row-Level Security: allow anonymous inserts (for the public booking form),
-- but only allow service-role reads (for the future admin panel).
ALTER TABLE public.bookings_leads ENABLE ROW LEVEL SECURITY;

-- Public can insert
CREATE POLICY "Allow public inserts" ON public.bookings_leads
    FOR INSERT WITH CHECK (true);

-- Only authenticated users (admin) can select / update
CREATE POLICY "Allow authenticated reads" ON public.bookings_leads
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates" ON public.bookings_leads
    FOR UPDATE USING (auth.role() = 'authenticated');
