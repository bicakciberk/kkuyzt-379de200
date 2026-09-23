# Tutarlı numaralandırma ve İş Ortakları kart varyasyonları

## Yapılacaklar

- Tüm içerik sayfalarındaki bölüm işaretlerini görünür akış sırasına göre denetle; her sayfada `01` ile başlayan ve atlamadan ilerleyen bir düzen kur.
- Hakkımızda sayfasında “Ne yapıyoruz?” bölümünü numarasız bırak; sayfa girişi `01`, Hikâyemiz `02`, Misyonumuz `03`, Değerlerimiz `04` olsun.
- Takımımız sayfasında her kişinin portre/placeholder rozetini, sayfadaki gerçek kişi sırasından üret: Ceren Öz `01`, ardından kartlar `02`, `03`… diye kesintisiz ilerlesin. Bölüm numaraları kendi mevcut bölüm akışını korusun.
- İş Ortakları sayfasındaki altı kartı kahve, kitap, baskı, çalışma alanı, kod ve kırtasiye kategorilerine uygun line-art işaretlerle ayır; turuncu/bordo/lacivert vurgu, farklı rozet konumu ve farklı çizgi detayı varyasyonları kullan.
- Placeholder ve rozet metinlerinde rastgele görünen sayıları kaldır; sıra numaralarını verinin gerçek diziliminden türet.
- Masaüstü ve mobil görünümde tüm sayfaları gezerek numara sırasını, kart çeşitliliğini, taşmaları ve mevcut etkileşimleri doğrula.

## Teknik notlar

- Mevcut TanStack route yapısı, semantik renk tokenları ve ortak tasarım bileşenleri korunacak.
- İş ortağı ikonları hafif inline SVG/lucide çizgi ikonlarıyla uygulanacak; yeni görsel veya ağır kütüphane eklenmeyecek.
- Değişiklikler yalnızca sunum ve içerik sıralamasıyla sınırlı olacak; form ve etkinlik davranışları değişmeyecek.
