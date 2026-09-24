# Premium Fare Etkileşimleri

## Yapılacaklar
- Yalnız hassas işaretçi kullanan masaüstü cihazlarda görünen, sitenin çizgi motifinden türetilmiş özel cursor katmanı eklemek.
- Link, buton ve etkileşimli kartlarda cursor’ı büyütüp bağlama göre “Aç”, “Gör” veya “Katıl” mikro metnini göstermek; klavye odağını değiştirmemek.
- Ana sayfa girişine, fare yakınlığında çok hafif büyüyüp belirginleşen düşük opaklıklı nokta ağı eklemek.
- Ana sayfa etkinlik kartları, Etkinlikler sayfası kartları ve Takımımız üye kartlarına birkaç dereceyle sınırlı 3D tilt eklemek.
- Fare ayrıldığında tüm yüzeyleri yumuşakça sıfırlamak; mobil, dokunmatik ve azaltılmış hareket tercihinde efektleri tamamen kapatmak.
- Masaüstü ve mobil görünümde cursor, nokta ağı, kart hareketi, yönlendirmeler ve erişilebilirliği doğrulamak.

## Teknik ayrıntılar
- Tek bir hafif React etkileşim katmanı; `requestAnimationFrame`, CSS transform ve CSS değişkenleri kullanılacak.
- Harici animasyon kütüphanesi eklenmeyecek; dekoratif katmanlar tıklamaları engellemeyecek.
- Cursor etiketleri mevcut öğelerin türünden ve gerekirse `data-cursor` değerinden üretilecek.
