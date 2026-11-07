-- ==============================================================================
-- 📦 SECTION BOX 07: CERTIFICATIONS & CREDENTIALS
-- ==============================================================================
-- Purpose: Professional certifications linked with documents & verification URLs.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    issue_date TEXT,
    expiry_date TEXT,
    credential_id TEXT,
    verification_url TEXT,
    description TEXT,
    skills TEXT[] DEFAULT '{}',
    document_id UUID REFERENCES public.portfolio_documents(id) ON DELETE SET NULL,
    file_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published certifications" 
ON public.certifications FOR SELECT 
USING (is_published = true);

CREATE INDEX IF NOT EXISTS idx_certs_order ON public.certifications(is_published, display_order);
