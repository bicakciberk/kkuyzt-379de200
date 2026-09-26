import { Check, Copy, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "yzt-turing-arena-v1";
const ROUND_SIZE = 5;

type Item = {
  id: string;
  text: string;
  source: "human" | "ai";
  label: string;
  note: string;
  category: string;
};

const ITEMS: Item[] = [
  { id: "h1", category: "Şiir", source: "human", label: "Nâzım Hikmet", note: "\"Yaşamaya Dair\", 1948", text: "Yaşamak şakaya gelmez, büyük bir ciddiyetle yaşayacaksın bir sincap gibi mesela, yani yaşamanın dışında ve ötesinde hiçbir şey beklemeden." },
  { id: "a1", category: "Şiir", source: "ai", label: "Yapay zekâ", note: "Büyük dil modeli, 2025", text: "Sabahın mavisi bir veri gibi akıyor damarlarıma, ben ki hatırlamayı öğrenen bir sessizliğim, her şafakta yeniden kurulan bir cümleyim." },
  { id: "h2", category: "Felsefe", source: "human", label: "Dostoyevski", note: "\"Yeraltından Notlar\", 1864", text: "İnsan bazen kendi zararına olan şeyi, sırf akla uygun olmadığı için, sırf canı öyle istediği için seçer. En aptal kaprisi bile onun için özgürlüktür." },
  { id: "a2", category: "Felsefe", source: "ai", label: "Yapay zekâ", note: "Sohbet modeli yanıtı", text: "Belki de bilinç, evrenin kendisine dair tuttuğu düzensiz bir defterdir; her satırı bir öncekini yanlışlayan, ama yazmaktan asla vazgeçmeyen bir defter." },
  { id: "h3", category: "Kod", source: "human", label: "İnsan geliştirici", note: "Açık kaynak proje yorumu", text: "// Burayı sakın değiştirme. Neden çalıştığını ben de bilmiyorum ama kaldırdığımda her şey bozuluyor. Üç gün uğraştım, pes ettim." },
  { id: "a3", category: "Kod", source: "ai", label: "Yapay zekâ", note: "Kod asistanı çıktısı", text: "// Bu fonksiyon, girdi dizisini tek geçişte tarar ve bellek kullanımını sabit tutar. Karmaşıklık O(n), hata durumlarında güvenli varsayılana döner." },
  { id: "h4", category: "Sınav", source: "human", label: "Öğrenci", note: "Gerçek bir vize kâğıdından", text: "Hocam bu soruyu çözemedim ama çalıştığımı göstermek istiyorum: formülü biliyorum, sadece sayıları yerine koyunca sonuç negatif çıkıyor ve bu bence fiziksel olarak mümkün değil." },
  { id: "a4", category: "Sınav", source: "ai", label: "Yapay zekâ", note: "Model cevabı", text: "Sistemin toplam verimi, alt bileşenlerin verimlerinin çarpımına eşittir. Dolayısıyla tek bir bileşende yapılan iyileştirme, genel verimi doğrusal olmayan biçimde etkiler." },
  { id: "h5", category: "Günlük", source: "human", label: "Kampüsten bir not", note: "Öğrenci topluluğu panosu", text: "Kütüphanede yer kalmadığı için merdivende ders çalışıyoruz. Isıtma çalışmıyor, wifi iki dakikada bir gidiyor ama en azından kahve makinesi bugün bozulmadı." },
  { id: "a5", category: "Günlük", source: "ai", label: "Yapay zekâ", note: "Üretilmiş metin", text: "Kampüsün sabah saatleri, öğrencilerin telaşıyla birlikte canlı bir ritim kazanıyor; her köşede yeni bir sohbet, her adımda bir fikir filizleniyor." },
  { id: "h6", category: "Aforizma", source: "human", label: "Alan Turing", note: "1950, \"Computing Machinery and Intelligence\"", text: "Makineler düşünebilir mi sorusu, bence anlamsız olduğu için tartışmaya değmez. Yine de yüzyılın sonunda bu soruyu kimse tuhaf bulmayacak." },
  { id: "a6", category: "Aforizma", source: "ai", label: "Yapay zekâ", note: "Üretilmiş özlü söz", text: "Zekâ, doğru cevabı bulmak değil; hangi sorunun sorulmaya değer olduğunu sezmektir. Gerisi yalnızca hesaplamadır." },
  { id: "h7", category: "Mizah", source: "human", label: "Bir mühendislik öğrencisi", note: "Topluluk sohbetinden", text: "Projeyi teslim etmeden iki saat önce kodu çalıştırdım ve hiç hata vermedi. O anda hata vermediği için daha çok korktum." },
  { id: "a7", category: "Mizah", source: "ai", label: "Yapay zekâ", note: "Üretilmiş şaka", text: "Bir yapay zekâ modeline en sevdiği yemeği sordular. \"Veri kümesi,\" dedi, \"ama porsiyonu büyük olsun, yoksa doyduğumu sanıyorum.\"" },
  { id: "h8", category: "Edebiyat", source: "human", label: "Sabahattin Ali", note: "\"Kürk Mantolu Madonna\", 1943", text: "İnsanların en basit, en zavallı, hatta en aptal olanı bile, insanı hayretten hayrete düşüren ne müthiş, ne karışık bir ruha sahiptir." },
  { id: "a8", category: "Edebiyat", source: "ai", label: "Yapay zekâ", note: "Üretilmiş pasaj", text: "Odanın içindeki sessizlik, sanki yıllardır birikmiş bir hafızanın ağırlığını taşıyordu; perdeler kımıldadıkça o hafıza yeniden şekil alıyordu." },
];

const BADGES = [
  { min: 5, title: "Sentetik Dedektif", note: "Hiçbir model seni kandıramıyor." },
  { min: 4, title: "Algoritma Avcısı", note: "Kalıpları neredeyse anında yakalıyorsun." },
  { min: 3, title: "Yarı Sayborg", note: "Arada bir makineye kanıyorsun." },
  { min: 2, title: "Şüpheci Amatör", note: "Sezgin var, biraz daha pratik gerek." },
  { min: 0, title: "Kolay Kandırılır", note: "Bu turu yapay zekâ kazandı." },
];

function badgeFor(score: number) {
  return BADGES.find((badge) => score >= badge.min) ?? BADGES[BADGES.length - 1]!;
}

function pickRound(): Item[] {
  const pool = [...ITEMS];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, ROUND_SIZE);
}

export function TuringArena() {
  const [round, setRound] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<"human" | "ai" | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<boolean[]>([]);

  useEffect(() => {
    setRound(pickRound());
    const stored = Number(window.localStorage.getItem(STORAGE_KEY) ?? "0");
    if (Number.isFinite(stored)) setBest(stored);
  }, []);

  const current = round[index];
  const finished = round.length > 0 && index >= round.length;

  useEffect(() => {
    if (!finished) return;
    setBest((previous) => {
      if (score <= previous) return previous;
      window.localStorage.setItem(STORAGE_KEY, String(score));
      return score;
    });
  }, [finished, score]);

  const restart = useCallback(() => {
    setRound(pickRound());
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setHistory([]);
    setCopied(false);
  }, []);

  const choose = useCallback(
    (choice: "human" | "ai") => {
      if (!current || answer) return;
      const correct = choice === current.source;
      setAnswer(choice);
      setHistory((previous) => [...previous, correct]);
      if (correct) setScore((previous) => previous + 1);
    },
    [answer, current],
  );

  const next = useCallback(() => {
    setAnswer(null);
    setIndex((previous) => previous + 1);
  }, []);

  const shareText = useMemo(() => {
    const grid = history.map((hit) => (hit ? "🟦" : "⬜")).join("");
    return `İnsan mı, Yapay Zekâ mı? ${score}/${ROUND_SIZE} ${grid}\n${badgeFor(score).title}\nkkuyzt.lovable.app/games`;
  }, [history, score]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [shareText]);

  if (!round.length) return <div className="min-h-[24rem]" aria-hidden />;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
      <div>
        {finished ? (
          <div className="border border-foreground bg-card p-8 md:p-12">
            <p className="eyebrow">Tur sonucu</p>
            <p className="mt-6 font-display text-6xl leading-none font-semibold md:text-7xl">
              {score}
              <span className="text-muted-foreground">/{ROUND_SIZE}</span>
            </p>
            <h3 className="mt-6 font-display text-3xl leading-tight font-semibold">{badgeFor(score).title}</h3>
            <p className="mt-3 max-w-md leading-7 text-muted-foreground">{badgeFor(score).note}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {history.map((hit, position) => (
                <span key={position} className={cn("turing-pip", hit ? "turing-pip-hit" : "turing-pip-miss")} aria-hidden />
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button onClick={restart} className="rounded-none">
                <RotateCcw className="size-4" /> Yeni tur
              </Button>
              <Button variant="outline" onClick={copy} className="rounded-none">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? "Kopyalandı" : "Sonucu kopyala"}
              </Button>
            </div>
          </div>
        ) : current ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <p className="eyebrow">{current.category}</p>
              <p className="text-sm font-bold tracking-wide">
                {index + 1} / {round.length}
              </p>
            </div>
            <div className="turing-quote mt-8 border border-foreground bg-card p-8 md:p-12">
              <span className="font-display text-6xl leading-none text-brand-pale" aria-hidden>
                “
              </span>
              <p className="mt-2 font-display text-2xl leading-9 md:text-3xl md:leading-[2.9rem]">{current.text}</p>
            </div>

            {answer ? (
              <div className="mt-8 border border-foreground p-6 md:p-8">
                <div className="flex items-center gap-3">
                  {answer === current.source ? (
                    <>
                      <span className="turing-mark turing-mark-hit">
                        <Check className="size-4" />
                      </span>
                      <p className="font-bold">Doğru bildin.</p>
                    </>
                  ) : (
                    <>
                      <span className="turing-mark turing-mark-miss">
                        <X className="size-4" />
                      </span>
                      <p className="font-bold">Bu sefer yanıldın.</p>
                    </>
                  )}
                </div>
                <p className="mt-4 leading-7">
                  {current.source === "human" ? (
                    <>
                      Bu metni <strong>bir insan</strong> yazdı: {current.label}.
                    </>
                  ) : (
                    <>
                      Bu metni <strong>bir yapay zekâ</strong> üretti.
                    </>
                  )}
                </p>

                <p className="mt-2 text-sm text-muted-foreground">{current.note}</p>
                <Button onClick={next} className="mt-8 rounded-none">
                  {index + 1 === round.length ? "Sonucu gör" : "Sıradaki metin"}
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button type="button" onClick={() => choose("human")} className="turing-choice">
                  <span className="eyebrow">Tahminim</span>
                  <span className="mt-3 block font-display text-2xl font-semibold">İnsan yazdı</span>
                </button>
                <button type="button" onClick={() => choose("ai")} className="turing-choice">
                  <span className="eyebrow">Tahminim</span>
                  <span className="mt-3 block font-display text-2xl font-semibold">Yapay zekâ üretti</span>
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <aside>
        <div className="border border-foreground p-6">
          <p className="eyebrow">Durum</p>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">Bu tur</dt>
              <dd className="font-display text-3xl leading-none font-semibold">{score}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">En iyi skorun</dt>
              <dd className="font-display text-3xl leading-none font-semibold">{best}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            {Array.from({ length: ROUND_SIZE }, (_, position) => {
              const hit = history[position];
              return (
                <span
                  key={position}
                  className={cn("turing-pip", hit === undefined ? "turing-pip-idle" : hit ? "turing-pip-hit" : "turing-pip-miss")}
                  aria-hidden
                />
              );
            })}
          </div>
        </div>
        <div className="mt-8 border border-foreground p-6 text-sm leading-6">
          <p className="font-bold">Nasıl oynanır?</p>
          <p className="mt-3 text-muted-foreground">
            Ekrandaki metni oku ve kimin yazdığını tahmin et. Beş metnin sonunda unvanını öğrenip sonucunu paylaşabilirsin.
          </p>
          <p className="mt-4 text-muted-foreground">
            İnsan metinleri gerçek eserlerden, yapay zekâ metinleri güncel dil modellerinden alındı.
          </p>
        </div>
        {!finished && (
          <Button variant="outline" onClick={restart} className="mt-8 w-full rounded-none">
            <RotateCcw className="size-4" /> Turu yenile
          </Button>
        )}
      </aside>
    </div>
  );
}
