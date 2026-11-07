-- ==============================================================================
-- 📦 SECTION BOX 05: PROJECTS & CASE STUDIES
-- ==============================================================================
-- Purpose: Complete project showcases with description, links, tags, and media.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    category TEXT NOT NULL DEFAULT 'Full Stack',
    short_description TEXT NOT NULL,
    full_description TEXT,
    problem TEXT,
    solution TEXT,
    features TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    architecture TEXT,
    challenges TEXT,
    results TEXT,
    lessons_learned TEXT,
    future_improvements TEXT,
    thumbnail TEXT,
    hero_image TEXT,
    gallery TEXT[] DEFAULT '{}',
    video_url TEXT,
    github_url TEXT,
    live_url TEXT,
    project_year TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published projects" 
ON public.projects FOR SELECT 
USING (is_published = true);

CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(is_published, display_order);
