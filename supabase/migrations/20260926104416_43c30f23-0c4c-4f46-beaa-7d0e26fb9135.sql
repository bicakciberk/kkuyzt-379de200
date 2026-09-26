ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS linkedin_url text;
ALTER TABLE public.team_members DROP CONSTRAINT IF EXISTS team_role_check;
UPDATE public.team_members SET role = 'Yönetim Kurulu' WHERE role = 'Üye';
ALTER TABLE public.team_members ADD CONSTRAINT team_role_check CHECK (role IN ('Topluluk Başkanı','Departman Başkanı','Yönetim Kurulu'));
ALTER TABLE public.team_members ADD CONSTRAINT team_linkedin_check CHECK (linkedin_url IS NULL OR (linkedin_url ~ '^https://' AND char_length(linkedin_url) <= 300));
ALTER TABLE public.team_members ALTER COLUMN role SET DEFAULT 'Yönetim Kurulu';