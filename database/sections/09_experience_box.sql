-- ==============================================================================
-- 📦 SECTION BOX 09: WORK EXPERIENCE & INTERNSHIPS
-- ==============================================================================
-- Purpose: Professional roles, responsibilities, and achievements.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    employment_type TEXT DEFAULT 'Full-time' CHECK (
        employment_type IN ('Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance')
    ),
    location TEXT,
    start_date TEXT,
    end_date TEXT,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    responsibilities TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    company_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published experiences" 
ON public.experiences FOR SELECT 
USING (is_published = true);

CREATE INDEX IF NOT EXISTS idx_exp_order ON public.experiences(is_published, display_order);
