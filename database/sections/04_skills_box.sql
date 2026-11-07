-- ==============================================================================
-- 📦 SECTION BOX 04: SKILLS & TECHNICAL DOMAINS
-- ==============================================================================
-- Purpose: Technical competencies, categorized with proficiency & display order.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN ('Frontend', 'Backend', 'Database', 'Cloud & DevOps', 'Languages', 'Tools', 'Other')
    ),
    proficiency INTEGER DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
    icon_name TEXT,
    icon_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    learning_status TEXT DEFAULT 'mastered' CHECK (learning_status IN ('mastered', 'in-progress', 'learning')),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published skills" 
ON public.skills FOR SELECT 
USING (is_published = true);

CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category, display_order);
