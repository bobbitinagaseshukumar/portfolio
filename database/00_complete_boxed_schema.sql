-- ==============================================================================
-- 🚀 SUPABASE POSTGRESQL COMPLETE DATABASE SCHEMA
-- Connection: postgresql://postgres:[YOUR-PASSWORD]@db.hwxfrbxpbvpsuzdhlbtn.supabase.co:5432/postgres
-- Instructions: Run in Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 📦 BOX 1: ADMINISTRATOR AUTHENTICATION & SECURITY AUDIT                    │
-- └────────────────────────────────────────────────────────────────────────────┘

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

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 📦 BOX 2: DEVELOPER PROFILE & HERO IDENTITY                                │
-- └────────────────────────────────────────────────────────────────────────────┘

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

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 📦 BOX 3: EDUCATION (SCHOOL, INTERMEDIATE, DEGREE, MASTERS)                │
-- └────────────────────────────────────────────────────────────────────────────┘

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

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 📦 BOX 4: SKILLS & TECHNICAL COMPETENCIES                                  │
-- └────────────────────────────────────────────────────────────────────────────┘

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

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 📦 BOX 5: PROJECTS & CASE STUDIES                                          │
-- └────────────────────────────────────────────────────────────────────────────┘

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

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 📦 BOX 6: DOCUMENT MANAGEMENT & CLOUD FILE REPOSITORY                      │
-- └────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.portfolio_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'personal', 'school', 'intermediate', 'college', 'resume', 
        'certifications', 'projects', 'achievements', 'other'
    )),
    description TEXT,
    related_entity_type TEXT,
    related_entity_id TEXT,
    visibility TEXT NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'UNLISTED')),
    publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('draft', 'pending', 'approved', 'published', 'hidden', 'archived')),
    show_on_website BOOLEAN DEFAULT true,
    allow_preview BOOLEAN DEFAULT true,
    allow_download BOOLEAN DEFAULT true,
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

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 📦 BOX 7: CERTIFICATIONS & CREDENTIALS                                     │
-- └────────────────────────────────────────────────────────────────────────────┘

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

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 📦 BOX 8: ACHIEVEMENTS, AWARDS & RECOGNITIONS                              │
-- └────────────────────────────────────────────────────────────────────────────┘

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

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 📦 BOX 9: WORK EXPERIENCE & INTERNSHIPS                                    │
-- └────────────────────────────────────────────────────────────────────────────┘

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

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 📦 BOX 10: SOCIAL LINKS & CONTACT INBOX                                    │
-- └────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    username TEXT,
    icon_name TEXT,
    display_order INTEGER DEFAULT 0,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    ip_address TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 📦 BOX 11: WEBSITE SETTINGS & SEO METADATA                                 │
-- └────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT DEFAULT 'Kumar Portfolio',
    seo_title TEXT DEFAULT 'Kumar | Full Stack Developer & 3D Experience',
    seo_description TEXT DEFAULT 'Personal developer portfolio featuring interactive 3D WebGL experiences and engineering projects.',
    primary_email TEXT DEFAULT 'nagaseshukumarbobbiti@gmail.com',
    show_education BOOLEAN DEFAULT true,
    show_projects BOOLEAN DEFAULT true,
    show_skills BOOLEAN DEFAULT true,
    show_documents BOOLEAN DEFAULT true,
    show_certifications BOOLEAN DEFAULT true,
    show_experience BOOLEAN DEFAULT true,
    show_achievements BOOLEAN DEFAULT true,
    show_contact BOOLEAN DEFAULT true,
    show_3d_effects BOOLEAN DEFAULT true,
    theme_accent_color TEXT DEFAULT '#6366f1',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 🛡️ ROW LEVEL SECURITY (RLS) POLICIES
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
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Public Read Policies for Published Records
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read published profile') THEN
        CREATE POLICY "Public read published profile" ON public.profiles FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read published education') THEN
        CREATE POLICY "Public read published education" ON public.education FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read published skills') THEN
        CREATE POLICY "Public read published skills" ON public.skills FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read published projects') THEN
        CREATE POLICY "Public read published projects" ON public.projects FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read approved documents') THEN
        CREATE POLICY "Public read approved documents" ON public.portfolio_documents FOR SELECT 
        USING (visibility = 'PUBLIC' AND publication_status = 'published' AND show_on_website = true AND is_active = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read published certifications') THEN
        CREATE POLICY "Public read published certifications" ON public.certifications FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read published achievements') THEN
        CREATE POLICY "Public read published achievements" ON public.achievements FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read published experiences') THEN
        CREATE POLICY "Public read published experiences" ON public.experiences FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read enabled social links') THEN
        CREATE POLICY "Public read enabled social links" ON public.social_links FOR SELECT USING (is_enabled = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read website settings') THEN
        CREATE POLICY "Public read website settings" ON public.website_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can submit contact messages') THEN
        CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- ==============================================================================
-- 🚀 ZERO FAKE DATA INITIALIZATION
-- ==============================================================================

INSERT INTO public.profiles (full_name, display_name, email, is_published)
SELECT 'Nagaseshu Kumar Bobbiti', 'Kumar', 'nagaseshukumarbobbiti@gmail.com', true
WHERE NOT EXISTS (SELECT 1 FROM public.profiles);

INSERT INTO public.admin_users (email, role, is_active)
VALUES ('nagaseshukumarbobbiti@gmail.com', 'SUPER_ADMIN', true)
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.website_settings (site_name, seo_title, primary_email)
SELECT 'Kumar Portfolio', 'Kumar | Portfolio', 'nagaseshukumarbobbiti@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM public.website_settings);
