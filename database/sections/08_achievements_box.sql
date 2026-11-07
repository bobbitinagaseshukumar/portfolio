-- ==============================================================================
-- 📦 SECTION BOX 08: ACHIEVEMENTS, AWARDS & HONORS
-- ==============================================================================
-- Purpose: Competitions, hackathons, academic honors, and recognitions.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuer TEXT,
    date TEXT,
    description TEXT,
    proof_url TEXT,
    document_id UUID REFERENCES public.portfolio_documents(id) ON DELETE SET NULL,
    verification_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published achievements" 
ON public.achievements FOR SELECT 
USING (is_published = true);

CREATE INDEX IF NOT EXISTS idx_achieve_order ON public.achievements(is_published, display_order);
