CREATE TABLE public.timeline_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order integer NOT NULL DEFAULT 0,
  period text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT timeline_period_length CHECK (char_length(trim(period)) BETWEEN 1 AND 80),
  CONSTRAINT timeline_title_length CHECK (char_length(trim(title)) BETWEEN 1 AND 160),
  CONSTRAINT timeline_description_length CHECK (char_length(trim(description)) BETWEEN 1 AND 800)
);
GRANT SELECT ON public.timeline_milestones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.timeline_milestones TO authenticated;
GRANT ALL ON public.timeline_milestones TO service_role;
ALTER TABLE public.timeline_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kilometre taşları herkese açık" ON public.timeline_milestones FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Girişli kilometre taşı ekler" ON public.timeline_milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Girişli kilometre taşı düzenler" ON public.timeline_milestones FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Girişli kilometre taşı siler" ON public.timeline_milestones FOR DELETE TO authenticated USING (true);
CREATE INDEX timeline_milestones_order_idx ON public.timeline_milestones (sort_order, created_at, id);
CREATE FUNCTION public.touch_timeline_milestones() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
CREATE TRIGGER timeline_milestones_updated BEFORE UPDATE ON public.timeline_milestones FOR EACH ROW EXECUTE FUNCTION public.touch_timeline_milestones();
CREATE FUNCTION public.log_timeline_milestones() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE actor uuid; actor_mail text; label text;
BEGIN
  actor := auth.uid();
  IF actor IS NULL THEN RETURN coalesce(NEW, OLD); END IF;
  IF TG_OP = 'UPDATE' AND NEW.sort_order IS NOT DISTINCT FROM OLD.sort_order AND NEW.period IS NOT DISTINCT FROM OLD.period AND NEW.title IS NOT DISTINCT FROM OLD.title AND NEW.description IS NOT DISTINCT FROM OLD.description THEN RETURN NEW; END IF;
  actor_mail := coalesce(auth.jwt()->>'email', '');
  label := CASE WHEN TG_OP = 'INSERT' THEN 'Zaman Tüneli’ne yeni kilometre taşı ekledi: ' WHEN TG_OP = 'DELETE' THEN 'Zaman Tüneli’nden kilometre taşını sildi: ' WHEN NEW.sort_order IS DISTINCT FROM OLD.sort_order AND NEW.period IS NOT DISTINCT FROM OLD.period AND NEW.title IS NOT DISTINCT FROM OLD.title AND NEW.description IS NOT DISTINCT FROM OLD.description THEN 'Zaman Tüneli’nde sıralamayı değiştirdi: ' ELSE 'Zaman Tüneli’nde kilometre taşını düzenledi: ' END;
  INSERT INTO public.activity_log (actor_id, actor_email, section, action, summary)
  VALUES (actor, actor_mail, 'Zaman Tüneli', TG_OP, label || '“' || left(coalesce(NEW.title, OLD.title), 85) || '”');
  RETURN coalesce(NEW, OLD);
END $$;
REVOKE ALL ON FUNCTION public.log_timeline_milestones() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER timeline_milestones_activity AFTER INSERT OR UPDATE OR DELETE ON public.timeline_milestones FOR EACH ROW EXECUTE FUNCTION public.log_timeline_milestones();
INSERT INTO public.timeline_milestones (sort_order, period, title, description) VALUES
(1, '2024 · Bahar', 'İlk fikir', 'Kantinde bir soru: “Yapay zekâyı neden birlikte öğrenmiyoruz?”'),
(2, '2024 · Güz', 'İlk toplantı', 'Bir avuç öğrenci, bir sınıf ve beyaz tahtada ilk yol haritası.'),
(3, '2025 · Bahar', 'İlk etkinlik', 'Salonu dolduran ilk seminerle topluluk kampüste görünür oldu.'),
(4, '2025 · Güz', 'İlk 100 üye', 'Ekipler kuruldu, atölyeler düzenli bir takvime kavuştu.'),
(5, 'Bugün', 'Birlikte büyüyoruz', 'Dört departman, düzenli etkinlikler ve her dönem yeni yüzler.');