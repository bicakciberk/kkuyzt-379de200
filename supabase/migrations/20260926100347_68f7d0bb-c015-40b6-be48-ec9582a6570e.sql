CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  description text NOT NULL CHECK (char_length(description) BETWEEN 1 AND 240),
  category text NOT NULL DEFAULT 'Kahve',
  icon text NOT NULL DEFAULT 'coffee',
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "İş ortakları herkese açık" ON public.partners FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Girişli ortak ekler" ON public.partners FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Girişli ortak düzenler" ON public.partners FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Girişli ortak siler" ON public.partners FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.touch_partners() RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $$ BEGIN NEW.updated_at := now(); RETURN NEW; END $$;
CREATE TRIGGER partners_updated BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.touch_partners();

CREATE OR REPLACE FUNCTION public.log_partners() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE label text; changes text := ''; k text; r jsonb; o jsonb;
  names jsonb := '{"name":"ad","description":"açıklama","category":"kategori","icon":"ikon","image_url":"görsel","sort_order":"sıra"}';
BEGIN
  IF auth.uid() IS NULL THEN RETURN coalesce(NEW, OLD); END IF;
  IF TG_OP = 'INSERT' THEN label := 'İş Ortakları’na yeni kayıt ekledi: “' || NEW.name || '”';
  ELSIF TG_OP = 'DELETE' THEN label := 'İş Ortakları’ndan kaydı sildi: “' || OLD.name || '”';
  ELSE
    r := to_jsonb(NEW); o := to_jsonb(OLD);
    FOR k IN SELECT key FROM jsonb_each(r) WHERE key NOT IN ('id','created_at','updated_at') AND r->key IS DISTINCT FROM o->key LOOP
      changes := changes || CASE WHEN changes = '' THEN '' ELSE ', ' END || coalesce(names->>k, k);
    END LOOP;
    IF changes = '' THEN RETURN NEW; END IF;
    IF changes = 'sıra' THEN label := 'İş Ortakları’nda sıralamayı değiştirdi: “' || NEW.name || '”';
    ELSE label := 'İş Ortakları’nda “' || NEW.name || '” kaydını düzenledi (' || changes || ')'; END IF;
  END IF;
  INSERT INTO public.activity_log (actor_id, actor_email, section, action, summary)
  VALUES (auth.uid(), coalesce(auth.jwt()->>'email',''), 'İş Ortakları', CASE TG_OP WHEN 'INSERT' THEN 'Ekleme' WHEN 'DELETE' THEN 'Silme' ELSE 'Düzenleme' END, label);
  RETURN coalesce(NEW, OLD);
END $$;
CREATE TRIGGER partners_activity AFTER INSERT OR UPDATE OR DELETE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.log_partners();

INSERT INTO public.partners (name, description, category, icon, sort_order) VALUES
('Kampüs Kahve','Tüm içeceklerde %15 üye indirimi','Kahve','coffee',10),
('Kitap Durağı','Teknik kitaplarda %10 indirim','Kitap','book',20),
('Piksel Baskı','Topluluk üyelerine özel baskı fiyatı','Baskı','printer',30),
('Rota Kafe','Çalışma alanı ve menüde %12 indirim','Çalışma','armchair',40),
('Kod Atölyesi','Seçili eğitimlerde %20 indirim','Kod','code',50),
('Kare Kırtasiye','Kırtasiye ürünlerinde %10 indirim','Kırtasiye','pencil',60);