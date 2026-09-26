CREATE TABLE public.daily_facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT daily_facts_content_length CHECK (char_length(trim(content)) BETWEEN 10 AND 400)
);
GRANT SELECT ON public.daily_facts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_facts TO authenticated;
GRANT ALL ON public.daily_facts TO service_role;
ALTER TABLE public.daily_facts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bilgiler herkese açık" ON public.daily_facts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Girişli bilgi ekler" ON public.daily_facts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Girişli bilgi düzenler" ON public.daily_facts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Girişli bilgi siler" ON public.daily_facts FOR DELETE TO authenticated USING (true);
CREATE INDEX daily_facts_order_idx ON public.daily_facts (sort_order, created_at, id);
CREATE FUNCTION public.touch_daily_facts() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER daily_facts_updated BEFORE UPDATE ON public.daily_facts FOR EACH ROW EXECUTE FUNCTION public.touch_daily_facts();
CREATE FUNCTION public.log_daily_facts() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE actor uuid; actor_mail text; label text;
BEGIN
  actor := auth.uid();
  IF actor IS NULL THEN RETURN coalesce(NEW, OLD); END IF;
  actor_mail := coalesce(auth.jwt()->>'email', '');
  label := CASE TG_OP WHEN 'INSERT' THEN 'bilgi ekledi' WHEN 'UPDATE' THEN 'bilgiyi düzenledi' ELSE 'bilgiyi sildi' END;
  INSERT INTO public.activity_log (actor_id, actor_email, section, action, summary)
  VALUES (actor, actor_mail, 'Günün Bilgisi', TG_OP, label || ': “' || left(coalesce(NEW.content, OLD.content), 85) || '”');
  RETURN coalesce(NEW, OLD);
END $$;
CREATE TRIGGER daily_facts_activity AFTER INSERT OR UPDATE OR DELETE ON public.daily_facts FOR EACH ROW EXECUTE FUNCTION public.log_daily_facts();
INSERT INTO public.daily_facts (sort_order, content) VALUES
(1, 'Alan Turing, 1950’de makinelerin insan gibi konuşup konuşamayacağını sorgulayan taklit oyununu önerdi. Bugün buna Turing testi deniyor.'),
(2, '“Yapay zekâ” terimi, 1956’daki Dartmouth araştırma çalıştayı için hazırlanan öneride kullanıldı.'),
(3, 'Bir sinir ağının “nöronları” biyolojik nöronların birebir kopyası değil; sayısal işlemler yapan basitleştirilmiş birimlerdir.'),
(4, 'Makine öğrenmesinde model, örneklerden örüntü öğrenerek daha önce görmediği veriler hakkında tahmin üretir.'),
(5, 'Denetimli öğrenmede modele hem örnekler hem de doğru yanıtlar verilir; sınıflandırma bu yaklaşımın yaygın bir kullanım alanıdır.'),
(6, 'Denetimsiz öğrenmede doğru yanıt etiketleri yoktur. Algoritma verideki kümeleri veya başka yapıları bulmaya çalışır.'),
(7, 'Pekiştirmeli öğrenmede bir ajan, aldığı ödül sinyallerine göre hangi eylemleri seçeceğini öğrenir.'),
(8, 'Bir model eğitim verisini ezberleyip yeni örneklerde zorlanıyorsa buna aşırı uyum (overfitting) denir.'),
(9, 'Eğitim ve test verilerini ayırmak, bir modelin görmediği örneklerde ne kadar iyi çalıştığını anlamaya yardımcı olur.'),
(10, 'Bir dil modelindeki “token” her zaman bir kelime değildir; bir kelime parçası veya noktalama işareti de olabilir.'),
(11, 'Transformer mimarisi 2017’de tanıtıldı. Dikkat mekanizması, dizideki farklı parçalar arasındaki ilişkilere odaklanır.'),
(12, 'Büyük dil modelleri metindeki sonraki parçaları tahmin ederek eğitilebilir; bu, verdikleri her cevabın doğru olduğu anlamına gelmez.'),
(13, 'Modelin güvenle yanlış bilgi üretmesine “halüsinasyon” denir. Önemli iddiaları bağımsız kaynaklarla doğrulamak gerekir.'),
(14, 'Bir embedding, metin veya görsel gibi verileri sayı vektörleriyle temsil eder. Benzer içerikler bu uzayda birbirine yakın olabilir.'),
(15, 'Görüntü tanıma sistemleri piksel örüntülerinden nesneleri ayırt etmeyi öğrenebilir; gördüklerini insan gibi anlamaları gerekmez.'),
(16, 'Evrişimli sinir ağları, görsellerde yerel örüntüleri yakalamak için kullanılan bir ağ ailesidir.'),
(17, 'OCR, bir fotoğraf ya da taramadaki yazıları makinenin işleyebileceği metne dönüştürür.'),
(18, 'Konuşma tanıma sesi metne, konuşma sentezi ise metni sese dönüştürür. Bunlar farklı görevlerdir.'),
(19, 'Bir veri kümesindeki yanlılık modele de yansıyabilir; bu yüzden veri seçimi ve değerlendirme önemlidir.'),
(20, 'Doğruluk oranı tek başına yeterli olmayabilir. Nadir olaylarda kesinlik ve duyarlılık gibi ölçüler daha açıklayıcıdır.'),
(21, 'Karışıklık matrisi, sınıflandırmada doğru ve yanlış tahminlerin hangi sınıflarda toplandığını gösterir.'),
(22, 'Regresyon, sürekli bir sayı tahmin etme problemidir; sınıflandırma ise bir kategori seçmeye çalışır.'),
(23, 'Gradyan inişi, hatayı azaltmak için model parametrelerini adım adım güncelleyen bir optimizasyon yöntemidir.'),
(24, 'Öğrenme oranı çok büyük olursa model uygun bir sonuca yaklaşmakta zorlanabilir; çok küçük olursa eğitim yavaşlayabilir.'),
(25, 'Transfer öğrenmede önceden eğitilmiş bir modelin öğrendikleri yeni bir görev için uyarlanır.'),
(26, 'İnce ayar (fine-tuning), önceden eğitilmiş bir modelin belirli verilerle yeniden eğitilerek özelleştirilmesidir.'),
(27, 'RAG yaklaşımı, dil modelinin yanıt üretmeden önce dış kaynaklardan ilgili içerik bulmasına dayanır.'),
(28, 'Bir modelin bağlam penceresi, tek seferde işleyebildiği girdi ve çıktı miktarını sınırlar.'),
(29, 'Sıcaklık (temperature) ayarı, dil modeli çıktılarının seçimindeki rastlantısallığı etkiler; doğruluk garantisi vermez.'),
(30, 'Açık kaynaklı bir yazılım ile açık ağırlıklı bir model aynı şey değildir; kullanım ve değiştirme hakları lisansa bağlıdır.'),
(31, 'Alan adı sistemi (DNS), okunabilir alan adlarını ağdaki sayısal adreslerle eşleştirmeye yardımcı olur.'),
(32, 'HTTPS, tarayıcı ile site arasındaki iletişimi şifreler; sitenin sunduğu her bilginin doğru olduğunu garanti etmez.'),
(33, 'Bir API, farklı yazılımların belirli kurallar üzerinden birbiriyle iletişim kurmasını sağlar.'),
(34, 'Git, dosyalardaki değişikliklerin geçmişini takip eder; GitHub ise bu geçmişi barındırabilen platformlardan biridir.'),
(35, 'İkili sistem yalnızca 0 ve 1 rakamlarını kullanır. Bilgisayarlar metin ve görselleri de bit dizileri olarak saklar.'),
(36, 'Unicode, farklı dillerdeki karakterlere kod noktaları atar; Türkçedeki “ğ” ve “ı” da bu kapsamdadır.'),
(37, 'Veri sıkıştırma kayıpsız veya kayıplı olabilir. Kayıpsız sıkıştırmada orijinal veri eksiksiz geri elde edilir.'),
(38, 'Veri tabanı indeksi aramaları hızlandırabilir; ancak ek depolama kullanır ve yazma işlemlerine maliyet ekleyebilir.'),
(39, 'Açık bir veri kümesi bile kişisel bilgi içerebilir. Veri kullanırken gizlilik ve izin koşullarını kontrol etmek gerekir.'),
(40, 'Yapay zekâ modeli bir araçtır: Sonuçların kalitesi, veri kalitesine ve problemi nasıl tanımladığımıza bağlıdır.');