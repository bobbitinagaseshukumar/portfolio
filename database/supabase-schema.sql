-- ==============================================================================
-- SUPABASE DATABASE SCHEMA FOR 3D PORTFOLIO
-- Execute this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Contact Messages Table (for visitors sending messages via the portfolio)
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    screen_device TEXT, -- 'mobile', 'tablet', 'desktop'
    screen_resolution TEXT, -- e.g. '1920x1080', '390x844'
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Projects Showcase Table (Optional: if you want dynamic projects from Supabase)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    video_url TEXT, -- Link to uploaded video in public/videos or external URL
    live_url TEXT,
    github_url TEXT,
    featured BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Visitor / Screen Ratio Analytics Table (Tracking responsive viewport statistics)
CREATE TABLE IF NOT EXISTS public.visitor_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_type TEXT NOT NULL, -- 'mobile', 'tablet', 'desktop'
    screen_ratio TEXT NOT NULL, -- e.g. '16:9', '9:19.5', '4:3'
    screen_width INTEGER,
    screen_height INTEGER,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;

-- Allow anonymous visitors to insert new contact messages
CREATE POLICY "Allow public insert to contacts"
ON public.contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public to read projects
CREATE POLICY "Allow public read projects"
ON public.projects
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow public to record visitor device stats
CREATE POLICY "Allow public insert visitor stats"
ON public.visitor_stats
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON public.contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_visitor_stats_device ON public.visitor_stats(device_type);
