-- ==============================================================================
-- 🛡️ SUPABASE COMPLETE PRODUCTION SCHEMA: PORTFOLIO, ADMIN & DOCUMENT STORAGE
-- Zero Fake Data • Complete Permission Architecture • Real-Time Synchronized
-- Run this in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Enable pgcrypto for UUIDs & hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. ADMIN AUTHENTICATION & SECURITY TABLES
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT DEFAULT 'SUPER_ADMIN' CHECK (role IN ('SUPER_ADMIN', 'ADMIN')),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admin_otp_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    otp_hash TEXT NOT NULL,
    login_method TEXT NOT NULL CHECK (login_method IN ('google', 'password', 'password_reset', 'credential_update')),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 5,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    admin_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. GLOBAL PROFILE (Single Source of Truth)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL DEFAULT 'Nagaseshu Kumar Bobbiti',
    display_name TEXT DEFAULT 'Kumar',
    developer_title TEXT NOT NULL DEFAULT '',
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
    -- Current Academic Info
    college_name TEXT,
    school_name TEXT,
    degree TEXT,
    branch TEXT,
    academic_year TEXT,
    start_year TEXT,
    completion_year TEXT,
    cgpa TEXT,
    academic_description TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. EDUCATION RECORDS (Schools, Colleges, Degrees)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_name TEXT NOT NULL,
    institution_type TEXT DEFAULT 'college' CHECK (institution_type IN ('school', 'intermediate', 'college', 'university', 'other')),
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

-- ==============================================================================
-- 5. SKILLS MANAGEMENT
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    proficiency INTEGER DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
    icon_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    learning_status TEXT DEFAULT 'mastered' CHECK (learning_status IN ('mastered', 'in-progress', 'learning')),
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. PROJECTS MANAGEMENT
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

-- ==============================================================================
-- 7. COMPLETE DOCUMENT & FILE STORAGE SYSTEM
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.portfolio_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    storage_path TEXT NOT NULL, -- Path in Supabase Storage or /uploads/
    file_type TEXT NOT NULL, -- 'pdf', 'image', 'video', 'document'
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL, -- Bytes
    category TEXT NOT NULL CHECK (category IN (
        'personal', 'school', 'intermediate', 'college', 'resume', 
        'certifications', 'projects', 'achievements', 'other'
    )),
    description TEXT,
    related_entity_type TEXT, -- 'education', 'project', 'certification', 'achievement'
    related_entity_id TEXT,
    -- Granular Permissions
    visibility TEXT DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'UNLISTED')),
    publication_status TEXT DEFAULT 'draft' CHECK (publication_status IN ('draft', 'pending', 'approved', 'published', 'hidden', 'archived')),
    show_on_website BOOLEAN DEFAULT true,
    allow_preview BOOLEAN DEFAULT true,
    allow_download BOOLEAN DEFAULT true,
    -- Versioning
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

-- Document Version History
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

-- ==============================================================================
-- 8. CERTIFICATIONS, ACHIEVEMENTS, EXPERIENCES, SOCIALS
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

CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT DEFAULT 'work' CHECK (type IN ('work', 'internship', 'milestone', 'education', 'event')),
    organization TEXT,
    location TEXT,
    start_date TEXT,
    end_date TEXT,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    technologies TEXT[] DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    icon_name TEXT,
    display_order INTEGER DEFAULT 0,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT DEFAULT 'Kumar Portfolio',
    site_description TEXT DEFAULT '',
    logo_url TEXT,
    favicon_url TEXT,
    primary_email TEXT DEFAULT 'nagaseshukumarbobbiti@gmail.com',
    contact_email TEXT,
    location TEXT DEFAULT 'India',
    copyright_text TEXT DEFAULT '© 2026 Kumar. All rights reserved.',
    theme_settings JSONB DEFAULT '{}'::jsonb,
    seo_title TEXT DEFAULT 'Kumar | Portfolio',
    seo_description TEXT,
    og_image_url TEXT,
    maintenance_mode BOOLEAN DEFAULT false,
    hero_3d_enabled BOOLEAN DEFAULT true,
    hero_reveal_text TEXT DEFAULT 'Kumar',
    developer_title_reveal TEXT DEFAULT '',
    loading_screen_text TEXT DEFAULT 'Loading Portfolio...',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_otp_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES: Visitors can ONLY read approved and published public content
CREATE POLICY "Public read published profile" ON public.profiles FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published education" ON public.education FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published skills" ON public.skills FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published certs" ON public.certifications FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published achievements" ON public.achievements FOR SELECT USING (is_published = true);
CREATE POLICY "Public read published experiences" ON public.experiences FOR SELECT USING (is_published = true);
CREATE POLICY "Public read enabled social links" ON public.social_links FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public read website settings" ON public.website_settings FOR SELECT USING (true);

-- CRITICAL STORAGE PERMISSION: Public can ONLY view documents that are PUBLIC, PUBLISHED, and APPROVED
CREATE POLICY "Public read approved documents" 
ON public.portfolio_documents 
FOR SELECT 
USING (
    visibility = 'PUBLIC' 
    AND publication_status = 'published' 
    AND show_on_website = true 
    AND is_active = true
);

-- ==============================================================================
-- 10. INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_docs_visibility ON public.portfolio_documents(visibility, publication_status, show_on_website);
CREATE INDEX IF NOT EXISTS idx_docs_category ON public.portfolio_documents(category);
CREATE INDEX IF NOT EXISTS idx_docs_related ON public.portfolio_documents(related_entity_type, related_entity_id);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_edu_published ON public.education(is_published, display_order);

-- ==============================================================================
-- 11. ZERO FAKE DATA INITIALIZATION
-- Real confirmed details only: Name and Email. All other personal fields empty.
-- ==============================================================================

INSERT INTO public.profiles (full_name, display_name, email, is_published)
SELECT 'Nagaseshu Kumar Bobbiti', 'Kumar', 'nagaseshukumarbobbiti@gmail.com', true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles);

INSERT INTO public.website_settings (site_name, seo_title, primary_email)
SELECT 'Kumar Portfolio', 'Kumar | Portfolio', 'nagaseshukumarbobbiti@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM public.website_settings);
