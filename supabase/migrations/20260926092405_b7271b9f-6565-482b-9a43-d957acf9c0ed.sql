CREATE TABLE public.site_content (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '' CHECK (char_length(value) <= 4000),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT UPDATE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Metinler herkese açık" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Girişli günceller" ON public.site_content FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.site_content(key, value) VALUES
('home_hero_title','Geleceği birlikte şekillendirelim.'),
('home_hero_text','Merak eden, üreten ve öğrendiğini paylaşan öğrenciler için açık bir topluluk.'),
('home_features_title','Bir kulüpten daha fazlası.'),
('home_feat_about','Neden varız, neye inanıyoruz?'),
('home_feat_team','Endüstri Mühendisliği''nden üretken bir ekip.'),
('home_feat_events','Seminer, atölye, gezi ve daha fazlası.'),
('home_feat_partners','Topluluğumuza değer katan destekçiler.'),
('about_title','Teknolojiyi uzaktan izlemiyoruz.'),
('about_intro','YZT, yapay zekâyı yalnızca konuşulan bir başlık olmaktan çıkarıp deneyimlenen bir alana dönüştüren öğrenci topluluğu.'),
('about_story','Bir soruyla başladı: “Neden birlikte öğrenmiyoruz?” Farklı bölümlerden öğrencileri aynı masada buluşturmak için yola çıktık, çünkü yapay zekânın geleceği tek bir disipline sığmıyor.

Bugün seminerler, teknik geziler ve uygulamalı atölyeler düzenliyor; öğrencilerin fikirlerini güvenle sınayabilecekleri bir alan kuruyoruz.'),
('about_mission','Merakı bilgiye, bilgiyi üretime, üretimi birlikte büyüyen bir kültüre dönüştürmek.'),
('about_work_seminer','Akademi ve sektörden konuklarla yeni fikirleri anlaşılır, samimi buluşmalara taşıyoruz.'),
('about_work_atolye','Sadece dinlemiyor; kodluyor, deniyor, bozuyor ve birlikte yeniden kuruyoruz.'),
('about_work_gezi','Teknolojinin üretildiği ekipleri yerinde tanıyor, çalışma kültürlerini gözlemliyoruz.'),
('about_work_paylasim','Öğrendiğimizi açık kaynaklarla, notlarla ve akran desteğiyle çoğaltıyoruz.'),
('about_value_merak','Bilmediğimizi saklamıyor, doğru soruyu birlikte arıyoruz.'),
('about_value_paylasim','Bilgiyi ayrıcalık değil, çoğaldıkça değerlenen bir kaynak görüyoruz.'),
('about_value_sorumluluk','Teknolojiyi etkileriyle birlikte düşünüyor, etik tartışmalara alan açıyoruz.'),
('footer_tagline','Merak eden, üreten ve paylaşan öğrenciler.'),
('contact_email','Kkuyapayzekatoplulugu71@gmail.com'),
('instagram_handle','kku_yzt'),
('address','Kırıkkale Üniversitesi, Yahşihan / Kırıkkale'),
('slogan','Geleceği birlikte şekillendirelim.');

CREATE OR REPLACE FUNCTION public.log_site_content()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE labels jsonb := '{"home_hero_title":"Ana Sayfa hero başlığını","home_hero_text":"Ana Sayfa hero açıklamasını","home_features_title":"Ana Sayfa “Bir kulüpten daha fazlası” başlığını","home_feat_about":"Ana Sayfa Hakkımızda kart metnini","home_feat_team":"Ana Sayfa Takımımız kart metnini","home_feat_events":"Ana Sayfa Etkinlikler kart metnini","home_feat_partners":"Ana Sayfa İş Ortakları kart metnini","about_title":"Hakkımızda başlığını","about_intro":"Hakkımızda giriş açıklamasını","about_story":"Hakkımızda Hikâyemiz metnini","about_mission":"Hakkımızda Misyonumuz metnini","about_work_seminer":"Hakkımızda Seminerler metnini","about_work_atolye":"Hakkımızda Atölyeler metnini","about_work_gezi":"Hakkımızda Teknik geziler metnini","about_work_paylasim":"Hakkımızda Paylaşım metnini","about_value_merak":"Hakkımızda Merak değerini","about_value_paylasim":"Hakkımızda Paylaşım değerini","about_value_sorumluluk":"Hakkımızda Sorumluluk değerini","footer_tagline":"Footer açıklamasını","contact_email":"iletişim e-posta adresini","instagram_handle":"Instagram hesabını","address":"adres bilgisini","slogan":"site sloganını"}';
BEGIN
  NEW.updated_at := now();
  IF auth.uid() IS NULL OR NEW.value IS NOT DISTINCT FROM OLD.value THEN RETURN NEW; END IF;
  INSERT INTO public.activity_log(actor_id, actor_email, section, action, summary)
  VALUES (auth.uid(), COALESCE(auth.jwt()->>'email',''),
    CASE WHEN NEW.key IN ('contact_email','instagram_handle','address','slogan') THEN 'Site Ayarları' ELSE 'Sayfa Metinleri' END,
    'Düzenleme', COALESCE(labels->>NEW.key, NEW.key) || ' güncelledi');
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.log_site_content() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER log_site_content BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.log_site_content();