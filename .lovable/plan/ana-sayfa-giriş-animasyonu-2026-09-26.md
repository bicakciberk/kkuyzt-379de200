# Ana Sayfa Giriş Animasyonu

## Yapılacaklar
- Ana sayfaya, oturumda yalnız ilk ziyarette çalışan iki parçalı koyu mavi perde katmanı eklenecek.
- Perdeler yaklaşık 0,7 saniyede ease-out ile merkezden yanlara açılacak; içerik arka planda hazır kalacak.
- Perde açıldıktan sonra yönetim panelinden gelen hero sloganı 30–50 ms karakter temposuyla yazılacak.
- Yazım sırasında ince, sade bir imleç gösterilecek; tamamlanınca açıklama, butonlar ve poster yumuşakça belirecek.
- Toplam süre 2,5 saniyenin altında tutulacak; mobil süreleri biraz kısaltılacak.
- `sessionStorage` ile aynı oturumdaki yenileme ve geri dönüşlerde animasyon atlanacak.
- Hareket azaltma tercihi olan ziyaretçilerde uzun animasyon yerine içerik doğrudan gösterilecek.

## Kontrol
- İlk masaüstü ve mobil girişte perde, yazım ve içerik sırası doğrulanacak.
- Aynı oturumdaki yenilemede animasyonun tekrarlanmadığı kontrol edilecek.
- Animasyon sonunda bağlantıların ve butonların hemen kullanılabildiği doğrulanacak.
