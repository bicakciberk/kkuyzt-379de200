# Bize Katıl Konfeti Animasyonu

## Yapılacaklar
- Header ve ana sayfadaki “Bize Katıl” bağlantılarında ortak, yeniden kullanılabilir bir konfeti katmanı kullanmak.
- Tıklama noktasından yukarı yayılan az sayıda mavi ve krem parçacığı 1–1,5 saniyede söndürmek.
- Sayfa geçişini geciktirmemek; katmanı ekranın üstünde, tıklamaları engellemeyecek şekilde göstermek.
- Hareket azaltma tercihi açıkken animasyonu devre dışı bırakmak.
- Masaüstü ve mobil görünümde tıklama, yönlendirme ve performansı doğrulamak.

## Teknik ayrıntılar
- Parçacıklar tek bir hafif React bileşeniyle `document.body` üzerine portal olarak çizilecek.
- Renkler yalnız mevcut semantik mavi/krem tasarım değişkenlerinden gelecek.
- CSS dönüşümleri ve opaklık kullanılacak; animasyon tamamlanınca parçacıklar DOM’dan kaldırılacak.
