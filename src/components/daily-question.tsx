import { useEffect, useState } from "react";
import { HelpCircle, RefreshCw } from "lucide-react";
import { dailyFactIndex, istanbulDateKey } from "@/lib/site-data";

type Option = { label: string; reply: string };
type Question = { id: string; question: string; options: readonly [Option, Option, Option] };

const QUESTIONS: readonly Question[] = [
  {
    id: "q1",
    question: "Bugün hangi yapay zekâ problemini çözmek isterdin?",
    options: [
      { label: "Yemekhane yoğunluğunu tahmin etmek", reply: "Klasik bir zaman serisi işi: birkaç haftalık giriş sayısı ve ders programıyla bile şaşırtıcı isabetli tahmin çıkar." },
      { label: "Ders notlarını özetleyen bir asistan", reply: "Hazır bir dil modelinin üstüne kendi ders notlarını eklemek yeterli; en zor kısmı veriyi düzgün toplamak." },
      { label: "Kampüsteki kedileri tanıyan kamera", reply: "Görüntü işlemeye giriş için harika bir bahane; 200 fotoğraf ve bir akşam yetiyor." },
    ],
  },
  {
    id: "q2",
    question: "Yapay zekâda en çok hangi kısmı seviyorsun?",
    options: [
      { label: "Veriyi toplamak ve temizlemek", reply: "İşin sessiz kahramanı sensin. İyi veri, karmaşık modelden çoğu zaman daha çok kazandırır." },
      { label: "Modeli kurmak ve eğitmek", reply: "Denemeyi seviyorsun demek. Atölyelerimizde en çok eğlenen grup bu oluyor." },
      { label: "Sonucu anlatmak ve sunmak", reply: "Anlatılmayan proje yarım kalır. Topluluk sunumlarında seni görmek isteriz." },
    ],
  },
  {
    id: "q3",
    question: "Bir hafta sonun olsa neyle uğraşırdın?",
    options: [
      { label: "Küçük bir proje bitirmek", reply: "Bitmiş küçük bir iş, yarım kalmış büyük bir fikirden her zaman daha değerli." },
      { label: "Yeni bir konu öğrenmek", reply: "Merak listesi uzun olan insanlar bu toplulukta çabuk ısınıyor." },
      { label: "Bir yarışmaya hazırlanmak", reply: "Takım kurma vakti: yarışma başvurularını Instagram'dan duyuruyoruz." },
    ],
  },
  {
    id: "q4",
    question: "Sence yapay zekânın en çok işe yaradığı yer hangisi?",
    options: [
      { label: "Sağlık ve teşhis", reply: "En hassas alan; doğruluk kadar hesap verebilirlik de tartışılıyor." },
      { label: "Eğitim ve öğrenme", reply: "Kişiye göre hızlanan içerik fikri, bizim en çok tartıştığımız konulardan biri." },
      { label: "Üretim ve mühendislik", reply: "Endüstri mühendisliği geçmişimizle bu başlıkta konuşacak çok şeyimiz var." },
    ],
  },
  {
    id: "q5",
    question: "Yeni bir konuya nasıl başlarsın?",
    options: [
      { label: "Doğrudan kod yazarak", reply: "Bozup düzelterek öğrenenlerdensin; atölyelerde en hızlı ilerleyen tip." },
      { label: "Önce teoriyi okuyarak", reply: "Sağlam temel kuruyorsun. Kaynaklar sayfamızdaki seviyeli liste tam sana göre." },
      { label: "Birine sorarak", reply: "En kısa yol bu. Zaten topluluk tam olarak bunun için var." },
    ],
  },
  {
    id: "q6",
    question: "Yapay zekâ hakkında en çok hangi soru kafanı kurcalıyor?",
    options: [
      { label: "Gerçekten anlıyor mu?", reply: "Turing Arenası oyunumuzu bir dene; insan mı makine mi ayırt etmek sandığından zor." },
      { label: "İşleri elimizden alacak mı?", reply: "Bugüne kadarki tabloya göre işler değişiyor, yok olmuyor; ama hazırlıklı olan kazanıyor." },
      { label: "Nereden başlamalıyım?", reply: "Bir küçük projeden. Gerisi kendiliğinden geliyor." },
    ],
  },
] as const;

const STORAGE_KEY = "yzt-gunun-sorusu-v1";

export function DailyQuestion() {
  const [day, setDay] = useState<string | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => { setDay(istanbulDateKey()) }, []);

  const question = day ? QUESTIONS[dailyFactIndex(day, QUESTIONS.length)] : undefined;

  useEffect(() => {
    if (!day) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { day?: string; index?: number };
      if (saved.day === day && typeof saved.index === "number") setPicked(saved.index);
    } catch { /* Kayıt okunamazsa soru baştan sorulur. */ }
  }, [day]);

  const choose = (index: number) => {
    setPicked(index);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ day, index })) } catch { /* Kayıt zorunlu değil. */ }
  };

  const again = () => {
    setPicked(null);
    try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* Kayıt zorunlu değil. */ }
  };

  if (!question) return null;
  const answer = picked !== null ? question.options[picked] : undefined;

  return <div className="daily-question">
    <div className="daily-question-head">
      <span className="daily-question-badge"><HelpCircle className="size-4" aria-hidden="true" /> Bugünün sorusu</span>
      <span className="daily-question-hint">Her gün yenilenir</span>
    </div>
    <h3 className="daily-question-title font-display">{question.question}</h3>
    {answer
      ? <div className="daily-question-answer">
          <p className="daily-question-picked">Seçimin: <strong>{answer.label}</strong></p>
          <p className="daily-question-reply">{answer.reply}</p>
          <button type="button" onClick={again} className="daily-question-again"><RefreshCw className="size-3.5" aria-hidden="true" /> Başka bir seçenek dene</button>
        </div>
      : <div className="daily-question-options">
          {question.options.map((option, i) => <button key={option.label} type="button" onClick={() => choose(i)} className="daily-question-option">
            <span className="daily-question-option-no">{String(i + 1).padStart(2, "0")}</span>
            <span>{option.label}</span>
          </button>)}
        </div>}
  </div>;
}
