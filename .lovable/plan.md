# Mini Oyunlar — Kod Kırıcı

## Amaç
Siteye `/games` adresinde, YZT’nin mavi-krem editoryal diliyle uyumlu günlük kelime oyunu eklemek ve ana menüde Etkinlikler ile İş Ortakları arasına bağlamak.

## Yapılacaklar

### 1. Yeni sayfa ve navigasyon
- “Mini Oyunlar” bağlantısını masaüstü ve mobil menüye eklemek.
- Yeni sayfaya özgü Türkçe başlık, açıklama ve sosyal paylaşım metadatası tanımlamak.
- Sayfayı doğrudan oynanabilir “Kod Kırıcı” deneyimi olarak açmak; ayrı bir tanıtım ekranı eklememek.

### 2. Günlük kelime sistemi
- Türkçe yapay zekâ ve teknoloji temalı, yalnız 5–6 harfli kelimelerden sabit bir havuz oluşturmak.
- Yerel takvim tarihinden kararlı bir gün anahtarı üretip aynı tarihte herkese aynı kelimeyi seçmek.
- Günün kelimesinin uzunluğuna göre 5 veya 6 sütunlu, 6 satırlı tahmin alanı göstermek.
- Türkçe büyük/küçük harfleri doğru ele almak; fiziksel klavye ve ekrandaki Türkçe klavyeyi desteklemek.

### 3. Oyun kuralları ve geri bildirim
- Her tahmiste tekrar eden harfleri doğru Wordle mantığıyla değerlendirmek.
- Doğru yer için koyu mavi, yanlış yer için açık mavi, bulunmayan harf için nötr gri kullanmak.
- Klavye harflerinin durumunu en güçlü sonucu koruyacak şekilde güncellemek.
- Eksik/uygunsuz tahminlerde kısa Türkçe uyarı; altı hak sonunda kazanma veya günün kelimesini gösteren sonuç alanı sunmak.

### 4. Günlük kayıt, paylaşım ve istatistik
- Devam eden tahminleri ve tamamlanmış günlük sonucu `localStorage` içinde tarih anahtarıyla saklamak.
- Tamamlanan oyunu aynı gün yeniden oynatmayıp mevcut sonucu ve ızgarayı göstermek; ertesi gün otomatik yeni oyuna geçmek.
- Oynanan gün, kazanma yüzdesi, mevcut seri ve en uzun seri bilgilerini cihazda tutmak.
- Sonucu kelimeyi açığa çıkarmayan renkli kare ızgarası olarak panoya kopyalayan paylaşım düğmesi ve kopyalandı geri bildirimi eklemek.

### 5. Görsel düzen ve doğrulama
- Harf kutularını poster rozetlerine benzeyen net bordürlü, hafif gölgeli ve küçük dönüş varyasyonlu bir sistemle tasarlamak.
- Sanal klavyeyi mobil dokunmaya uygun sabit boyutlarla kurmak; metin ve kontrollerin taşmamasını sağlamak.
- Masaüstü ve mobilde oyun akışını, yenilemede kaldığı yerden devamı, günlük kilidi, paylaşımı ve istatistikleri test etmek.
- Son durumda sayfa derlemesini, menü bağlantılarını ve tarayıcı hatalarını kontrol etmek.

## Teknik ayrıntılar
- Mevcut TanStack dosya tabanlı sayfa yapısı ve ortak Button bileşeni kullanılacak.
- Tarayıcı kaydı yalnız istemci açıldıktan sonra okunacak; sunucu/istemci görünüm farkı oluşturulmayacak.
- Veri sunucusu veya üyelik gerekmeyecek; kayıtlar kullanılan tarayıcı ve cihazla sınırlı olacak.
