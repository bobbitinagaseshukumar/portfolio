-- ==============================================================================
-- 📦 SECTION BOX 11: WEBSITE SETTINGS & SEO CONFIGURATION
-- ==============================================================================
-- Purpose: Site title, metadata, feature toggles, and notification preferences.
-- ==============================================================================

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

ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read website settings" 
ON public.website_settings FOR SELECT 
USING (true);

INSERT INTO public.website_settings (site_name, seo_title, primary_email)
SELECT 'Kumar Portfolio', 'Kumar | Portfolio', 'nagaseshukumarbobbiti@gmail.com'
WHERE NOT EXISTS (SELECT 1 FROM public.website_settings);
