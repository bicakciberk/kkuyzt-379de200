import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, BadgePercent, Check, CreditCard } from "lucide-react";
import { YztCardForm } from "@/components/forms";
import { DecorativeMotif, PageIntro, SloganMark, detailLinkClass } from "@/components/site";

export const Route = createFileRoute("/yzt-card")({
  head: () => ({ meta: [
    { title: "YZT Kart — YZT · Geleceği Birlikte Şekillendirelim" },
    { name: "description", content: "YZT Kart ile topluluk iş ortaklarının öğrenci avantajlarından yararlan." },
    { property: "og:title", content: "YZT Kart — Yapay Zeka Topluluğu" },
    { property: "og:description", content: "Geleceği birlikte şekillendirelim — YZT üyelerine özel iş ortağı avantajları." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: YztCardPage,
});

function CardPreview({ name }: { name: string }) {
  const display = name.trim();
  return <div className="yzt-card-preview" aria-label="YZT Kart örnek görünümü">
    <DecorativeMotif variant="neuron" tone="cream" position="right" size="small" speed={.04}/>
    <div className="motif-content flex h-full flex-col justify-between">
      <div className="flex items-start justify-between"><span className="grid size-12 place-items-center border border-background font-display text-xl">YZT</span><span className="text-right text-[10px] font-bold uppercase text-background/65">Kırıkkale Üniversitesi<br/>Yapay Zeka Topluluğu</span></div>
      <div><CreditCard className="size-7 text-poster-accent"/><p className="mt-3 font-display text-3xl">YZT Kart</p><p className="mt-1 text-xs text-background/65">Üye avantaj kartı</p></div>
      <div className="flex items-end justify-between border-t border-background/30 pt-3 text-[10px] font-bold uppercase"><span key={display} className={`yzt-card-name ${display ? "is-filled" : ""}`}>{display || "Ad Soyad"}</span><span>26 / Üye</span></div>
    </div>
  </div>;
}

function YztCardPage() {
  const [name, setName] = useState("");
  return <><PageIntro eyebrow="YZT Kart" title="Topluluğun avantajı cebinde."><p>YZT Kart, topluluk üyelerinin anlaşmalı iş ortaklarındaki güncel indirim ve fırsatlardan yararlanmasını sağlayan öğrenci avantaj kartıdır.</p></PageIntro>
    <section className="mx-auto grid max-w-7xl gap-14 px-5 py-20 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-8 lg:py-28">
      <CardPreview name={name}/>
      <div><p className="section-kicker">Nasıl çalışır?</p><h2 className="mt-5 font-display text-4xl leading-tight md:text-6xl">Tek kart, yerel avantajlar.</h2><ul className="mt-8 space-y-4">{["YZT üyeliğini kolayca doğrula.","İş ortaklarındaki güncel avantajlardan yararlan.","Yeni ortaklıklar eklendikçe büyüyen ağı takip et."].map((item)=><li key={item} className="flex items-center gap-3 border-b border-border pb-4 text-sm"><span className="grid size-7 shrink-0 place-items-center bg-primary text-primary-foreground"><Check className="size-4"/></span>{item}</li>)}</ul><Link to="/partners" className={`${detailLinkClass} mt-8`}>İş ortaklarını gör <ArrowRight className="size-4"/></Link></div>
    </section>
    <section className="border-y border-border bg-muted"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[.6fr_1.4fr] lg:px-8 lg:py-28"><aside className="border-l-2 border-primary pl-5"><BadgePercent className="size-7 text-primary"/><p className="mt-6 section-kicker">Başvuru</p><h2 className="mt-4 font-display text-4xl">Kartını iste.</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Bilgilerini gönder. Ekibimiz başvurunu inceleyip onay ve teslim süreci için sana ulaşsın.</p></aside><div className="border-t-2 border-foreground bg-background p-6 md:p-8"><YztCardForm onNameChange={setName}/></div></div></section><SloganMark/></>;
}