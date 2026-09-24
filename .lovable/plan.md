# Çizgi Motif Görsel İmzası

## Yapılacaklar
- Hero posterindeki lupa/nöron, yıldız, ok ve nokta çizimlerini ortak bir dekoratif motif bileşenine dönüştürmek.
- Her sayfa girişinde farklı bir motif kullanmak; motifleri yalnız köşe ve kenarlarda, içeriğin arkasında ve düşük opaklıkta tutmak.
- Ana sayfadaki “Bir kulüpten daha fazlası” ile geri sayım alanına ayrı motifler, footer’ın sağ altına küçük bir imza motifi eklemek.
- Masaüstünde kaydırmaya bağlı, düşük mesafeli ve `requestAnimationFrame` ile çalışan hafif parallax uygulamak; mobilde ve azaltılmış hareket tercihinde motifi sabit bırakmak.
- Masaüstü ve mobil görünümde okunabilirlik, taşma ve performansı doğrulamak.

## Teknik ayrıntılar
- Motifler tek bir React/SVG bileşeninden üretilecek; dekoratif oldukları için ekran okuyuculardan gizlenecek.
- Bölüm katmanları ortak CSS sınıflarıyla yönetilecek; içerik üst katmanda, ikon en alt dekoratif katmanda kalacak.
- Parallax yalnız geniş ekranda pasif scroll dinleyicisi ve tek animasyon karesi üzerinden çalışacak; harici kütüphane eklenmeyecek.
