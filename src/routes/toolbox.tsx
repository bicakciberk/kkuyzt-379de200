import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageIntro, SloganMark } from "@/components/site";
import { toolbox } from "@/lib/learning-content";

export const Route = createFileRoute("/toolbox")({
  head: () => ({ meta: [
    { title: "Araç Çantası — YZT · Geleceği Birlikte Şekillendirelim" },
    { name: "description", content: "Yapay zekâ çalışan öğrenciler için ücretsiz GPU, editör, veri ve öğrenci fırsatları rehberi." },
    { property: "og:title", content: "Mühendis Araç Çantası — YZT" },
    { property: "og:description", content: "Colab'dan GitHub Student Pack'e, YZT'nin her gün kullandığı araçlar." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Toolbox,
});

function Toolbox() {
  return <>
    <PageIntro eyebrow="Araç Çantası · 01" title="Masamızda ne var?"><p>Kurs değil, araç: kod yazarken, model eğitirken ve projeyi yayınlarken her gün açtığımız, çoğu ücretsiz servisler.</p></PageIntro>
    <div className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
      {toolbox.map((g, gi) => <section key={g.group} className="toolbox-group grid gap-8 border-t-2 border-foreground py-12 lg:grid-cols-[16rem_1fr]">
        <div><p className="eyebrow">{String(gi + 2).padStart(2, "0")} · Çekmece</p><h2 className="mt-3 font-display text-4xl">{g.group}</h2><p className="mt-2 text-sm text-muted-foreground">{g.note}</p></div>
        <ul className="divide-y divide-border border-y border-foreground">
          {g.tools.map((t) => <li key={t.name}><a href={t.url} target="_blank" rel="noreferrer" className="toolbox-row group grid gap-1 py-5 sm:grid-cols-[12rem_1fr_auto] sm:items-center sm:gap-6">
            <span className="font-display text-2xl">{t.name}</span>
            <span className="text-sm leading-6"><span className="font-bold text-brand-mid">{t.use}.</span> <span className="text-muted-foreground">{t.why}</span></span>
            <ArrowUpRight className="size-5 text-brand-dark transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a></li>)}
        </ul>
      </section>)}
      <p className="border-t-2 border-foreground pt-8 text-sm">Araçları kurdun, peki şimdi ne çalışacaksın? <Link to="/roadmaps" className="border-b border-brand-light font-bold text-brand-dark">Yol Haritaları</Link></p>
    </div>
    <SloganMark />
  </>;
}
