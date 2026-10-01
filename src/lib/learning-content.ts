export type RoadStep = { id: string; title: string; learn: string; tools: string; task: string };
export type Roadmap = { id: string; title: string; note: string; steps: RoadStep[] };

export const roadmaps: Roadmap[] = [
  { id: "nlp", title: "Dil Modelleri & NLP", note: "Kendi yapay zekâ asistanını kurmaya giden yol.", steps: [
    { id: "py", title: "Python temelleri", learn: "Değişkenler, fonksiyonlar, listeler, sözlükler ve dosya okuma.", tools: "Python, VS Code, Jupyter", task: "Bir metin dosyasındaki en sık geçen 10 kelimeyi bulan kod yaz." },
    { id: "api", title: "Model API'leri ve prompt yazımı", learn: "Bir dil modeline istek atmak, iyi prompt kurmak, fonksiyon çağırma.", tools: "requests, OpenAI / Gemini SDK", task: "Verdiğin metni üç maddede özetleyen küçük bir komut satırı aracı yap." },
    { id: "emb", title: "Embedding ve vektör veritabanları", learn: "Metni sayılara çevirmek, benzerlik araması yapmak.", tools: "sentence-transformers, Chroma, FAISS", task: "Ders notlarını yükle, soruya en yakın paragrafı getiren arama yap." },
    { id: "rag", title: "RAG mimarisi", learn: "Modelin cevabını kendi belgelerine dayandırmak.", tools: "LangChain veya LlamaIndex", task: "Yönetmelik PDF'ine soru sorulabilen bir asistan kur." },
    { id: "ship", title: "Yayına alma", learn: "Basit arayüz, API uç noktası ve paylaşım.", tools: "Gradio, FastAPI, Hugging Face Spaces", task: "Asistanını bir bağlantıyla arkadaşlarına aç." },
  ]},
  { id: "cv", title: "Bilgisayarlı Görü", note: "Kameradan anlam çıkaran modeller.", steps: [
    { id: "cv-basics", title: "OpenCV ve görüntü matrisleri", learn: "Piksel, renk uzayları, filtreler, kenar bulma.", tools: "OpenCV, NumPy", task: "Webcam görüntüsünde kenarları gerçek zamanlı göster." },
    { id: "cnn", title: "CNN ve transfer learning", learn: "Evrişim katmanları, hazır modeli kendi verine uyarlamak.", tools: "PyTorch, torchvision", task: "Kedi/köpek sınıflandırıcısını %90 üstü doğrulukla eğit." },
    { id: "data", title: "Veri seti hazırlama", learn: "Etiketleme, veri artırma, eğitim/test ayırma.", tools: "Roboflow, Label Studio", task: "Kampüsten 100 fotoğrafı kendi sınıflarınla etiketle." },
    { id: "yolo", title: "YOLO ile nesne tespiti", learn: "Kutu tahmini, mAP, eşik ayarı.", tools: "Ultralytics YOLO", task: "Kendi veri setinle bir tespit modeli eğit." },
    { id: "live", title: "Gerçek zamanlı çıkarım", learn: "Hız optimizasyonu, ONNX dışa aktarma.", tools: "ONNX, OpenCV", task: "Modelini canlı kamera akışında çalıştır." },
  ]},
  { id: "ds", title: "Veri Bilimi & Klasik ML", note: "Tablo verisinden karar çıkarmak.", steps: [
    { id: "pd", title: "Pandas ve NumPy", learn: "Veri okuma, filtreleme, gruplama, eksik veri.", tools: "pandas, NumPy", task: "Açık bir veri setini temizleyip özet tablo çıkar." },
    { id: "eda", title: "Keşifsel analiz ve görselleştirme", learn: "Dağılımlar, korelasyon, doğru grafik seçimi.", tools: "matplotlib, seaborn", task: "Veri setinden üç ilginç bulguyu grafikle anlat." },
    { id: "skl", title: "scikit-learn ile modelleme", learn: "Regresyon, sınıflandırma, çapraz doğrulama.", tools: "scikit-learn", task: "Ev fiyatı tahmin modeli kur ve hatasını ölç." },
    { id: "kaggle", title: "İlk Kaggle yarışması", learn: "Özellik mühendisliği, gönderim, sıralama.", tools: "Kaggle Notebooks", task: "Titanic yarışmasına bir gönderim yap." },
  ]},
];

export type Tool = { name: string; use: string; why: string; url: string };
export const toolbox: { group: string; note: string; tools: Tool[] }[] = [
  { group: "Bulut & GPU", note: "Bilgisayarın yetmediğinde.", tools: [
    { name: "Google Colab", use: "Tarayıcıda Python not defteri", why: "Ücretsiz GPU ile model eğitebilirsin.", url: "https://colab.research.google.com/" },
    { name: "Kaggle Notebooks", use: "Veri + not defteri bir arada", why: "Haftalık ücretsiz GPU kotası sunuyor.", url: "https://www.kaggle.com/code" },
    { name: "Hugging Face Spaces", use: "Demo yayınlama", why: "Projeni tek bağlantıyla paylaşırsın.", url: "https://huggingface.co/spaces" },
    { name: "Lightning AI", use: "Bulut geliştirme ortamı", why: "Aylık ücretsiz kredilerle GPU erişimi.", url: "https://lightning.ai/" },
  ]},
  { group: "Geliştirme", note: "Her gün açık duran pencereler.", tools: [
    { name: "VS Code", use: "Kod editörü", why: "Python ve Jupyter eklentileriyle tam donanımlı.", url: "https://code.visualstudio.com/" },
    { name: "Cursor", use: "Yapay zekâ destekli editör", why: "Kod okurken ve yazarken hız kazandırır.", url: "https://cursor.com/" },
    { name: "uv", use: "Python paket yöneticisi", why: "Ortam kurmayı saniyelere indirir.", url: "https://docs.astral.sh/uv/" },
    { name: "Ollama", use: "Yerel dil modeli", why: "Modelleri internetsiz, kendi bilgisayarında dene.", url: "https://ollama.com/" },
  ]},
  { group: "Veri & Model", note: "Sıfırdan başlamak zorunda değilsin.", tools: [
    { name: "Hugging Face Hub", use: "Model ve veri seti deposu", why: "Binlerce hazır modele tek satırla erişim.", url: "https://huggingface.co/" },
    { name: "Papers with Code", use: "Makale + kod", why: "Okuduğun makalenin çalışan kodunu bulursun.", url: "https://paperswithcode.com/" },
    { name: "Roboflow", use: "Görsel etiketleme", why: "Görü projelerinde veri hazırlığını hızlandırır.", url: "https://roboflow.com/" },
    { name: "Kaggle Datasets", use: "Açık veri setleri", why: "Pratik için sınırsız gerçek veri.", url: "https://www.kaggle.com/datasets" },
  ]},
  { group: "Öğrenci Fırsatları", note: "Öğrenci e-postan burada altın değerinde.", tools: [
    { name: "GitHub Student Pack", use: "Öğrenci paketi", why: "Copilot dahil onlarca ücretli aracı ücretsiz verir.", url: "https://education.github.com/pack" },
    { name: "JetBrains Öğrenci Lisansı", use: "PyCharm ve diğer IDE'ler", why: "Profesyonel sürümler öğrenciye ücretsiz.", url: "https://www.jetbrains.com/community/education/" },
    { name: "AWS Educate", use: "Bulut eğitimi", why: "Kredi kartı istemeden bulut öğrenme ortamı.", url: "https://aws.amazon.com/education/awseducate/" },
  ]},
];
