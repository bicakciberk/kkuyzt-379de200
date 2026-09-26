export const faqs = [
  ["Üye olmak ücretli mi?", "Hayır. YZT üyeliği tamamen ücretsiz. Bazı teknik gezilerde ulaşım gibi ek masraflar çıkarsa bunu önceden açıkça duyururuz."],
  ["Hangi bölümden olmam gerekiyor?", "Herhangi bir bölümden olabilirsin. Yapay zekâ tek bir disipline sığmıyor; mühendislikten sosyal bilimlere herkesin katkısı değerli."],
  ["Deneyimim yoksa katılabilir miyim?", "Elbette. Başlangıç atölyelerimiz sıfırdan başlayanlar için tasarlandı. Tek ihtiyacın merak ve öğrenmeye açık olmak."],
  ["Etkinliklere katılım zorunlu mu?", "Zorunlu değil. Programına uyan etkinliklere katılırsın; yine de düzenli gelenler ekiplerde daha aktif rol alabiliyor."],
  ["Başvurudan sonra ne oluyor?", "Başvurunu aldıktan sonra e-posta ya da telefonla sana ulaşıyor, topluluğun iletişim kanallarına davet ediyoruz."],
  ["Ekiplerde görev alabilir miyim?", "Evet. Organizasyon, Dış İlişkiler, Sosyal Medya ve Tanıtım ekiplerimiz her dönem yeni üyelere kapı açıyor."],
  ["Etkinlikler nerede yapılıyor?", "Çoğunlukla Kırıkkale Üniversitesi kampüsünde. Teknik geziler ve bazı buluşmalar kampüs dışında olabiliyor; hepsini Instagram'dan duyuruyoruz."],
  ["Başka üniversiteden katılabilir miyim?", "Açık etkinliklerimize herkes gelebilir. Aktif üyelik ve ekip görevleri ise Kırıkkale Üniversitesi öğrencilerine yönelik."],
] as const;

export type ResourceType = "Kurs" | "Makale" | "Video" | "Repo";
export type Resource = { title: string; desc: string; type: ResourceType; url: string };
export const resourceLevels: { level: string; note: string; items: Resource[] }[] = [
  { level: "Başlangıç", note: "Hiç kod yazmadıysan bile buradan başlayabilirsin.", items: [
    { title: "Elements of AI", desc: "Yapay zekânın temel kavramlarını matematiğe boğmadan anlatan ücretsiz çevrim içi kurs.", type: "Kurs", url: "https://www.elementsofai.com/" },
    { title: "Neural Networks — 3Blue1Brown", desc: "Sinir ağlarının nasıl öğrendiğini görsel anlatımla sezdiren kısa video serisi.", type: "Video", url: "https://www.3blue1brown.com/topics/neural-networks" },
    { title: "Kaggle Learn", desc: "Python, pandas ve makine öğrenmesine giriş için tarayıcıda çalışan mini dersler.", type: "Kurs", url: "https://www.kaggle.com/learn" },
    { title: "Google ML Crash Course", desc: "Google'ın makine öğrenmesine hızlı giriş kursu; alıştırmalar ve etkileşimli görsellerle.", type: "Kurs", url: "https://developers.google.com/machine-learning/crash-course" },
    { title: "BTK Akademi", desc: "Türkçe yapay zekâ ve veri bilimi eğitimleri; ücretsiz ve sertifikalı.", type: "Kurs", url: "https://www.btkakademi.gov.tr/" },
  ]},
  { level: "Orta", note: "Temelleri biliyorsan projeye dökme zamanı.", items: [
    { title: "Machine Learning Specialization", desc: "Andrew Ng'nin klasikleşmiş makine öğrenmesi serisinin güncel hâli.", type: "Kurs", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
    { title: "Practical Deep Learning — fast.ai", desc: "Önce uygulama, sonra teori: derin öğrenmeyi çalışan modellerle öğreten kurs.", type: "Kurs", url: "https://course.fast.ai/" },
    { title: "Hugging Face Course", desc: "Transformer modelleri, tokenizer'lar ve ince ayar üzerine uygulamalı kurs.", type: "Kurs", url: "https://huggingface.co/learn" },
    { title: "scikit-learn", desc: "Klasik makine öğrenmesi algoritmalarının en yaygın Python kütüphanesi ve örnekleri.", type: "Repo", url: "https://github.com/scikit-learn/scikit-learn" },
    { title: "Dive into Deep Learning", desc: "Kodla birlikte ilerleyen açık kaynak derin öğrenme kitabı.", type: "Makale", url: "https://d2l.ai/" },
  ]},
  { level: "İleri", note: "Makale okuyup sıfırdan model kurmak isteyenlere.", items: [
    { title: "Neural Networks: Zero to Hero", desc: "Andrej Karpathy ile küçük bir dil modelini adım adım sıfırdan yazmak.", type: "Video", url: "https://karpathy.ai/zero-to-hero.html" },
    { title: "Attention Is All You Need", desc: "Transformer mimarisini tanıtan ve bugünkü dil modellerinin temelini atan makale.", type: "Makale", url: "https://arxiv.org/abs/1706.03762" },
    { title: "Stanford CS231n", desc: "Görüntü işleme için derin öğrenme; ders notları ve ödevleriyle.", type: "Kurs", url: "https://cs231n.github.io/" },
    { title: "nanoGPT", desc: "GPT eğitimi için sade ve okunabilir, deney yapmaya uygun kod tabanı.", type: "Repo", url: "https://github.com/karpathy/nanoGPT" },
  ]},
];

export const sponsorReasons = [
  ["Sektörle bağlantı", "Şirketinizi kampüste yapay zekâ konuşan öğrencilerle doğrudan buluşturuyoruz."],
  ["Genç yeteneklere erişim", "Staj ve işe alım süreçleriniz için meraklı, üreten öğrencilerle erken tanışın."],
  ["Marka görünürlüğü", "Etkinliklerde, basılı materyallerde ve sosyal medyada markanız görünür olur."],
  ["Sosyal etki", "Bölgedeki öğrencilerin teknolojiye erişimine somut katkı sağlarsınız."],
] as const;

export const sponsorTiers = [
  { name: "Destekçi", tag: "01", perks: ["Sosyal medyada teşekkür paylaşımı", "Web sitesinde logo", "Bir etkinliğe katılım daveti"] },
  { name: "Kurumsal Ortak", tag: "02", perks: ["Destekçi kazanımlarının tamamı", "Bir atölye ya da seminerde sunum hakkı", "Etkinlik materyallerinde logo", "Üyelerle staj duyurusu paylaşımı"], featured: true },
  { name: "Ana Sponsor", tag: "03", perks: ["Kurumsal Ortak kazanımlarının tamamı", "Dönemlik etkinlik serisinde isim sponsorluğu", "Kariyer günü ve teknik gezi organizasyonu", "Tüm kanallarda öncelikli görünürlük"] },
];
