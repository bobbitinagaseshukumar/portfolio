-- ==============================================================================
-- 📦 SECTION BOX 03: EDUCATION SYSTEM (SCHOOL, INTERMEDIATE, DEGREE, MASTERS)
-- ==============================================================================
-- Purpose: Academic qualifications organized by institution type.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_name TEXT NOT NULL,
    institution_type TEXT NOT NULL DEFAULT 'college' CHECK (
        institution_type IN ('school', 'intermediate', 'college', 'university', 'btech', 'masters', 'other')
    ),
    degree TEXT,
    branch_or_field TEXT,
    academic_year TEXT,
    start_date TEXT,
    end_date TEXT,
    is_current BOOLEAN DEFAULT false,
    location TEXT,
    score_or_cgpa TEXT,
    description TEXT,
    logo_url TEXT,
    institution_photo TEXT,
    supporting_documents TEXT[] DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published education" 
ON public.education FOR SELECT 
USING (is_published = true);

CREATE INDEX IF NOT EXISTS idx_edu_published ON public.education(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_edu_type ON public.education(institution_type);
