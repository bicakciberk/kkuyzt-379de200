# Sayaç ve Sayfa Geçiş Animasyonları

## Yapılacaklar
- Geri sayımdaki yalnızca değişen rakamı yeniden canlandırarak 150–300 ms süren hafif bir dijital flip efekti vermek.
- Site içi sayfa değişimlerinde tarayıcının akıcı geçiş desteğini kullanarak 200–300 ms fade-out/fade-in uygulamak.
- Geçiş yüzeyini mevcut krem arka planla eşleştirerek beyaz flaşı önlemek.
- Hareket azaltma tercihi açıkken iki animasyonu da devre dışı bırakmak.
- Masaüstü ve mobilde sayaç hareketini, sayfa geçişini ve performansı doğrulamak.

## Teknik ayrıntılar
- Sayaç rakamları, değer değiştiğinde kısa süreli CSS `rotateX` ve opaklık animasyonu çalıştıracak.
- TanStack Router’ın yerleşik View Transitions desteği etkinleştirilecek; desteklemeyen tarayıcılarda normal gezinme devam edecek.
- Animasyonlar yalnız `transform` ve `opacity` kullanacak.
