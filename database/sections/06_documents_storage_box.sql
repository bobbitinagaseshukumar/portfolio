-- ==============================================================================
-- 📦 SECTION BOX 06: DOCUMENT MANAGEMENT & CLOUD FILE STORAGE
-- ==============================================================================
-- Purpose: Central repository for all verified documents with 3-tier visibility,
--          version history, preview/download controls, and bucket routing.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.portfolio_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_type TEXT NOT NULL, -- 'pdf', 'image', 'video', 'document'
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'personal', 'school', 'intermediate', 'college', 'resume', 
        'certifications', 'projects', 'achievements', 'other'
    )),
    description TEXT,
    related_entity_type TEXT,
    related_entity_id TEXT,
    -- Granular Permissions
    visibility TEXT NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'UNLISTED')),
    publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'pending', 'approved', 'published', 'hidden', 'archived')),
    show_on_website BOOLEAN DEFAULT true,
    allow_preview BOOLEAN DEFAULT true,
    allow_download BOOLEAN DEFAULT true,
    -- Versioning & Status
    is_active BOOLEAN DEFAULT true,
    version_number INTEGER DEFAULT 1,
    parent_document_id UUID REFERENCES public.portfolio_documents(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    issue_date TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at TIMESTAMPTZ
);

-- Version History Table (Immutable Records)
CREATE TABLE IF NOT EXISTS public.document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.portfolio_documents(id) ON DELETE CASCADE NOT NULL,
    version_number INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_by TEXT,
    change_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portfolio_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;

-- CRITICAL SECURITY POLICY: Public visitors can ONLY access documents that are explicitly PUBLIC and published
CREATE POLICY "Public read approved documents" 
ON public.portfolio_documents 
FOR SELECT 
USING (
    visibility = 'PUBLIC' 
    AND publication_status = 'published' 
    AND show_on_website = true 
    AND is_active = true
);

CREATE INDEX IF NOT EXISTS idx_docs_permissions ON public.portfolio_documents(visibility, publication_status, show_on_website);
CREATE INDEX IF NOT EXISTS idx_docs_category ON public.portfolio_documents(category);
CREATE INDEX IF NOT EXISTS idx_versions_doc_id ON public.document_versions(document_id);
