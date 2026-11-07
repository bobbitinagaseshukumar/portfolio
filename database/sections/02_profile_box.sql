-- ==============================================================================
-- 📦 SECTION BOX 02: DEVELOPER PROFILE & HERO INFORMATION
-- ==============================================================================
-- Purpose: Controls personal identity, hero headlines, bio, titles, and avatar.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL DEFAULT 'Nagaseshu Kumar Bobbiti',
    display_name TEXT DEFAULT 'Kumar',
    developer_title TEXT NOT NULL DEFAULT '',
    tagline TEXT DEFAULT '',
    profile_photo TEXT,
    banner_photo TEXT,
    short_intro TEXT DEFAULT '',
    biography TEXT DEFAULT '',
    email TEXT DEFAULT 'nagaseshukumarbobbiti@gmail.com',
    phone TEXT,
    location TEXT DEFAULT 'India',
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    current_role TEXT DEFAULT '',
    specialization TEXT DEFAULT '',
    learning_focus TEXT DEFAULT '',
    professional_interests TEXT,
    career_objective TEXT,
    availability TEXT DEFAULT 'available',
    website_url TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published profile" 
ON public.profiles FOR SELECT 
USING (is_published = true);

-- Initialize Single Source of Truth Profile with confirmed details only (Zero Fake Data)
INSERT INTO public.profiles (full_name, display_name, email, is_published)
SELECT 'Nagaseshu Kumar Bobbiti', 'Kumar', 'nagaseshukumarbobbiti@gmail.com', true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles);
