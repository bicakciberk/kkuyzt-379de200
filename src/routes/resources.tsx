import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageIntro, SloganMark } from "@/components/site";
import { resourceLevels } from "@/lib/extra-content";

export const Route = createFileRoute("/resources")({
  head: () => ({ meta: [
    { title: "Kaynaklar — YZT · Geleceği Birlikte Şekillendirelim" },
    { name: "description", content: "Yapay zekâ öğrenmek isteyenler için başlangıç, orta ve ileri seviye seçilmiş kurs, video, makale ve kod kaynakları." },
    { property: "og:title", content: "Kaynaklar — YZT" },
    { property: "og:description", content: "YZT'nin seviyelere göre derlediği yapay zekâ öğrenme listesi." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Resources,
});

const typeClass = { Kurs: "bg-brand-dark text-background", Makale: "bg-brand-pale text-brand-dark", Video: "bg-brand-mid text-background", Repo: "bg-brand-light text-background" } as const;

function Resources() {
  return <>
    <PageIntro eyebrow="Kaynaklar" title="Nereden başlasam?"><p>Topluluk olarak denediğimiz, sevdiğimiz ve arkadaşlarımıza önerdiğimiz kaynaklar. Seviyeni seç, sırayla ilerle.</p></PageIntro>
    {resourceLevels.map((lvl, li) => <section key={lvl.level} className={li % 2 ? "bg-muted" : "bg-background"}>
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <div className={`flex flex-col gap-4 border-b-2 border-foreground pb-6 md:flex-row md:items-end md:justify-between ${li === 1 ? "md:flex-row-reverse md:text-right" : ""}`}>
          <div><p className="eyebrow">{String(li + 2).padStart(2, "0")} · Seviye</p><h2 className="mt-3 font-display text-5xl md:text-6xl">{lvl.level}</h2></div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">{lvl.note}</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lvl.items.map((r, i) => <a key={r.title} href={r.url} target="_blank" rel="noreferrer" className={`resource-card group ${i % 3 === 1 ? "lg:translate-y-6" : ""}`}>
            <span className={`resource-type ${typeClass[r.type]} ${i % 2 ? "-rotate-2" : "rotate-2"}`}>{r.type}</span>
            <h3 className="mt-8 font-sans text-2xl leading-tight">{r.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{r.desc}</p>
            <span className="mt-6 inline-flex items-center gap-2 border-b border-brand-light pb-1 text-sm font-bold text-brand-dark group-hover:text-brand-light">Kaynağa git <ArrowUpRight className="size-4" /></span>
          </a>)}
        </div>
      </div>
    </section>)}
    <SloganMark />
  </>;
}
