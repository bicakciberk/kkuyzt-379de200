import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ChevronDown, RotateCcw } from "lucide-react";
import { PageIntro, SloganMark } from "@/components/site";
import { roadmaps } from "@/lib/learning-content";

export const Route = createFileRoute("/roadmaps")({
  head: () => ({ meta: [
    { title: "Yol Haritaları — YZT · Geleceği Birlikte Şekillendirelim" },
    { name: "description", content: "Dil modelleri, bilgisayarlı görü ve veri bilimi için adım adım, ilerlemeni kaydeden etkileşimli öğrenme patikaları." },
    { property: "og:title", content: "Yol Haritaları — YZT" },
    { property: "og:description", content: "Hangi sırayla çalışmalıyım? YZT'nin etkileşimli yapay zekâ patikaları." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Roadmaps,
});

const KEY = "yzt-yol-haritalari-v1";

function Roadmaps() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { /* boş */ } }, []);
  const save = (next: Record<string, boolean>) => { setDone(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* boş */ } };

  return <>
    <PageIntro eyebrow="Yol Haritaları" title="Hangi sırayla?"><p>Bir patika seç, adımları sırayla bitir, tamamladıklarını işaretle. İlerlemen bu tarayıcıda saklanır; döndüğünde kaldığın yerden devam edersin.</p></PageIntro>
    {roadmaps.map((rm, ri) => {
      const count = rm.steps.filter((s) => done[`${rm.id}:${s.id}`]).length;
      const pct = Math.round((count / rm.steps.length) * 100);
      return <section key={rm.id} className={ri % 2 ? "bg-muted" : "bg-background"}>
        <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col gap-4 border-b-2 border-foreground pb-6 md:flex-row md:items-end md:justify-between">
            <div><p className="eyebrow">{String(ri + 2).padStart(2, "0")} · Patika</p><h2 className="mt-3 font-display text-4xl md:text-6xl">{rm.title}</h2><p className="mt-2 text-sm text-muted-foreground">{rm.note}</p></div>
            <div className="min-w-56">
              <div className="flex items-baseline justify-between text-sm font-bold"><span className="font-display text-4xl text-brand-dark">%{pct}</span><span className="text-muted-foreground">{count}/{rm.steps.length} adım</span></div>
              <div className="roadmap-bar mt-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${rm.title} ilerlemesi`}><span style={{ width: `${pct}%` }} /></div>
              {count > 0 && <button type="button" onClick={() => { const n = { ...done }; rm.steps.forEach((s) => delete n[`${rm.id}:${s.id}`]); save(n); }} className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-brand-mid hover:text-brand-dark"><RotateCcw className="size-3" /> Sıfırla</button>}
            </div>
          </div>
          <ol className="roadmap-list mt-8">
            {rm.steps.map((s, si) => {
              const k = `${rm.id}:${s.id}`; const isDone = !!done[k]; const isOpen = open === k;
              return <li key={k} className={`roadmap-step ${isDone ? "is-done" : ""}`}>
                <button type="button" aria-label={isDone ? `${s.title} tamamlandı, işareti kaldır` : `${s.title} adımını tamamlandı işaretle`} onClick={() => save({ ...done, [k]: !isDone })} className="roadmap-check">{isDone ? <Check className="size-4" /> : <span>{si + 1}</span>}</button>
                <div className="flex-1">
                  <button type="button" onClick={() => setOpen(isOpen ? null : k)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 text-left">
                    <span className="font-display text-2xl leading-tight">{s.title}</span>
                    <ChevronDown className={`size-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <div className="roadmap-detail mt-4 grid gap-4 sm:grid-cols-3">
                    <div><p className="text-xs font-bold uppercase text-brand-mid">Ne öğreneceksin?</p><p className="mt-1 text-sm leading-6">{s.learn}</p></div>
                    <div><p className="text-xs font-bold uppercase text-brand-mid">Araçlar</p><p className="mt-1 text-sm leading-6">{s.tools}</p></div>
                    <div className="border-l-2 border-brand-dark pl-3"><p className="text-xs font-bold uppercase text-brand-dark">Mini görev</p><p className="mt-1 text-sm leading-6">{s.task}</p></div>
                  </div>}
                </div>
              </li>;
            })}
          </ol>
          {pct === 100 && <p className="mt-8 border-2 border-foreground bg-brand-pale p-4 text-sm font-bold">Patikayı bitirdin! Yaptığını topluluğa göstermek ister misin? <Link to="/contact" className="border-b border-brand-dark text-brand-dark">Bize yaz</Link></p>}
        </div>
      </section>;
    })}
    <section className="mx-auto max-w-5xl px-5 py-12 text-sm lg:px-8">Kaynak mı arıyorsun? <Link to="/resources" className="border-b border-brand-light font-bold text-brand-dark">Kaynaklar</Link> · Hangi aracı kuracağını mı soruyorsun? <Link to="/toolbox" className="border-b border-brand-light font-bold text-brand-dark">Araç Çantası</Link></section>
    <SloganMark />
  </>;
}
