CREATE TABLE public.hero_poster (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  kicker text NOT NULL DEFAULT 'YZT sunar',
  season text NOT NULL DEFAULT '26—27',
  title text NOT NULL DEFAULT 'Topluluk Tanışması',
  subtitle text NOT NULL DEFAULT 'Yeni dönem / İlk buluşma',
  date_text text NOT NULL DEFAULT '15 Eylül',
  time_text text NOT NULL DEFAULT '19.00',
  door_text text NOT NULL DEFAULT 'Kapılar 18.30',
  place_text text NOT NULL DEFAULT 'Swallowe',
  footer_left text NOT NULL DEFAULT 'Kırıkkale Üniversitesi',
  footer_right text NOT NULL DEFAULT '01 / Açılış',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_poster TO anon, authenticated;
GRANT UPDATE ON public.hero_poster TO authenticated;
GRANT ALL ON public.hero_poster TO service_role;
ALTER TABLE public.hero_poster ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Poster herkese açık" ON public.hero_poster FOR SELECT USING (true);
CREATE POLICY "Girişli günceller" ON public.hero_poster FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
INSERT INTO public.hero_poster (id) VALUES (1);

CREATE OR REPLACE FUNCTION public.log_hero_poster()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE changes text := ''; k text; r jsonb := to_jsonb(NEW); o jsonb := to_jsonb(OLD);
  names jsonb := '{"kicker":"üst etiket","season":"sezon","title":"başlık","subtitle":"alt başlık","date_text":"tarih","time_text":"saat","door_text":"kapı saati","place_text":"yer","footer_left":"alt sol metin","footer_right":"alt sağ metin"}';
BEGIN
  NEW.updated_at := now();
  IF auth.uid() IS NULL THEN RETURN NEW; END IF;
  FOR k IN SELECT key FROM jsonb_each(r) WHERE key NOT IN ('id','updated_at') AND r->key IS DISTINCT FROM o->key LOOP
    changes := changes || CASE WHEN changes = '' THEN '' ELSE ', ' END || COALESCE(names->>k, k);
  END LOOP;
  IF changes = '' THEN RETURN NEW; END IF;
  INSERT INTO public.activity_log(actor_id, actor_email, section, action, summary)
  VALUES (auth.uid(), COALESCE(auth.jwt()->>'email',''), 'Hero Posteri', 'Düzenleme', 'hero posterini güncelledi (' || changes || ')');
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.log_hero_poster() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER log_hero BEFORE UPDATE ON public.hero_poster FOR EACH ROW EXECUTE FUNCTION public.log_hero_poster();