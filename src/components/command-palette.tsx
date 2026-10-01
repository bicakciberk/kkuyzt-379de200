import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ArrowRight, TerminalSquare } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Dest =
  | "/"
  | "/about"
  | "/team"
  | "/events"
  | "/resources"
  | "/roadmaps"
  | "/toolbox"
  | "/games"
  | "/partners"
  | "/yzt-card"
  | "/manifesto"

  | "/sponsor"
  | "/faq"
  | "/join"
  | "/contact";

const PAGES: ReadonlyArray<{ to: Dest; label: string; hint: string; keywords: string }> = [
  { to: "/", label: "Ana Sayfa", hint: "Başlangıç", keywords: "anasayfa home giris" },
  { to: "/about", label: "Hakkımızda", hint: "Hikâyemiz · Rakamlarla YZT", keywords: "hakkinda about biz tarih" },
  { to: "/team", label: "Takımımız", hint: "Departmanlar · Ekip", keywords: "takim ekip team yonetim" },
  { to: "/events", label: "Etkinlikler", hint: "Atölye · Seminer · Gezi", keywords: "etkinlik event takvim atolye seminer" },
  { to: "/games", label: "Mini Oyunlar", hint: "Kod Kırıcı · AI Evrimi · Turing", keywords: "oyun games kod kirici evrim turing wordle" },
  { to: "/yzt-card", label: "YZT Kart", hint: "Üye kartı başvurusu", keywords: "kart card uyelik" },
  { to: "/manifesto", label: "Manifesto", hint: "Beş cümlede duruşumuz", keywords: "manifesto duris ilke deger" },
  { to: "/resources", label: "Kaynaklar", hint: "Başlangıç · Orta · İleri", keywords: "kaynak resources egitim ogren" },
  { to: "/roadmaps", label: "Yol Haritaları", hint: "NLP · Görü · Veri bilimi", keywords: "yol harita roadmap patika ilerleme" },
  { to: "/toolbox", label: "Araç Çantası", hint: "GPU · Editör · Öğrenci fırsatları", keywords: "arac canta toolbox colab gpu github" },
  { to: "/partners", label: "İş Ortakları", hint: "Destekçiler", keywords: "ortak partner sponsor" },
  { to: "/sponsor", label: "Destek Ol", hint: "Sponsorluk", keywords: "destek sponsor bagis" },
  { to: "/faq", label: "SSS", hint: "Sık sorulan sorular", keywords: "sss soru faq yardim" },
  { to: "/join", label: "Bize Katıl", hint: "Üyelik başvurusu", keywords: "katil join uye basvuru" },
  { to: "/contact", label: "İletişim", hint: "E-posta · Adres", keywords: "iletisim contact mail adres" },
];

const YZT_ASCII = [
  "  __   __ ______ ______ ",
  "  \\ \\ / /|___  /|__  __|",
  "   \\ V /    / /    | |  ",
  "    | |    / /_    | |  ",
  "    |_|   /____|   |_|  ",
];

function normalize(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replaceAll("ı", "i")
    .replaceAll("İ", "i")
    .replaceAll("ş", "s")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .trim();
}

const MATRIX_CHARS = "01アイウエオカキクケコサシスセソ<>/{}[]#$%&*+=-";
function matrixLines(rows = 6, cols = 34) {
  const out: string[] = [];
  for (let r = 0; r < rows; r += 1) {
    let line = "";
    for (let c = 0; c < cols; c += 1) {
      line += Math.random() > 0.22 ? MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)] : " ";
    }
    out.push(line);
  }
  return out;
}

type Output = { id: number; lines: string[]; mono?: boolean };

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    "Kullanılabilir komutlar:",
    "  help / yardim  → bu listeyi gösterir",
    "  yzt            → topluluk manifestosu",
    "  turing         → Alan Turing'den bir alıntı",
    "  matrix         → küçük bir karakter akışı",
    "  saat           → şu anki Kırıkkale saati",
    "  clear / temizle→ ekranı temizler",
    "Sayfa adı yazıp Enter'a basarak da gezinebilirsin.",
  ],
  yzt: () => [
    ...YZT_ASCII,
    "",
    "Kırıkkale Üniversitesi Yapay Zeka Topluluğu",
    "Merak et, üret, paylaş. Geleceği birlikte şekillendirelim.",
  ],
  turing: () => [
    "\"Bir makinenin düşünüp düşünemeyeceğini sormak yerine,",
    " onunla konuşurken farkı anlayabilir miyiz diye sormalıyız.\"",
    "                                        — Alan Turing, 1950",
    "",
    "İpucu: Mini Oyunlar'daki Turing Arenası'nda kendini test et.",
  ],
  matrix: () => matrixLines(),
  saat: () => {
    const now = new Date().toLocaleTimeString("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return [`Kırıkkale yerel saati: ${now}`];
  },
};

const ALIASES: Record<string, keyof typeof COMMANDS> = {
  yardim: "help", "?": "help", komutlar: "help",
  manifesto: "yzt", kimizbiz: "yzt", "kimiz-biz": "yzt",
  zaman: "saat",
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) { setQuery(""); setActive(0); return; }
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [outputs]);

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return PAGES;
    return PAGES.filter((p) => normalize(`${p.label} ${p.hint} ${p.keywords} ${p.to}`).includes(q));
  }, [query]);

  useEffect(() => setActive(0), [query]);

  const push = useCallback((lines: string[], mono = false) => {
    setOutputs((prev) => [...prev.slice(-6), { id: Date.now() + Math.random(), lines, mono }]);
  }, []);

  const go = useCallback((to: Dest) => { setOpen(false); void navigate({ to }); }, [navigate]);

  const submit = () => {
    const raw = query.trim();
    const key = normalize(raw).replaceAll(" ", "");
    const resolved = (ALIASES[key] ?? key) as keyof typeof COMMANDS;
    if (key === "clear" || key === "temizle") { setOutputs([]); setQuery(""); return; }
    const command = COMMANDS[resolved];
    if (command) {
      push([`> ${raw}`, ...command()], true);
      setQuery("");
      return;
    }
    const target = results[active] ?? results[0];
    if (target) { go(target.to); return; }
    push([`> ${raw}`, "Böyle bir sayfa ya da komut yok. 'help' yazıp deneyebilirsin."], true);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (results.length ? (i + 1) % results.length : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0)); }
    else if (e.key === "Enter") { e.preventDefault(); submit(); }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cmdk-trigger"
        aria-label="Komut paletini aç"
        title="Komut paleti (Ctrl + K)"
      >
        <TerminalSquare className="size-4" aria-hidden="true" />
        <span className="cmdk-trigger-keys" aria-hidden="true">⌘K</span>
      </button>

      {open && (
        <div className="cmdk-overlay" role="dialog" aria-modal="true" aria-label="Komut paleti">
          <button type="button" className="cmdk-backdrop" aria-label="Kapat" onClick={() => setOpen(false)} />
          <div className="cmdk-panel">
            <div className="cmdk-head">
              <span className="cmdk-head-dot" aria-hidden="true" />
              <span>YZT Terminal</span>
              <span className="cmdk-head-hint">Esc ile kapat</span>
            </div>

            <div className="cmdk-input-row">
              <span className="cmdk-prompt" aria-hidden="true">yzt:~$</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                className="cmdk-input"
                placeholder="Sayfa ara ya da komut yaz (help)"
                aria-label="Sayfa ara ya da komut yaz"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {outputs.length > 0 && (
              <div ref={logRef} className="cmdk-log">
                {outputs.map((o) => (
                  <pre key={o.id} className="cmdk-log-block">{o.lines.join("\n")}</pre>
                ))}
              </div>
            )}

            <div className="cmdk-list">
              {results.length === 0 ? (
                <p className="cmdk-empty">Eşleşen sayfa yok — <strong>help</strong> yazıp komutlara bakabilirsin.</p>
              ) : (
                results.map((p, i) => (
                  <button
                    key={p.to}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(p.to)}
                    className={cn("cmdk-item", i === active && "is-active")}
                  >
                    <span className="cmdk-item-index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="cmdk-item-main">
                      <strong>{p.label}</strong>
                      <small>{p.hint}</small>
                    </span>
                    <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                  </button>
                ))
              )}
            </div>

            <div className="cmdk-foot">
              <span>↑ ↓ gez · Enter aç</span>
              <span>help · yzt · turing · matrix · saat · clear</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
