CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  student_no text NOT NULL DEFAULT '' CHECK (char_length(student_no) <= 40),
  department text NOT NULL CHECK (char_length(department) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 200),
  phone text NOT NULL DEFAULT '' CHECK (char_length(phone) <= 40),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 3000),
  status text NOT NULL DEFAULT 'Bekliyor' CHECK (status IN ('Bekliyor','İncelendi','Yanıtlandı')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes başvuru gönderir" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (status = 'Bekliyor');
CREATE POLICY "Girişli okur" ON public.applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Girişli günceller" ON public.applications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Girişli siler" ON public.applications FOR DELETE TO authenticated USING (true);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 200),
  subject text NOT NULL CHECK (char_length(subject) BETWEEN 1 AND 200),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  status text NOT NULL DEFAULT 'Bekliyor' CHECK (status IN ('Bekliyor','İncelendi','Yanıtlandı')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes mesaj gönderir" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (status = 'Bekliyor');
CREATE POLICY "Girişli okur" ON public.contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Girişli günceller" ON public.contact_messages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Girişli siler" ON public.contact_messages FOR DELETE TO authenticated USING (true);

CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text NOT NULL DEFAULT '',
  section text NOT NULL,
  action text NOT NULL,
  summary text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Girişli kayıtları görür" ON public.activity_log FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.log_panel_activity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  sec text; lbl text; act text; changes text := ''; r jsonb; o jsonb; k text;
  names jsonb := '{"title":"başlık","category":"kategori","event_date":"tarih","event_time":"saat","location":"konum","description":"açıklama","image_url":"görsel","name":"ad","department":"departman","role":"rol","program":"bölüm","photo_url":"fotoğraf","sort_order":"sıra","caption":"başlık","post_date":"tarih","link_url":"bağlantı","status":"durum"}';
BEGIN
  IF auth.uid() IS NULL THEN RETURN COALESCE(NEW, OLD); END IF;
  r := to_jsonb(COALESCE(NEW, OLD));
  sec := CASE TG_TABLE_NAME WHEN 'events' THEN 'Etkinlikler' WHEN 'team_members' THEN 'Takım' WHEN 'social_posts' THEN 'Sosyal Medya' WHEN 'applications' THEN 'Başvurular' ELSE 'Mesajlar' END;
  lbl := CASE TG_TABLE_NAME WHEN 'events' THEN r->>'title' WHEN 'team_members' THEN r->>'name' WHEN 'social_posts' THEN NULLIF(r->>'caption','') WHEN 'applications' THEN r->>'name' || ' başvurusu' ELSE r->>'subject' || ' mesajı' END;
  lbl := '“' || COALESCE(lbl, 'gönderi') || '”';
  IF TG_OP = 'INSERT' THEN act := 'Ekleme'; changes := lbl || ' ekledi';
  ELSIF TG_OP = 'DELETE' THEN act := 'Silme'; changes := lbl || ' sildi';
  ELSE
    o := to_jsonb(OLD);
    IF TG_TABLE_NAME = 'events' AND (r - 'is_next') = (o - 'is_next') THEN
      IF NEW.is_next THEN act := 'Düzenleme'; changes := lbl || ' sıradaki etkinlik yaptı'; ELSE RETURN NEW; END IF;
    ELSIF TG_TABLE_NAME = 'social_posts' AND (r - 'sort_order') = (o - 'sort_order') THEN RETURN NEW;
    ELSIF TG_TABLE_NAME IN ('applications','contact_messages') AND (r - 'status') = (o - 'status') THEN RETURN NEW;
    ELSIF TG_TABLE_NAME IN ('applications','contact_messages') THEN
      act := 'Düzenleme'; changes := lbl || ' durumunu “' || (r->>'status') || '” yaptı';
    ELSE
      act := 'Düzenleme';
      FOR k IN SELECT key FROM jsonb_each(r) WHERE key NOT IN ('id','created_at','is_next') AND r->key IS DISTINCT FROM o->key LOOP
        changes := changes || CASE WHEN changes = '' THEN '' ELSE ', ' END || COALESCE(names->>k, k);
      END LOOP;
      IF changes = '' THEN RETURN NEW; END IF;
      changes := lbl || ' düzenledi (' || changes || ')';
    END IF;
  END IF;
  INSERT INTO public.activity_log(actor_id, actor_email, section, action, summary)
  VALUES (auth.uid(), COALESCE(auth.jwt()->>'email',''), sec, act, changes);
  RETURN COALESCE(NEW, OLD);
END $$;
REVOKE EXECUTE ON FUNCTION public.log_panel_activity() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER log_events AFTER INSERT OR UPDATE OR DELETE ON public.events FOR EACH ROW EXECUTE FUNCTION public.log_panel_activity();
CREATE TRIGGER log_team AFTER INSERT OR UPDATE OR DELETE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.log_panel_activity();
CREATE TRIGGER log_posts AFTER INSERT OR UPDATE OR DELETE ON public.social_posts FOR EACH ROW EXECUTE FUNCTION public.log_panel_activity();
CREATE TRIGGER log_applications AFTER INSERT OR UPDATE OR DELETE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.log_panel_activity();
CREATE TRIGGER log_messages AFTER INSERT OR UPDATE OR DELETE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.log_panel_activity();