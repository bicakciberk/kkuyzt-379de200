# Hero çizgi izi

## Yapılacaklar
- Mevcut yuvarlak gradient fare izini ve ilgili stilleri tamamen kaldır.
- Hero içine tek bir hafif canvas katmanı ekle; son yaklaşık 0,9 saniyedeki imleç noktalarını zaman damgasıyla tut.
- Noktaları yumuşatılmış, yuvarlak uçlu ince mavi bir eğri olarak çiz; yeni uç parlak, eski uç kademeli şeffaf olsun.
- Hızlı harekette daha uzun ve görünür, yavaşlama ve durmada kendiliğinden kısalan bir kuyruk uygula.
- Efekti yalnız ince işaretçili masaüstü cihazlarda ve hareket azaltma tercihi kapalıyken çalıştır; hero dışına taşmasını engelle.
- Masaüstü hareket/solma davranışını ve mobilde tamamen kapalı olduğunu tarayıcıda doğrula.

## Teknik ayrıntı
- Çizim yalnız hareket varken ve kuyruk solarken `requestAnimationFrame` ile çalışacak; sürekli boş animasyon döngüsü olmayacak.
- Canvas çözünürlüğü cihaz piksel oranına göre sınırlanacak; ağır kütüphane veya parçacık sistemi kullanılmayacak.
- Mevcut kart eğim efekti değişmeden kalacak.
