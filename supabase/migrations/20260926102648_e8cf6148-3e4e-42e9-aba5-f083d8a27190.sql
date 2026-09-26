CREATE TABLE public.yzt_card_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  student_no text NOT NULL CHECK (char_length(student_no) BETWEEN 2 AND 30),
  department text NOT NULL CHECK (char_length(department) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 255),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 30),
  status text NOT NULL DEFAULT 'Bekliyor' CHECK (status IN ('Bekliyor', 'Onaylandı', 'Teslim Edildi')),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.yzt_card_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.yzt_card_applications TO authenticated;
GRANT ALL ON public.yzt_card_applications TO service_role;

ALTER TABLE public.yzt_card_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Herkes YZT Kart başvurusu gönderir"
ON public.yzt_card_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'Bekliyor');

CREATE POLICY "Girişli YZT Kart başvurularını okur"
ON public.yzt_card_applications
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Girişli YZT Kart başvurularını günceller"
ON public.yzt_card_applications
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (status IN ('Bekliyor', 'Onaylandı', 'Teslim Edildi'));

CREATE POLICY "Girişli YZT Kart başvurularını siler"
ON public.yzt_card_applications
FOR DELETE
TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.log_yzt_card_applications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid;
  actor_mail text;
  applicant text;
  detail text;
  action_name text;
BEGIN
  actor := auth.uid();
  actor_mail := coalesce(auth.jwt()->>'email', '');
  applicant := coalesce(NEW.name, OLD.name, 'Başvuru');

  IF TG_OP = 'INSERT' THEN
    action_name := 'Ekleme';
    detail := '“' || applicant || '” YZT Kart başvurusu alındı';
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status IS NOT DISTINCT FROM OLD.status THEN RETURN NEW; END IF;
    action_name := 'Düzenleme';
    detail := '“' || applicant || '” YZT Kart başvurusunu “' || NEW.status || '” yaptı';
  ELSE
    action_name := 'Silme';
    detail := '“' || applicant || '” YZT Kart başvurusunu sildi';
  END IF;

  INSERT INTO public.activity_log (actor_id, actor_email, section, action, summary)
  VALUES (actor, actor_mail, 'YZT Kart Başvuruları', action_name, detail);
  RETURN coalesce(NEW, OLD);
END;
$$;

CREATE TRIGGER log_yzt_card_applications
AFTER INSERT OR UPDATE OR DELETE ON public.yzt_card_applications
FOR EACH ROW EXECUTE FUNCTION public.log_yzt_card_applications();