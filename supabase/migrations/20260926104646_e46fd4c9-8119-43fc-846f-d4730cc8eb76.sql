CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE CHECK (char_length(btrim(name)) BETWEEN 2 AND 60 AND name <> 'Topluluk'),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.departments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO authenticated;
GRANT ALL ON public.departments TO service_role;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Departmanlar herkese açık" ON public.departments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Girişli departman ekler" ON public.departments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Girişli departman düzenler" ON public.departments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Girişli departman siler" ON public.departments FOR DELETE TO authenticated USING (true);

INSERT INTO public.departments (name, sort_order) VALUES ('Organizasyon',1),('Dış İlişkiler',2),('Sosyal Medya',3),('Tanıtım',4);

ALTER TABLE public.team_members DROP CONSTRAINT IF EXISTS team_department_check;

CREATE OR REPLACE FUNCTION public.check_team_department() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.department <> 'Topluluk' AND NOT EXISTS (SELECT 1 FROM public.departments WHERE name = NEW.department) THEN
    RAISE EXCEPTION 'Geçersiz departman';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER team_department_valid BEFORE INSERT OR UPDATE OF department ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.check_team_department();

CREATE OR REPLACE FUNCTION public.departments_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF EXISTS (SELECT 1 FROM public.team_members WHERE department = OLD.name) THEN
      RAISE EXCEPTION 'Departmanda üye var';
    END IF;
    RETURN OLD;
  END IF;
  NEW.name := btrim(NEW.name);
  NEW.updated_at := now();
  RETURN NEW;
END $$;
CREATE TRIGGER departments_guard BEFORE UPDATE OR DELETE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.departments_guard();

CREATE OR REPLACE FUNCTION public.departments_after() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE label text;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.name IS DISTINCT FROM OLD.name THEN
    UPDATE public.team_members SET department = NEW.name WHERE department = OLD.name;
  END IF;
  IF auth.uid() IS NULL THEN RETURN coalesce(NEW, OLD); END IF;
  IF TG_OP = 'INSERT' THEN label := '“' || NEW.name || '” departmanını oluşturdu';
  ELSIF TG_OP = 'DELETE' THEN label := '“' || OLD.name || '” departmanını sildi';
  ELSIF NEW.name IS DISTINCT FROM OLD.name THEN label := '“' || OLD.name || '” departmanının adını “' || NEW.name || '” yaptı';
  ELSIF NEW.sort_order IS DISTINCT FROM OLD.sort_order THEN label := 'departman sıralamasını değiştirdi: “' || NEW.name || '”';
  ELSE RETURN NEW; END IF;
  INSERT INTO public.activity_log (actor_id, actor_email, section, action, summary)
  VALUES (auth.uid(), coalesce(auth.jwt()->>'email',''), 'Departmanlar', CASE TG_OP WHEN 'INSERT' THEN 'Ekleme' WHEN 'DELETE' THEN 'Silme' ELSE 'Düzenleme' END, label);
  RETURN coalesce(NEW, OLD);
END $$;
CREATE TRIGGER departments_after AFTER INSERT OR UPDATE OR DELETE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.departments_after();

REVOKE EXECUTE ON FUNCTION public.check_team_department(), public.departments_guard(), public.departments_after() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_team_department(), public.departments_guard(), public.departments_after() TO service_role;